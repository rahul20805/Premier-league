import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminUsersClient } from "@/components/admin-users-client"

export default async function AdminUsersPage() {
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

  const { data: users } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

  const { data: betsStats } = await supabase.from("bets").select("user_id, status, amount, potential_payout")

  return <AdminUsersClient users={users || []} betsStats={betsStats || []} />
}
