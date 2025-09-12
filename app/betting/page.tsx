import { createClient } from "@/lib/supabase/server"
import { BettingClient } from "@/components/betting-client"
import { redirect } from "next/navigation"

export default async function BettingPage() {
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile with coins
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Get available matches for betting
  const { data: matches } = await supabase
    .from("matches")
    .select(`
      *,
      home_team:teams!matches_home_team_id_fkey(name, logo_url, color),
      away_team:teams!matches_away_team_id_fkey(name, logo_url, color)
    `)
    .in("status", ["scheduled", "live"])
    .order("match_date", { ascending: true })

  // Get user's active bets
  const { data: userBets } = await supabase
    .from("bets")
    .select(`
      *,
      match:matches(
        *,
        home_team:teams!matches_home_team_id_fkey(name, logo_url),
        away_team:teams!matches_away_team_id_fkey(name, logo_url)
      )
    `)
    .eq("user_id", user.id)
    .eq("status", "pending")
    .order("created_at", { ascending: false })

  return <BettingClient matches={matches || []} userProfile={profile} userBets={userBets || []} />
}
