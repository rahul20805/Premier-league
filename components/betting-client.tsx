"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Coins, TrendingUp, Clock } from "lucide-react"
import Link from "next/link"

interface BettingClientProps {
  matches: any[]
  userProfile: any
  userBets: any[]
}

interface BetSlipItem {
  matchId: string
  betType: string
  betValue: string
  odds: number
  matchInfo: any
}

export function BettingClient({ matches, userProfile, userBets }: BettingClientProps) {
  const [betSlip, setBetSlip] = useState<BetSlipItem[]>([])
  const [coins, setCoins] = useState(userProfile?.coins || 0)
  const supabase = createClient()
  const { toast } = useToast()

  // Generate dynamic odds based on match and bet type
  const generateOdds = (match: any, betType: string, betValue: string) => {
    const baseOdds = {
      home_win: 2.1,
      away_win: 2.3,
      draw: 3.2,
      over_under: 1.8,
      correct_score: 8.5,
    }

    // Add some randomness and match-specific factors
    const randomFactor = 0.8 + Math.random() * 0.4 // 0.8 to 1.2
    const statusMultiplier = match.status === "live" ? 1.1 : 1.0

    return Number.parseFloat((baseOdds[betType as keyof typeof baseOdds] * randomFactor * statusMultiplier).toFixed(2))
  }

  const addToBetSlip = (match: any, betType: string, betValue: string) => {
    const odds = generateOdds(match, betType, betValue)
    const newBet: BetSlipItem = {
      matchId: match.id,
      betType,
      betValue,
      odds,
      matchInfo: match,
    }

    // Check if bet already exists
    const existingBetIndex = betSlip.findIndex(
      (bet) => bet.matchId === match.id && bet.betType === betType && bet.betValue === betValue,
    )

    if (existingBetIndex >= 0) {
      // Update existing bet
      const updatedBetSlip = [...betSlip]
      updatedBetSlip[existingBetIndex] = newBet
      setBetSlip(updatedBetSlip)
    } else {
      setBetSlip([...betSlip, newBet])
    }

    toast({
      title: "Added to Bet Slip",
      description: `${betValue} at ${odds}x odds`,
    })
  }

  const removeFromBetSlip = (index: number) => {
    setBetSlip(betSlip.filter((_, i) => i !== index))
  }

  const placeBets = async (betAmounts: { [key: number]: number }) => {
    try {
      const betsToPlace = betSlip
        .map((bet, index) => ({
          ...bet,
          amount: betAmounts[index] || 0,
        }))
        .filter((bet) => bet.amount > 0)

      if (betsToPlace.length === 0) {
        toast({
          title: "No Bets to Place",
          description: "Please enter bet amounts",
          variant: "destructive",
        })
        return
      }

      const totalAmount = betsToPlace.reduce((sum, bet) => sum + bet.amount, 0)

      if (totalAmount > coins) {
        toast({
          title: "Insufficient Coins",
          description: "You don't have enough coins for these bets",
          variant: "destructive",
        })
        return
      }

      // Place bets in database
      const { error: betsError } = await supabase.from("bets").insert(
        betsToPlace.map((bet) => ({
          user_id: userProfile.id,
          match_id: bet.matchId,
          bet_type: bet.betType,
          bet_value: bet.betValue,
          amount: bet.amount,
          odds: bet.odds,
          potential_payout: Math.round(bet.amount * bet.odds),
          status: "pending",
        })),
      )

      if (betsError) throw betsError

      // Update user coins
      const newCoins = coins - totalAmount
      const { error: coinsError } = await supabase.from("profiles").update({ coins: newCoins }).eq("id", userProfile.id)

      if (coinsError) throw coinsError

      setCoins(newCoins)
      setBetSlip([])

      toast({
        title: "Bets Placed Successfully!",
        description: `${betsToPlace.length} bets placed for ${totalAmount} coins`,
      })
    } catch (error) {
      console.error("Error placing bets:", error)
      toast({
        title: "Error",
        description: "Failed to place bets. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold neon-text">Betting</h1>
        <div className="flex items-center space-x-2 bg-card border border-primary/20 rounded-lg px-4 py-2">
          <Coins className="w-5 h-5 text-primary" />
          <span className="font-bold text-primary">{coins}</span>
          <span className="text-muted-foreground">coins</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Available Matches */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upcoming">Upcoming Matches</TabsTrigger>
              <TabsTrigger value="live">Live Matches</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-4">
              {matches
                .filter((match) => match.status === "scheduled")
                .map((match) => (
                  <MatchBettingCard key={match.id} match={match} onAddToBetSlip={addToBetSlip} />
                ))}
            </TabsContent>

            <TabsContent value="live" className="space-y-4">
              {matches
                .filter((match) => match.status === "live")
                .map((match) => (
                  <MatchBettingCard key={match.id} match={match} onAddToBetSlip={addToBetSlip} isLive />
                ))}
            </TabsContent>
          </Tabs>
        </div>

        {/* Bet Slip */}
        <div className="space-y-6">
          <BetSlip
            betSlip={betSlip}
            onRemoveFromBetSlip={removeFromBetSlip}
            onPlaceBets={placeBets}
            userCoins={coins}
          />

          {/* Active Bets */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Active Bets</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userBets.length > 0 ? (
                <div className="space-y-3">
                  {userBets.slice(0, 5).map((bet) => (
                    <div key={bet.id} className="p-3 rounded-lg bg-muted/20">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium">
                          {bet.match.home_team.name} vs {bet.match.away_team.name}
                        </div>
                        <Badge variant="outline">{bet.odds}x</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {bet.bet_value} • {bet.amount} coins → {bet.potential_payout} coins
                      </div>
                    </div>
                  ))}
                  {userBets.length > 5 && (
                    <Button variant="outline" size="sm" asChild className="w-full bg-transparent">
                      <Link href="/betting/history">View All Bets</Link>
                    </Button>
                  )}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">No active bets</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function MatchBettingCard({
  match,
  onAddToBetSlip,
  isLive = false,
}: {
  match: any
  onAddToBetSlip: (match: any, betType: string, betValue: string) => void
  isLive?: boolean
}) {
  return (
    <Card className={`${isLive ? "border-primary/40" : "border-border"} hover:border-primary/60 transition-colors`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {isLive && (
              <Badge variant="destructive" className="live-indicator">
                LIVE
              </Badge>
            )}
            <span className="text-sm text-muted-foreground">
              {new Date(match.match_date).toLocaleDateString()} at{" "}
              {new Date(match.match_date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
          <span className="text-sm text-muted-foreground">{match.venue}</span>
        </div>
      </CardHeader>
      <CardContent>
        {/* Teams */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <img
              src={match.home_team.logo_url || "/placeholder.svg"}
              alt={match.home_team.name}
              className="w-10 h-10 rounded"
            />
            <span className="font-medium">{match.home_team.name}</span>
          </div>
          {isLive && (
            <div className="text-2xl font-bold text-primary">
              {match.home_score} - {match.away_score}
            </div>
          )}
          {!isLive && <span className="text-muted-foreground">VS</span>}
          <div className="flex items-center space-x-3">
            <span className="font-medium">{match.away_team.name}</span>
            <img
              src={match.away_team.logo_url || "/placeholder.svg"}
              alt={match.away_team.name}
              className="w-10 h-10 rounded"
            />
          </div>
        </div>

        {/* Betting Options */}
        <div className="space-y-4">
          {/* Match Result */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Match Result</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddToBetSlip(match, "home_win", `${match.home_team.name} Win`)}
                className="flex flex-col py-3 h-auto"
              >
                <span className="text-xs">Home Win</span>
                <span className="font-bold">2.1x</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddToBetSlip(match, "draw", "Draw")}
                className="flex flex-col py-3 h-auto"
              >
                <span className="text-xs">Draw</span>
                <span className="font-bold">3.2x</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddToBetSlip(match, "away_win", `${match.away_team.name} Win`)}
                className="flex flex-col py-3 h-auto"
              >
                <span className="text-xs">Away Win</span>
                <span className="font-bold">2.3x</span>
              </Button>
            </div>
          </div>

          {/* Over/Under */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Total Goals</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddToBetSlip(match, "over_under", "Over 2.5 Goals")}
                className="flex flex-col py-3 h-auto"
              >
                <span className="text-xs">Over 2.5</span>
                <span className="font-bold">1.8x</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddToBetSlip(match, "over_under", "Under 2.5 Goals")}
                className="flex flex-col py-3 h-auto"
              >
                <span className="text-xs">Under 2.5</span>
                <span className="font-bold">1.9x</span>
              </Button>
            </div>
          </div>

          {/* Correct Score */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Correct Score (Popular)</Label>
            <div className="grid grid-cols-4 gap-1">
              {["1-0", "2-1", "1-1", "0-0"].map((score) => (
                <Button
                  key={score}
                  variant="outline"
                  size="sm"
                  onClick={() => onAddToBetSlip(match, "correct_score", `Correct Score ${score}`)}
                  className="flex flex-col py-2 h-auto text-xs"
                >
                  <span>{score}</span>
                  <span className="font-bold">8.5x</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function BetSlip({
  betSlip,
  onRemoveFromBetSlip,
  onPlaceBets,
  userCoins,
}: {
  betSlip: BetSlipItem[]
  onRemoveFromBetSlip: (index: number) => void
  onPlaceBets: (betAmounts: { [key: number]: number }) => void
  userCoins: number
}) {
  const [betAmounts, setBetAmounts] = useState<{ [key: number]: number }>({})

  const updateBetAmount = (index: number, amount: number) => {
    setBetAmounts({ ...betAmounts, [index]: amount })
  }

  const totalStake = Object.values(betAmounts).reduce((sum, amount) => sum + (amount || 0), 0)
  const totalPotentialPayout = betSlip.reduce((sum, bet, index) => {
    const amount = betAmounts[index] || 0
    return sum + amount * bet.odds
  }, 0)

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5" />
          <span>Bet Slip</span>
          {betSlip.length > 0 && <Badge variant="secondary">{betSlip.length}</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {betSlip.length > 0 ? (
          <div className="space-y-4">
            {betSlip.map((bet, index) => (
              <div key={`${bet.matchId}-${bet.betType}-${bet.betValue}`} className="p-3 rounded-lg bg-muted/20">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="text-sm font-medium">{bet.betValue}</div>
                    <div className="text-xs text-muted-foreground">
                      {bet.matchInfo.home_team.name} vs {bet.matchInfo.away_team.name}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{bet.odds}x</Badge>
                    <Button variant="ghost" size="sm" onClick={() => onRemoveFromBetSlip(index)}>
                      ×
                    </Button>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    placeholder="Stake"
                    min="1"
                    max={userCoins}
                    value={betAmounts[index] || ""}
                    onChange={(e) => updateBetAmount(index, Number.parseInt(e.target.value) || 0)}
                    className="h-8 text-sm"
                  />
                  <span className="text-xs text-muted-foreground">coins</span>
                </div>
                {betAmounts[index] && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Potential payout: {Math.round((betAmounts[index] || 0) * bet.odds)} coins
                  </div>
                )}
              </div>
            ))}

            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total Stake:</span>
                <span className="font-bold">{totalStake} coins</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Potential Payout:</span>
                <span className="font-bold text-primary">{Math.round(totalPotentialPayout)} coins</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Potential Profit:</span>
                <span className="font-bold text-secondary">{Math.round(totalPotentialPayout - totalStake)} coins</span>
              </div>
            </div>

            <Button
              onClick={() => onPlaceBets(betAmounts)}
              disabled={totalStake === 0 || totalStake > userCoins}
              className="w-full neon-glow"
            >
              {totalStake > userCoins ? "Insufficient Coins" : `Place Bets (${totalStake} coins)`}
            </Button>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-2">Your bet slip is empty</p>
            <p className="text-sm text-muted-foreground">Click on odds to add bets</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
