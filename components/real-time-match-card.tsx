"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface RealTimeMatchCardProps {
  initialMatch: any
}

export function RealTimeMatchCard({ initialMatch }: RealTimeMatchCardProps) {
  const [match, setMatch] = useState(initialMatch)
  const [latestEvent, setLatestEvent] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    // Subscribe to match updates
    const matchChannel = supabase
      .channel(`match-card-${match.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "matches",
          filter: `id=eq.${match.id}`,
        },
        (payload) => {
          setMatch((prev: any) => ({ ...prev, ...payload.new }))
        },
      )
      .subscribe()

    // Subscribe to match events for notifications
    const eventsChannel = supabase
      .channel(`match-events-card-${match.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "match_events",
          filter: `match_id=eq.${match.id}`,
        },
        async (payload) => {
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
            setLatestEvent(newEvent)
            // Clear the latest event after 5 seconds
            setTimeout(() => setLatestEvent(null), 5000)
          }
        },
      )
      .subscribe()

    return () => {
      matchChannel.unsubscribe()
      eventsChannel.unsubscribe()
    }
  }, [match.id, supabase])

  return (
    <Card className="border-primary/20 hover:border-primary/40 transition-colors relative">
      {latestEvent && (
        <div className="absolute -top-2 -right-2 z-10">
          <Badge variant="destructive" className="animate-pulse">
            {latestEvent.event_type === "goal" ? "⚽ GOAL!" : "📝 EVENT"}
          </Badge>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          {match.status === "live" && (
            <Badge variant="destructive" className="live-indicator">
              LIVE
            </Badge>
          )}
          {match.status === "scheduled" && (
            <Badge variant="outline">{new Date(match.match_date).toLocaleDateString()}</Badge>
          )}
          {match.status === "finished" && <Badge variant="secondary">FINAL</Badge>}
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

          <div className="flex items-center justify-center">
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

          {latestEvent && (
            <div className="bg-primary/10 border border-primary/20 rounded p-2 text-sm">
              <span className="font-medium">
                {latestEvent.minute}' - {latestEvent.event_type === "goal" ? "⚽" : "📝"}
                {latestEvent.player?.name || "Event"}
              </span>
            </div>
          )}

          <div className="flex space-x-2">
            <Button className="flex-1 bg-transparent" variant="outline" asChild>
              <Link href={`/matches/${match.id}`}>View Match</Link>
            </Button>
            {match.status !== "finished" && (
              <Button className="flex-1 bg-transparent" variant="outline" asChild>
                <Link href={`/betting?match=${match.id}`}>Bet</Link>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
