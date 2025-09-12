import { createClient } from "@/lib/supabase/server"
import { PlayersClient } from "@/components/players-client"

export default async function PlayersPage() {
  const supabase = await createClient()

  const { data: players } = await supabase
    .from("players")
    .select(`
      *,
      team:teams(name, logo_url, color)
    `)
    .order("goals", { ascending: false })

  const { data: teams } = await supabase.from("teams").select("*").order("name")

  return <PlayersClient players={players || []} teams={teams || []} />
}
