"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

interface LiveMatchClientProps {
  match: any
  events: any[]
  homeTeamPlayers: any[]
  awayTeamPlayers: any[]
}

export function LiveMatchClient({
  match: initialMatch,
  events: initialEvents,
  homeTeamPlayers,
  awayTeamPlayers,
}: LiveMatchClientProps) {
  const [match, setMatch] = useState(initialMatch)
  const [events, setEvents] = useState(initialEvents)
  const [currentMinute, setCurrentMinute] = useState(0)
  const supabase = createClient()

  useEffect(() => {
    // Subscribe to match updates
    const matchChannel = supabase
      .channel(`match-${match.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "matches",
          filter: `id=eq.${match.id}`,
        },
        (payload) => {
          if (payload.eventType === "UPDATE") {
            setMatch((prev: any) => ({ ...prev, ...payload.new }))
          }
        },
      )
      .subscribe()

    // Subscribe to match events
    const eventsChannel = supabase
      .channel(`match-events-${match.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "match_events",
          filter: `match_id=eq.${match.id}`,
        },
        async (payload) => {
          if (payload.eventType === "INSERT") {
            // Fetch the new event with player data
            const { data: newEvent } = await supabase
              .from("match_events")
              .select(`
                *,
                player:players(name, jersey_number)
              `)
              .eq("id", payload.new.id)
              .single()

            if (newEvent) {
              setEvents((prev) => [...prev, newEvent].sort((a, b) => a.minute - b.minute))
            }
          }
        },
      )
      .subscribe()

    // Simulate live match time if match is live
    let interval: NodeJS.Timeout
    if (match.status === "live") {
      interval = setInterval(() => {
        setCurrentMinute((prev) => prev + 1)
      }, 60000) // Update every minute
    }

    return () => {
      matchChannel.unsubscribe()
      eventsChannel.unsubscribe()
      if (interval) clearInterval(interval)
    }
  }, [match.id, match.status, supabase])

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case "goal":
        return "⚽"
      case "yellow_card":
        return "🟨"
      case "red_card":
        return "🟥"
      case "substitution":
        return "🔄"
      case "penalty":
        return "🥅"
      default:
        return "📝"
    }
  }

  const getEventDescription = (event: any) => {
    const playerName = event.player?.name || "Unknown Player"
    const jerseyNumber = event.player?.jersey_number ? `#${event.player.jersey_number}` : ""

    switch (event.event_type) {
      case "goal":
        return `Goal by ${playerName} ${jerseyNumber}`
      case "yellow_card":
        return `Yellow card for ${playerName} ${jerseyNumber}`
      case "red_card":
        return `Red card for ${playerName} ${jerseyNumber}`
      case "substitution":
        return `Substitution: ${playerName} ${jerseyNumber}`
      case "penalty":
        return `Penalty awarded`
      default:
        return event.description || "Match event"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Match Header */}
      <Card className="mb-8 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {match.status === "live" && (
                <Badge variant="destructive" className="live-indicator">
                  LIVE
                </Badge>
              )}
              {match.status === "finished" && <Badge variant="secondary">FINAL</Badge>}
              {match.status === "scheduled" && <Badge variant="outline">SCHEDULED</Badge>}
              <span className="text-sm text-muted-foreground">{match.venue}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {new Date(match.match_date).toLocaleDateString()} at{" "}
              {new Date(match.match_date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            {/* Home Team */}
            <div className="flex items-center space-x-4 flex-1">
              <img
                src={match.home_team.logo_url || "/placeholder.svg"}
                alt={match.home_team.name}
                className="w-16 h-16 rounded"
              />
              <div>
                <h2 className="text-2xl font-bold">{match.home_team.name}</h2>
                <p className="text-muted-foreground">Home</p>
              </div>
            </div>

            {/* Score */}
            <div className="text-center px-8">
              <div className="text-6xl font-bold text-primary">
                {match.home_score} - {match.away_score}
              </div>
              {match.status === "live" && (
                <div className="text-sm text-muted-foreground mt-2">
                  {currentMinute > 0 ? `${currentMinute}'` : "Live"}
                </div>
              )}
            </div>

            {/* Away Team */}
            <div className="flex items-center space-x-4 flex-1 justify-end">
              <div className="text-right">
                <h2 className="text-2xl font-bold">{match.away_team.name}</h2>
                <p className="text-muted-foreground">Away</p>
              </div>
              <img
                src={match.away_team.logo_url || "/placeholder.svg"}
                alt={match.away_team.name}
                className="w-16 h-16 rounded"
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex justify-center space-x-4 mt-6">
            <Button variant="outline" asChild>
              <Link href={`/betting?match=${match.id}`}>Place Bet</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/matches">All Matches</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Match Details Tabs */}
      <Tabs defaultValue="events" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="events">Match Events</TabsTrigger>
          <TabsTrigger value="lineups">Lineups</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="info">Match Info</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Match Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              {events.length > 0 ? (
                <div className="space-y-4">
                  {events.map((event) => (
                    <div key={event.id} className="flex items-center space-x-4 p-3 rounded-lg bg-muted/20">
                      <div className="text-2xl">{getEventIcon(event.event_type)}</div>
                      <div className="flex-1">
                        <div className="font-medium">{getEventDescription(event)}</div>
                        <div className="text-sm text-muted-foreground">{event.description}</div>
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

        <TabsContent value="lineups" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Home Team Lineup */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <img
                    src={match.home_team.logo_url || "/placeholder.svg"}
                    alt={match.home_team.name}
                    className="w-6 h-6 rounded"
                  />
                  <span>{match.home_team.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {homeTeamPlayers.map((player) => (
                    <div key={player.id} className="flex items-center justify-between p-2 rounded bg-muted/20">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                          {player.jersey_number}
                        </div>
                        <div>
                          <div className="font-medium">{player.name}</div>
                          <div className="text-sm text-muted-foreground">{player.position}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Away Team Lineup */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <img
                    src={match.away_team.logo_url || "/placeholder.svg"}
                    alt={match.away_team.name}
                    className="w-6 h-6 rounded"
                  />
                  <span>{match.away_team.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {awayTeamPlayers.map((player) => (
                    <div key={player.id} className="flex items-center justify-between p-2 rounded bg-muted/20">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-sm font-bold">
                          {player.jersey_number}
                        </div>
                        <div>
                          <div className="font-medium">{player.name}</div>
                          <div className="text-sm text-muted-foreground">{player.position}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Match Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Goals */}
                <div className="flex items-center justify-between">
                  <span className="font-medium">Goals</span>
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl font-bold text-primary">{match.home_score}</span>
                    <span className="text-muted-foreground">-</span>
                    <span className="text-2xl font-bold text-primary">{match.away_score}</span>
                  </div>
                </div>

                {/* Cards */}
                <div className="flex items-center justify-between">
                  <span className="font-medium">Yellow Cards</span>
                  <div className="flex items-center space-x-4">
                    <span className="text-lg">
                      {
                        events.filter(
                          (e) => e.event_type === "yellow_card" && homeTeamPlayers.some((p) => p.id === e.player_id),
                        ).length
                      }
                    </span>
                    <span className="text-muted-foreground">-</span>
                    <span className="text-lg">
                      {
                        events.filter(
                          (e) => e.event_type === "yellow_card" && awayTeamPlayers.some((p) => p.id === e.player_id),
                        ).length
                      }
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium">Red Cards</span>
                  <div className="flex items-center space-x-4">
                    <span className="text-lg">
                      {
                        events.filter(
                          (e) => e.event_type === "red_card" && homeTeamPlayers.some((p) => p.id === e.player_id),
                        ).length
                      }
                    </span>
                    <span className="text-muted-foreground">-</span>
                    <span className="text-lg">
                      {
                        events.filter(
                          (e) => e.event_type === "red_card" && awayTeamPlayers.some((p) => p.id === e.player_id),
                        ).length
                      }
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Match Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <span className="font-medium text-muted-foreground">Date & Time</span>
                    <p className="text-lg">
                      {new Date(match.match_date).toLocaleDateString()} at{" "}
                      {new Date(match.match_date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Venue</span>
                    <p className="text-lg">{match.venue}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Status</span>
                    <p className="text-lg capitalize">{match.status}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <span className="font-medium text-muted-foreground">Competition</span>
                    <p className="text-lg">Student Premier League</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Season</span>
                    <p className="text-lg">2024/25</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
