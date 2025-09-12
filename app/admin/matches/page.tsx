import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminMatchesClient } from "@/components/admin-matches-client"

export default async function AdminMatchesPage() {
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

  const { data: matches } = await supabase
    .from("matches")
    .select(`
      *,
      home_team:teams!matches_home_team_id_fkey(name, logo_url),
      away_team:teams!matches_away_team_id_fkey(name, logo_url)
    `)
    .order("match_date", { ascending: false })

  const { data: teams } = await supabase.from("teams").select("*").order("name")

  return <AdminMatchesClient matches={matches || []} teams={teams || []} />
}
