import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { PlayerProfileClient } from "@/components/player-profile-client"

interface PlayerPageProps {
  params: Promise<{ id: string }>
}

export default async function PlayerPage({ params }: PlayerPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: player } = await supabase
    .from("players")
    .select(`
      *,
      team:teams(name, logo_url, color)
    `)
    .eq("id", id)
    .single()

  if (!player) {
    notFound()
  }

  // Get player's match events
  const { data: playerEvents } = await supabase
    .from("match_events")
    .select(`
      *,
      match:matches(
        *,
        home_team:teams!matches_home_team_id_fkey(name, logo_url),
        away_team:teams!matches_away_team_id_fkey(name, logo_url)
      )
    `)
    .eq("player_id", id)
    .order("created_at", { ascending: false })

  // Get recent matches for this player's team
  const { data: recentMatches } = await supabase
    .from("matches")
    .select(`
      *,
      home_team:teams!matches_home_team_id_fkey(name, logo_url),
      away_team:teams!matches_away_team_id_fkey(name, logo_url)
    `)
    .or(`home_team_id.eq.${player.team_id},away_team_id.eq.${player.team_id}`)
    .eq("status", "finished")
    .order("match_date", { ascending: false })
    .limit(5)

  // Get similar players (same position, different team)
  const { data: similarPlayers } = await supabase
    .from("players")
    .select(`
      *,
      team:teams(name, logo_url, color)
    `)
    .eq("position", player.position)
    .neq("team_id", player.team_id)
    .neq("id", id)
    .order("goals", { ascending: false })
    .limit(4)

  return (
    <PlayerProfileClient
      player={player}
      playerEvents={playerEvents || []}
      recentMatches={recentMatches || []}
      similarPlayers={similarPlayers || []}
    />
  )
}
