"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export function LiveScoreTicker() {
  const [liveMatches, setLiveMatches] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    const fetchLiveMatches = async () => {
      const { data } = await supabase
        .from("matches")
        .select(`
          *,
          home_team:teams!matches_home_team_id_fkey(name, logo_url),
          away_team:teams!matches_away_team_id_fkey(name, logo_url)
        `)
        .eq("status", "live")

      setLiveMatches(data || [])
    }

    fetchLiveMatches()

    // Subscribe to live match updates
    const channel = supabase
      .channel("live-matches")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "matches",
          filter: "status=eq.live",
        },
        () => {
          fetchLiveMatches()
        },
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [supabase])

  if (liveMatches.length === 0) {
    return null
  }

  return (
    <div className="bg-card border-b border-border">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center space-x-6 overflow-x-auto">
          <Badge variant="destructive" className="live-indicator shrink-0">
            LIVE
          </Badge>
          {liveMatches.map((match) => (
            <Link
              key={match.id}
              href={`/matches/${match.id}`}
              className="flex items-center space-x-3 shrink-0 hover:text-primary transition-colors"
            >
              <div className="flex items-center space-x-2">
                <img src={match.home_team.logo_url || "/placeholder.svg"} alt="" className="w-4 h-4 rounded" />
                <span className="text-sm font-medium">{match.home_team.name}</span>
              </div>
              <span className="text-sm font-bold text-primary">
                {match.home_score} - {match.away_score}
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">{match.away_team.name}</span>
                <img src={match.away_team.logo_url || "/placeholder.svg"} alt="" className="w-4 h-4 rounded" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
