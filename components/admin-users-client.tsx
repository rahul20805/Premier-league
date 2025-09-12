"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Search, Shield, User, Coins } from "lucide-react"
import Link from "next/link"

interface AdminUsersClientProps {
  users: any[]
  betsStats: any[]
}

export function AdminUsersClient({ users: initialUsers, betsStats }: AdminUsersClientProps) {
  const [users, setUsers] = useState(initialUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const supabase = createClient()
  const { toast } = useToast()

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  const getUserBetsStats = (userId: string) => {
    const userBets = betsStats.filter((bet) => bet.user_id === userId)
    const totalBets = userBets.length
    const wonBets = userBets.filter((bet) => bet.status === "won").length
    const totalStaked = userBets.reduce((sum, bet) => sum + bet.amount, 0)
    const totalWon = userBets.filter((bet) => bet.status === "won").reduce((sum, bet) => sum + bet.potential_payout, 0)

    return {
      totalBets,
      wonBets,
      totalStaked,
      totalWon,
      winRate: totalBets > 0 ? ((wonBets / totalBets) * 100).toFixed(1) : "0.0",
    }
  }

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase.from("profiles").update({ role: newRole }).eq("id", userId)

      if (error) throw error

      setUsers(users.map((user) => (user.id === userId ? { ...user, role: newRole } : user)))

      toast({
        title: "Role Updated",
        description: `User role changed to ${newRole}`,
      })
    } catch (error) {
      console.error("Error updating role:", error)
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      })
    }
  }

  const updateUserCoins = async (userId: string, newCoins: number) => {
    try {
      const { error } = await supabase.from("profiles").update({ coins: newCoins }).eq("id", userId)

      if (error) throw error

      setUsers(users.map((user) => (user.id === userId ? { ...user, coins: newCoins } : user)))

      toast({
        title: "Coins Updated",
        description: `User coins set to ${newCoins}`,
      })
    } catch (error) {
      console.error("Error updating coins:", error)
      toast({
        title: "Error",
        description: "Failed to update user coins",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link href="/admin" className="text-muted-foreground hover:text-foreground">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold neon-text">User Management</h1>
        </div>
        <Badge variant="secondary" className="text-lg px-3 py-1">
          {filteredUsers.length} users
        </Badge>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="user">Users</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <div className="space-y-4">
        {filteredUsers.map((user) => {
          const stats = getUserBetsStats(user.id)
          return (
            <UserCard
              key={user.id}
              user={user}
              stats={stats}
              onUpdateRole={updateUserRole}
              onUpdateCoins={updateUserCoins}
            />
          )
        })}
      </div>
    </div>
  )
}

function UserCard({
  user,
  stats,
  onUpdateRole,
  onUpdateCoins,
}: {
  user: any
  stats: any
  onUpdateRole: (userId: string, role: string) => void
  onUpdateCoins: (userId: string, coins: number) => void
}) {
  const [isEditingCoins, setIsEditingCoins] = useState(false)
  const [newCoins, setNewCoins] = useState(user.coins || 0)

  const handleCoinsUpdate = () => {
    onUpdateCoins(user.id, newCoins)
    setIsEditingCoins(false)
  }

  return (
    <Card className="hover:border-primary/40 transition-colors">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              {user.role === "admin" ? (
                <Shield className="w-6 h-6 text-primary" />
              ) : (
                <User className="w-6 h-6 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-bold text-lg">{user.full_name || "Unknown"}</h3>
                <Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role || "user"}</Badge>
              </div>
              <div className="text-sm text-muted-foreground mb-2">
                @{user.username} • Joined {new Date(user.created_at).toLocaleDateString()}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Total Bets:</span>
                  <span className="font-medium ml-1">{stats.totalBets}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Win Rate:</span>
                  <span className="font-medium ml-1">{stats.winRate}%</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Staked:</span>
                  <span className="font-medium ml-1">{stats.totalStaked}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Net:</span>
                  <span
                    className={`font-medium ml-1 ${stats.totalWon - stats.totalStaked >= 0 ? "text-primary" : "text-destructive"}`}
                  >
                    {stats.totalWon - stats.totalStaked >= 0 ? "+" : ""}
                    {stats.totalWon - stats.totalStaked}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end space-y-3">
            {/* Coins Management */}
            <div className="flex items-center space-x-2">
              <Coins className="w-4 h-4 text-primary" />
              {isEditingCoins ? (
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    min="0"
                    value={newCoins}
                    onChange={(e) => setNewCoins(Number.parseInt(e.target.value) || 0)}
                    className="w-20 h-8 text-sm"
                  />
                  <Button size="sm" onClick={handleCoinsUpdate}>
                    Save
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setIsEditingCoins(false)}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-primary">{user.coins || 0}</span>
                  <Button size="sm" variant="ghost" onClick={() => setIsEditingCoins(true)}>
                    Edit
                  </Button>
                </div>
              )}
            </div>

            {/* Role Management */}
            <Select value={user.role || "user"} onValueChange={(value) => onUpdateRole(user.id, value)}>
              <SelectTrigger className="w-32 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
