import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { LiveMatchClient } from "@/components/live-match-client"

interface MatchPageProps {
  params: Promise<{ id: string }>
}

export default async function MatchPage({ params }: MatchPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: match } = await supabase
    .from("matches")
    .select(`
      *,
      home_team:teams!matches_home_team_id_fkey(name, logo_url, color),
      away_team:teams!matches_away_team_id_fkey(name, logo_url, color)
    `)
    .eq("id", id)
    .single()

  if (!match) {
    notFound()
  }

  const { data: events } = await supabase
    .from("match_events")
    .select(`
      *,
      player:players(name, jersey_number)
    `)
    .eq("match_id", id)
    .order("minute", { ascending: true })

  const { data: homeTeamPlayers } = await supabase.from("players").select("*").eq("team_id", match.home_team_id)

  const { data: awayTeamPlayers } = await supabase.from("players").select("*").eq("team_id", match.away_team_id)

  return (
    <LiveMatchClient
      match={match}
      events={events || []}
      homeTeamPlayers={homeTeamPlayers || []}
      awayTeamPlayers={awayTeamPlayers || []}
    />
  )
}
