import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ProfileClient } from "@/components/profile-client"

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const { data: betsStats } = await supabase
    .from("bets")
    .select("status, amount, potential_payout")
    .eq("user_id", user.id)

  return <ProfileClient user={user} profile={profile} betsStats={betsStats || []} />
}
