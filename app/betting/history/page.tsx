import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { ArrowLeft, TrendingUp, TrendingDown, Clock } from "lucide-react"

export default async function BettingHistoryPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const { data: allBets } = await supabase
    .from("bets")
    .select(`
      *,
      match:matches(
        *,
        home_team:teams!matches_home_team_id_fkey(name, logo_url),
        away_team:teams!matches_away_team_id_fkey(name, logo_url)
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const pendingBets = allBets?.filter((bet) => bet.status === "pending") || []
  const wonBets = allBets?.filter((bet) => bet.status === "won") || []
  const lostBets = allBets?.filter((bet) => bet.status === "lost") || []

  const totalStaked = allBets?.reduce((sum, bet) => sum + bet.amount, 0) || 0
  const totalWon = wonBets.reduce((sum, bet) => sum + bet.potential_payout, 0)
  const totalLost = lostBets.reduce((sum, bet) => sum + bet.amount, 0)
  const netProfit = totalWon - totalLost

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/betting">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Betting
            </Link>
          </Button>
          <h1 className="text-4xl font-bold neon-text">Betting History</h1>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Current Balance</div>
          <div className="text-2xl font-bold text-primary">{profile?.coins || 0} coins</div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="text-2xl font-bold">{allBets?.length || 0}</div>
                <div className="text-sm text-muted-foreground">Total Bets</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <div>
                <div className="text-2xl font-bold text-primary">{totalWon}</div>
                <div className="text-sm text-muted-foreground">Total Won</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <TrendingDown className="w-5 h-5 text-destructive" />
              <div>
                <div className="text-2xl font-bold text-destructive">{totalLost}</div>
                <div className="text-sm text-muted-foreground">Total Lost</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <div className={`text-2xl font-bold ${netProfit >= 0 ? "text-primary" : "text-destructive"}`}>
                {netProfit >= 0 ? "+" : ""}
                {netProfit}
              </div>
              <div className="text-sm text-muted-foreground">Net Profit</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Betting History Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Bets ({allBets?.length || 0})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingBets.length})</TabsTrigger>
          <TabsTrigger value="won">Won ({wonBets.length})</TabsTrigger>
          <TabsTrigger value="lost">Lost ({lostBets.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <BetsList bets={allBets || []} />
        </TabsContent>
        <TabsContent value="pending">
          <BetsList bets={pendingBets} />
        </TabsContent>
        <TabsContent value="won">
          <BetsList bets={wonBets} />
        </TabsContent>
        <TabsContent value="lost">
          <BetsList bets={lostBets} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function BetsList({ bets }: { bets: any[] }) {
  if (bets.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No bets found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {bets.map((bet) => (
        <Card key={bet.id} className="hover:border-primary/40 transition-colors">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge
                    variant={bet.status === "won" ? "default" : bet.status === "lost" ? "destructive" : "secondary"}
                  >
                    {bet.status.toUpperCase()}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{new Date(bet.created_at).toLocaleDateString()}</span>
                </div>
                <div className="font-medium mb-1">{bet.bet_value}</div>
                <div className="text-sm text-muted-foreground mb-2">
                  {bet.match.home_team.name} vs {bet.match.away_team.name}
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <span>Stake: {bet.amount} coins</span>
                  <span>Odds: {bet.odds}x</span>
                  <span>Potential: {bet.potential_payout} coins</span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2 mb-2">
                  <img
                    src={bet.match.home_team.logo_url || "/placeholder.svg"}
                    alt={bet.match.home_team.name}
                    className="w-6 h-6 rounded"
                  />
                  <span className="text-sm">
                    {bet.match.home_score !== null ? `${bet.match.home_score}-${bet.match.away_score}` : "vs"}
                  </span>
                  <img
                    src={bet.match.away_team.logo_url || "/placeholder.svg"}
                    alt={bet.match.away_team.name}
                    className="w-6 h-6 rounded"
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(bet.match.match_date).toLocaleDateString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
