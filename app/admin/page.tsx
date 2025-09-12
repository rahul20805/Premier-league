import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminDashboard } from "@/components/admin-dashboard"

export default async function AdminPage() {
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

  // Get dashboard statistics
  const { data: teams } = await supabase.from("teams").select("*")
  const { data: players } = await supabase.from("players").select("*")
  const { data: matches } = await supabase.from("matches").select("*")
  const { data: users } = await supabase.from("profiles").select("*")
  const { data: bets } = await supabase.from("bets").select("*")

  const liveMatches = matches?.filter((match) => match.status === "live") || []
  const pendingBets = bets?.filter((bet) => bet.status === "pending") || []
  const totalCoinsInSystem = users?.reduce((sum, user) => sum + (user.coins || 0), 0) || 0

  const stats = {
    totalTeams: teams?.length || 0,
    totalPlayers: players?.length || 0,
    totalMatches: matches?.length || 0,
    totalUsers: users?.length || 0,
    liveMatches: liveMatches.length,
    pendingBets: pendingBets.length,
    totalCoins: totalCoinsInSystem,
  }

  return <AdminDashboard stats={stats} />
}
