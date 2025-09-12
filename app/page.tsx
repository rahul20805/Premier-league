import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function HomePage() {
  const supabase = await createClient()

  // Fetch live matches
  const { data: liveMatches } = await supabase
    .from("matches")
    .select(`
      *,
      home_team:teams!matches_home_team_id_fkey(name, logo_url, color),
      away_team:teams!matches_away_team_id_fkey(name, logo_url, color)
    `)
    .eq("status", "live")
    .limit(3)

  // Fetch upcoming matches
  const { data: upcomingMatches } = await supabase
    .from("matches")
    .select(`
      *,
      home_team:teams!matches_home_team_id_fkey(name, logo_url, color),
      away_team:teams!matches_away_team_id_fkey(name, logo_url, color)
    `)
    .eq("status", "scheduled")
    .order("match_date", { ascending: true })
    .limit(3)

  // Fetch top teams
  const { data: topTeams } = await supabase.from("teams").select("*").order("points", { ascending: false }).limit(4)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center py-16 mb-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 neon-text">Student Premier League</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Experience the thrill of student sports with live matches, player stats, and exciting betting opportunities.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild className="neon-glow">
            <Link href="/matches">Watch Live Matches</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/betting">Start Betting</Link>
          </Button>
        </div>
      </section>

      {/* Live Matches Section */}
      {liveMatches && liveMatches.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">Live Matches</h2>
            <Button variant="outline" asChild>
              <Link href="/matches">View All</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveMatches.map((match: any) => (
              <Card key={match.id} className="border-primary/20 hover:border-primary/40 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="destructive" className="live-indicator">
                      LIVE
                    </Badge>
                    <span className="text-sm text-muted-foreground">{match.venue}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={match.home_team.logo_url || "/placeholder.svg"}
                        alt={match.home_team.name}
                        className="w-8 h-8 rounded"
                      />
                      <span className="font-medium">{match.home_team.name}</span>
                    </div>
                    <div className="text-2xl font-bold text-primary">{match.home_score}</div>
                  </div>
                  <div className="flex items-center justify-center py-2">
                    <span className="text-muted-foreground">VS</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={match.away_team.logo_url || "/placeholder.svg"}
                        alt={match.away_team.name}
                        className="w-8 h-8 rounded"
                      />
                      <span className="font-medium">{match.away_team.name}</span>
                    </div>
                    <div className="text-2xl font-bold text-primary">{match.away_score}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Upcoming Matches Section */}
      {upcomingMatches && upcomingMatches.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">Upcoming Matches</h2>
            <Button variant="outline" asChild>
              <Link href="/scores">View Fixtures</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingMatches.map((match: any) => (
              <Card key={match.id} className="hover:border-primary/40 transition-colors">
                <CardContent className="pt-6">
                  <div className="text-center mb-4">
                    <p className="text-sm text-muted-foreground">
                      {new Date(match.match_date).toLocaleDateString()} at{" "}
                      {new Date(match.match_date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                    <p className="text-sm text-muted-foreground">{match.venue}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={match.home_team.logo_url || "/placeholder.svg"}
                        alt={match.home_team.name}
                        className="w-8 h-8 rounded"
                      />
                      <span className="font-medium">{match.home_team.name}</span>
                    </div>
                    <span className="text-muted-foreground">VS</span>
                    <div className="flex items-center space-x-3">
                      <span className="font-medium">{match.away_team.name}</span>
                      <img
                        src={match.away_team.logo_url || "/placeholder.svg"}
                        alt={match.away_team.name}
                        className="w-8 h-8 rounded"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button className="w-full bg-transparent" variant="outline" asChild>
                      <Link href={`/betting?match=${match.id}`}>Place Bet</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* League Table Preview */}
      {topTeams && topTeams.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">League Table</h2>
            <Button variant="outline" asChild>
              <Link href="/scores">Full Table</Link>
            </Button>
          </div>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4">Pos</th>
                      <th className="text-left p-4">Team</th>
                      <th className="text-center p-4">W</th>
                      <th className="text-center p-4">D</th>
                      <th className="text-center p-4">L</th>
                      <th className="text-center p-4">Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topTeams.map((team: any, index: number) => (
                      <tr key={team.id} className="border-b border-border/50 hover:bg-muted/20">
                        <td className="p-4 font-bold text-primary">{index + 1}</td>
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={team.logo_url || "/placeholder.svg"}
                              alt={team.name}
                              className="w-6 h-6 rounded"
                            />
                            <span className="font-medium">{team.name}</span>
                          </div>
                        </td>
                        <td className="text-center p-4">{team.wins}</td>
                        <td className="text-center p-4">{team.draws}</td>
                        <td className="text-center p-4">{team.losses}</td>
                        <td className="text-center p-4 font-bold text-primary">{team.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  )
}
