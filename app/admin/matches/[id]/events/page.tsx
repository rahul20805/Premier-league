import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { AdminMatchEventsClient } from "@/components/admin-match-events-client"

interface AdminMatchEventsPageProps {
  params: Promise<{ id: string }>
}

export default async function AdminMatchEventsPage({ params }: AdminMatchEventsPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (profile?.role !== "admin") {
    redirect("/")
  }

  const { data: match } = await supabase
    .from("matches")
    .select(`
      *,
      home_team:teams!matches_home_team_id_fkey(name, logo_url),
      away_team:teams!matches_away_team_id_fkey(name, logo_url)
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
      player:players(name, jersey_number, team_id)
    `)
    .eq("match_id", id)
    .order("minute", { ascending: true })

  const { data: homeTeamPlayers } = await supabase.from("players").select("*").eq("team_id", match.home_team_id)

  const { data: awayTeamPlayers } = await supabase.from("players").select("*").eq("team_id", match.away_team_id)

  return (
    <AdminMatchEventsClient
      match={match}
      events={events || []}
      homeTeamPlayers={homeTeamPlayers || []}
      awayTeamPlayers={awayTeamPlayers || []}
    />
  )
}
