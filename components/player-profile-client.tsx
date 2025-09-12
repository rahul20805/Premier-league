"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { ArrowLeft, Target } from "lucide-react"

interface PlayerProfileClientProps {
  player: any
  playerEvents: any[]
  recentMatches: any[]
  similarPlayers: any[]
}

export function PlayerProfileClient({ player, playerEvents, recentMatches, similarPlayers }: PlayerProfileClientProps) {
  const goals = playerEvents.filter((event) => event.event_type === "goal").length
  const assists = playerEvents.filter((event) => event.event_type === "assist").length
  const yellowCards = playerEvents.filter((event) => event.event_type === "yellow_card").length
  const redCards = playerEvents.filter((event) => event.event_type === "red_card").length

  const goalsPerMatch = player.matches_played > 0 ? (goals / player.matches_played).toFixed(2) : "0.00"
  const assistsPerMatch = player.matches_played > 0 ? (assists / player.matches_played).toFixed(2) : "0.00"

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/players">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Players
        </Link>
      </Button>

      {/* Player Header */}
      <Card className="mb-8 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Player Photo */}
            <div className="relative">
              <img
                src={player.photo_url || "/placeholder.svg?height=200&width=200"}
                alt={player.name}
                className="w-48 h-48 rounded-full object-cover border-4 border-primary/20"
              />
              <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
                {player.jersey_number}
              </div>
            </div>

            {/* Player Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold mb-2 neon-text">{player.name}</h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-4">
                <Badge variant="outline" className="text-lg px-3 py-1">
                  {player.position}
                </Badge>
                <div className="flex items-center space-x-2">
                  <img
                    src={player.team?.logo_url || "/placeholder.svg"}
                    alt={player.team?.name}
                    className="w-8 h-8 rounded"
                  />
                  <span className="text-lg font-medium">{player.team?.name}</span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{player.goals}</div>
                  <div className="text-sm text-muted-foreground">Goals</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary">{player.assists}</div>
                  <div className="text-sm text-muted-foreground">Assists</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{player.matches_played}</div>
                  <div className="text-sm text-muted-foreground">Matches</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{player.goals + player.assists}</div>
                  <div className="text-sm text-muted-foreground">G+A</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Player Details Tabs */}
      <Tabs defaultValue="stats" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="events">Match Events</TabsTrigger>
          <TabsTrigger value="matches">Recent Matches</TabsTrigger>
          <TabsTrigger value="compare">Compare</TabsTrigger>
        </TabsList>

        <TabsContent value="stats" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Performance Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Goals per Match</span>
                    <span className="font-bold">{goalsPerMatch}</span>
                  </div>
                  <Progress value={Number.parseFloat(goalsPerMatch) * 50} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Assists per Match</span>
                    <span className="font-bold">{assistsPerMatch}</span>
                  </div>
                  <Progress value={Number.parseFloat(assistsPerMatch) * 50} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Match Participation</span>
                    <span className="font-bold">{((player.matches_played / 10) * 100).toFixed(0)}%</span>
                  </div>
                  <Progress value={(player.matches_played / 10) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Discipline */}
            <Card>
              <CardHeader>
                <CardTitle>Discipline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <span className="text-yellow-500">🟨</span>
                    <span>Yellow Cards</span>
                  </span>
                  <span className="text-2xl font-bold">{player.yellow_cards}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <span className="text-red-500">🟥</span>
                    <span>Red Cards</span>
                  </span>
                  <span className="text-2xl font-bold">{player.red_cards}</span>
                </div>
                <div className="pt-4 border-t border-border">
                  <div className="text-sm text-muted-foreground">
                    Cards per Match:{" "}
                    {player.matches_played > 0
                      ? ((player.yellow_cards + player.red_cards) / player.matches_played).toFixed(2)
                      : "0.00"}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Season Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Season Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{player.goals}</div>
                  <div className="text-sm text-muted-foreground">Total Goals</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-secondary">{player.assists}</div>
                  <div className="text-sm text-muted-foreground">Total Assists</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{player.matches_played}</div>
                  <div className="text-sm text-muted-foreground">Matches Played</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-500">{player.yellow_cards}</div>
                  <div className="text-sm text-muted-foreground">Yellow Cards</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-500">{player.red_cards}</div>
                  <div className="text-sm text-muted-foreground">Red Cards</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Match Events</CardTitle>
            </CardHeader>
            <CardContent>
              {playerEvents.length > 0 ? (
                <div className="space-y-4">
                  {playerEvents.map((event) => (
                    <div key={event.id} className="flex items-center space-x-4 p-3 rounded-lg bg-muted/20">
                      <div className="text-2xl">
                        {event.event_type === "goal" && "⚽"}
                        {event.event_type === "yellow_card" && "🟨"}
                        {event.event_type === "red_card" && "🟥"}
                        {event.event_type === "substitution" && "🔄"}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium capitalize">{event.event_type.replace("_", " ")}</div>
                        <div className="text-sm text-muted-foreground">
                          {event.match.home_team.name} vs {event.match.away_team.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(event.match.match_date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-sm font-bold text-primary">{event.minute}'</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No events recorded yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="matches" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Team Matches</CardTitle>
            </CardHeader>
            <CardContent>
              {recentMatches.length > 0 ? (
                <div className="space-y-4">
                  {recentMatches.map((match) => (
                    <div key={match.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <img
                            src={match.home_team.logo_url || "/placeholder.svg"}
                            alt={match.home_team.name}
                            className="w-6 h-6 rounded"
                          />
                          <span className="font-medium">{match.home_team.name}</span>
                        </div>
                        <span className="text-lg font-bold">
                          {match.home_score} - {match.away_score}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{match.away_team.name}</span>
                          <img
                            src={match.away_team.logo_url || "/placeholder.svg"}
                            alt={match.away_team.name}
                            className="w-6 h-6 rounded"
                          />
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(match.match_date).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No recent matches found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compare" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Similar Players</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {similarPlayers.map((similarPlayer) => (
                  <div key={similarPlayer.id} className="flex items-center space-x-4 p-3 rounded-lg bg-muted/20">
                    <img
                      src={similarPlayer.photo_url || "/placeholder.svg?height=50&width=50"}
                      alt={similarPlayer.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <Link href={`/players/${similarPlayer.id}`} className="font-medium hover:text-primary">
                        {similarPlayer.name}
                      </Link>
                      <div className="text-sm text-muted-foreground flex items-center space-x-2">
                        <img
                          src={similarPlayer.team?.logo_url || "/placeholder.svg"}
                          alt={similarPlayer.team?.name}
                          className="w-4 h-4 rounded"
                        />
                        <span>{similarPlayer.team?.name}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">
                        <span className="text-primary font-bold">{similarPlayer.goals}</span>G{" "}
                        <span className="text-secondary font-bold">{similarPlayer.assists}</span>A
                      </div>
                    </div>
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
