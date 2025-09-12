"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Play, Square, Trophy } from "lucide-react"
import Link from "next/link"

interface AdminMatchesClientProps {
  matches: any[]
  teams: any[]
}

export function AdminMatchesClient({ matches: initialMatches, teams }: AdminMatchesClientProps) {
  const [matches, setMatches] = useState(initialMatches)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newMatch, setNewMatch] = useState({
    home_team_id: "",
    away_team_id: "",
    match_date: "",
    venue: "",
  })
  const supabase = createClient()
  const { toast } = useToast()

  const liveMatches = matches.filter((match) => match.status === "live")
  const upcomingMatches = matches.filter((match) => match.status === "scheduled")
  const finishedMatches = matches.filter((match) => match.status === "finished")

  const createMatch = async () => {
    try {
      if (!newMatch.home_team_id || !newMatch.away_team_id || !newMatch.match_date || !newMatch.venue) {
        toast({
          title: "Missing Information",
          description: "Please fill in all fields",
          variant: "destructive",
        })
        return
      }

      if (newMatch.home_team_id === newMatch.away_team_id) {
        toast({
          title: "Invalid Match",
          description: "Home and away teams must be different",
          variant: "destructive",
        })
        return
      }

      const { data, error } = await supabase
        .from("matches")
        .insert({
          home_team_id: newMatch.home_team_id,
          away_team_id: newMatch.away_team_id,
          match_date: newMatch.match_date,
          venue: newMatch.venue,
          status: "scheduled",
        })
        .select(`
          *,
          home_team:teams!matches_home_team_id_fkey(name, logo_url),
          away_team:teams!matches_away_team_id_fkey(name, logo_url)
        `)

      if (error) throw error

      setMatches([...matches, ...data])
      setIsCreateDialogOpen(false)
      setNewMatch({ home_team_id: "", away_team_id: "", match_date: "", venue: "" })

      toast({
        title: "Match Created",
        description: "New match has been scheduled successfully",
      })
    } catch (error) {
      console.error("Error creating match:", error)
      toast({
        title: "Error",
        description: "Failed to create match",
        variant: "destructive",
      })
    }
  }

  const updateMatchStatus = async (matchId: string, status: string) => {
    try {
      const { error } = await supabase.from("matches").update({ status }).eq("id", matchId)

      if (error) throw error

      setMatches(matches.map((match) => (match.id === matchId ? { ...match, status } : match)))

      toast({
        title: "Match Updated",
        description: `Match status changed to ${status}`,
      })
    } catch (error) {
      console.error("Error updating match:", error)
      toast({
        title: "Error",
        description: "Failed to update match status",
        variant: "destructive",
      })
    }
  }

  const updateScore = async (matchId: string, homeScore: number, awayScore: number) => {
    try {
      const { error } = await supabase
        .from("matches")
        .update({ home_score: homeScore, away_score: awayScore })
        .eq("id", matchId)

      if (error) throw error

      setMatches(
        matches.map((match) =>
          match.id === matchId ? { ...match, home_score: homeScore, away_score: awayScore } : match,
        ),
      )

      toast({
        title: "Score Updated",
        description: `Score updated to ${homeScore}-${awayScore}`,
      })
    } catch (error) {
      console.error("Error updating score:", error)
      toast({
        title: "Error",
        description: "Failed to update score",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link href="/admin" className="text-muted-foreground hover:text-foreground">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold neon-text">Match Management</h1>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="neon-glow">
              <Plus className="w-4 h-4 mr-2" />
              Create Match
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Match</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="home_team">Home Team</Label>
                <Select
                  value={newMatch.home_team_id}
                  onValueChange={(value) => setNewMatch({ ...newMatch, home_team_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select home team" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="away_team">Away Team</Label>
                <Select
                  value={newMatch.away_team_id}
                  onValueChange={(value) => setNewMatch({ ...newMatch, away_team_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select away team" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="match_date">Match Date & Time</Label>
                <Input
                  id="match_date"
                  type="datetime-local"
                  value={newMatch.match_date}
                  onChange={(e) => setNewMatch({ ...newMatch, match_date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="venue">Venue</Label>
                <Input
                  id="venue"
                  placeholder="Stadium name"
                  value={newMatch.venue}
                  onChange={(e) => setNewMatch({ ...newMatch, venue: e.target.value })}
                />
              </div>
              <Button onClick={createMatch} className="w-full">
                Create Match
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="live" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="live">Live Matches ({liveMatches.length})</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming ({upcomingMatches.length})</TabsTrigger>
          <TabsTrigger value="finished">Finished ({finishedMatches.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="live" className="space-y-4">
          {liveMatches.length > 0 ? (
            liveMatches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                onUpdateStatus={updateMatchStatus}
                onUpdateScore={updateScore}
                isLive
              />
            ))
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No live matches</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingMatches.length > 0 ? (
            upcomingMatches.map((match) => (
              <MatchCard key={match.id} match={match} onUpdateStatus={updateMatchStatus} onUpdateScore={updateScore} />
            ))
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No upcoming matches</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="finished" className="space-y-4">
          {finishedMatches.length > 0 ? (
            finishedMatches.map((match) => (
              <MatchCard key={match.id} match={match} onUpdateStatus={updateMatchStatus} onUpdateScore={updateScore} />
            ))
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No finished matches</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function MatchCard({
  match,
  onUpdateStatus,
  onUpdateScore,
  isLive = false,
}: {
  match: any
  onUpdateStatus: (matchId: string, status: string) => void
  onUpdateScore: (matchId: string, homeScore: number, awayScore: number) => void
  isLive?: boolean
}) {
  const [homeScore, setHomeScore] = useState(match.home_score || 0)
  const [awayScore, setAwayScore] = useState(match.away_score || 0)

  const handleScoreUpdate = () => {
    onUpdateScore(match.id, homeScore, awayScore)
  }

  return (
    <Card className={`${isLive ? "border-primary/40" : "border-border"}`}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Badge
              variant={match.status === "live" ? "destructive" : match.status === "finished" ? "secondary" : "outline"}
            >
              {match.status.toUpperCase()}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {new Date(match.match_date).toLocaleDateString()} at{" "}
              {new Date(match.match_date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
          <span className="text-sm text-muted-foreground">{match.venue}</span>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <img
              src={match.home_team.logo_url || "/placeholder.svg"}
              alt={match.home_team.name}
              className="w-10 h-10 rounded"
            />
            <span className="font-medium">{match.home_team.name}</span>
          </div>

          <div className="flex items-center space-x-4">
            {match.status === "live" || match.status === "finished" ? (
              <div className="text-3xl font-bold">
                {match.home_score} - {match.away_score}
              </div>
            ) : (
              <span className="text-muted-foreground">VS</span>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <span className="font-medium">{match.away_team.name}</span>
            <img
              src={match.away_team.logo_url || "/placeholder.svg"}
              alt={match.away_team.name}
              className="w-10 h-10 rounded"
            />
          </div>
        </div>

        {/* Admin Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center space-x-2">
            {match.status === "scheduled" && (
              <Button size="sm" onClick={() => onUpdateStatus(match.id, "live")} className="bg-primary">
                <Play className="w-4 h-4 mr-1" />
                Start Match
              </Button>
            )}
            {match.status === "live" && (
              <Button size="sm" variant="outline" onClick={() => onUpdateStatus(match.id, "finished")}>
                <Square className="w-4 h-4 mr-1" />
                End Match
              </Button>
            )}
          </div>

          {(match.status === "live" || match.status === "finished") && (
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                min="0"
                value={homeScore}
                onChange={(e) => setHomeScore(Number.parseInt(e.target.value) || 0)}
                className="w-16 h-8 text-center"
              />
              <span>-</span>
              <Input
                type="number"
                min="0"
                value={awayScore}
                onChange={(e) => setAwayScore(Number.parseInt(e.target.value) || 0)}
                className="w-16 h-8 text-center"
              />
              <Button size="sm" onClick={handleScoreUpdate}>
                Update
              </Button>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline" asChild>
              <Link href={`/matches/${match.id}`}>
                <Trophy className="w-4 h-4 mr-1" />
                View
              </Link>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link href={`/admin/matches/${match.id}/events`}>
                <Edit className="w-4 h-4 mr-1" />
                Events
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
