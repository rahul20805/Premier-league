import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function ScoresPage() {
  const supabase = await createClient()

  // Get league table
  const { data: teams } = await supabase.from("teams").select("*").order("points", { ascending: false })

  // Get recent results
  const { data: recentMatches } = await supabase
    .from("matches")
    .select(`
      *,
      home_team:teams!matches_home_team_id_fkey(name, logo_url),
      away_team:teams!matches_away_team_id_fkey(name, logo_url)
    `)
    .eq("status", "finished")
    .order("match_date", { ascending: false })
    .limit(10)

  // Get upcoming fixtures
  const { data: upcomingMatches } = await supabase
    .from("matches")
    .select(`
      *,
      home_team:teams!matches_home_team_id_fkey(name, logo_url),
      away_team:teams!matches_away_team_id_fkey(name, logo_url)
    `)
    .eq("status", "scheduled")
    .order("match_date", { ascending: true })
    .limit(10)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 neon-text">Scores & Fixtures</h1>

      <Tabs defaultValue="table" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="table">League Table</TabsTrigger>
          <TabsTrigger value="results">Recent Results</TabsTrigger>
          <TabsTrigger value="fixtures">Upcoming Fixtures</TabsTrigger>
        </TabsList>

        <TabsContent value="table">
          <Card>
            <CardHeader>
              <CardTitle>Student Premier League Table</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4">Pos</th>
                      <th className="text-left p-4">Team</th>
                      <th className="text-center p-4">P</th>
                      <th className="text-center p-4">W</th>
                      <th className="text-center p-4">D</th>
                      <th className="text-center p-4">L</th>
                      <th className="text-center p-4">GF</th>
                      <th className="text-center p-4">GA</th>
                      <th className="text-center p-4">GD</th>
                      <th className="text-center p-4">Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teams?.map((team, index) => {
                      const played = team.wins + team.draws + team.losses
                      const goalDifference = 0 // This would need to be calculated from match results
                      return (
                        <tr key={team.id} className="border-b border-border/50 hover:bg-muted/20">
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-primary">{index + 1}</span>
                              {index < 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  Q
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <img
                                src={team.logo_url || "/placeholder.svg"}
                                alt={team.name}
                                className="w-8 h-8 rounded"
                              />
                              <span className="font-medium">{team.name}</span>
                            </div>
                          </td>
                          <td className="text-center p-4">{played}</td>
                          <td className="text-center p-4">{team.wins}</td>
                          <td className="text-center p-4">{team.draws}</td>
                          <td className="text-center p-4">{team.losses}</td>
                          <td className="text-center p-4">-</td>
                          <td className="text-center p-4">-</td>
                          <td className="text-center p-4">-</td>
                          <td className="text-center p-4 font-bold text-primary">{team.points}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results">
          <Card>
            <CardHeader>
              <CardTitle>Recent Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentMatches?.map((match) => (
                  <div key={match.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/20">
                    <div className="flex items-center space-x-4">
                      <Badge variant="secondary">FT</Badge>
                      <div className="text-sm text-muted-foreground">
                        {new Date(match.match_date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-3">
                        <img
                          src={match.home_team.logo_url || "/placeholder.svg"}
                          alt={match.home_team.name}
                          className="w-6 h-6 rounded"
                        />
                        <span className="font-medium">{match.home_team.name}</span>
                      </div>
                      <div className="text-xl font-bold">
                        {match.home_score} - {match.away_score}
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="font-medium">{match.away_team.name}</span>
                        <img
                          src={match.away_team.logo_url || "/placeholder.svg"}
                          alt={match.away_team.name}
                          className="w-6 h-6 rounded"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fixtures">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Fixtures</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingMatches?.map((match) => (
                  <div key={match.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/20">
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-muted-foreground">
                        {new Date(match.match_date).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(match.match_date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-3">
                        <img
                          src={match.home_team.logo_url || "/placeholder.svg"}
                          alt={match.home_team.name}
                          className="w-6 h-6 rounded"
                        />
                        <span className="font-medium">{match.home_team.name}</span>
                      </div>
                      <div className="text-muted-foreground">vs</div>
                      <div className="flex items-center space-x-3">
                        <span className="font-medium">{match.away_team.name}</span>
                        <img
                          src={match.away_team.logo_url || "/placeholder.svg"}
                          alt={match.away_team.name}
                          className="w-6 h-6 rounded"
                        />
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">{match.venue}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
