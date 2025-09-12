import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function MatchesPage() {
  const supabase = await createClient()

  const { data: matches } = await supabase
    .from("matches")
    .select(`
      *,
      home_team:teams!matches_home_team_id_fkey(name, logo_url, color),
      away_team:teams!matches_away_team_id_fkey(name, logo_url, color)
    `)
    .order("match_date", { ascending: true })

  const liveMatches = matches?.filter((match) => match.status === "live") || []
  const upcomingMatches = matches?.filter((match) => match.status === "scheduled") || []
  const finishedMatches = matches?.filter((match) => match.status === "finished") || []

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 neon-text">Matches</h1>

      {/* Live Matches */}
      {liveMatches.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Live Now</h2>
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
                  <div className="space-y-4">
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
                    <Button className="w-full bg-transparent" variant="outline" asChild>
                      <Link href={`/betting?match=${match.id}`}>Place Live Bet</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Upcoming Matches */}
      {upcomingMatches.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Upcoming</h2>
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
                  <div className="space-y-4">
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

      {/* Recent Results */}
      {finishedMatches.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6">Recent Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {finishedMatches.slice(0, 6).map((match: any) => (
              <Card key={match.id} className="hover:border-primary/40 transition-colors">
                <CardContent className="pt-6">
                  <div className="text-center mb-4">
                    <Badge variant="secondary">Final</Badge>
                    <p className="text-sm text-muted-foreground mt-2">
                      {new Date(match.match_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={match.home_team.logo_url || "/placeholder.svg"}
                          alt={match.home_team.name}
                          className="w-8 h-8 rounded"
                        />
                        <span className="font-medium">{match.home_team.name}</span>
                      </div>
                      <div className="text-2xl font-bold">{match.home_score}</div>
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
                      <div className="text-2xl font-bold">{match.away_score}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
