"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { Coins, TrendingUp, Target, Trophy } from "lucide-react"
import Link from "next/link"

interface ProfileClientProps {
  user: any
  profile: any
  betsStats: any[]
}

export function ProfileClient({ user, profile, betsStats }: ProfileClientProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    username: profile?.username || "",
    full_name: profile?.full_name || "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()
  const { toast } = useToast()

  const totalBets = betsStats.length
  const wonBets = betsStats.filter((bet) => bet.status === "won").length
  const totalStaked = betsStats.reduce((sum, bet) => sum + bet.amount, 0)
  const totalWon = betsStats.filter((bet) => bet.status === "won").reduce((sum, bet) => sum + bet.potential_payout, 0)
  const winRate = totalBets > 0 ? ((wonBets / totalBets) * 100).toFixed(1) : "0.0"

  const handleUpdateProfile = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.from("profiles").update(formData).eq("id", user.id)

      if (error) throw error

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
      })
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 neon-text">Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} alt={profile?.username} />
                  <AvatarFallback className="text-2xl">{profile?.username?.[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-4">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          value={formData.username}
                          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="full_name">Full Name</Label>
                        <Input
                          id="full_name"
                          value={formData.full_name}
                          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" value={user.email} disabled />
                      </div>
                      <div className="flex space-x-2">
                        <Button onClick={handleUpdateProfile} disabled={isLoading}>
                          {isLoading ? "Saving..." : "Save Changes"}
                        </Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-muted-foreground">Username</span>
                        <p className="font-medium">@{profile?.username}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Full Name</span>
                        <p className="font-medium">{profile?.full_name}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Email</span>
                        <p className="font-medium">{user.email}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Member Since</span>
                        <p className="font-medium">{new Date(profile?.created_at).toLocaleDateString()}</p>
                      </div>
                      <Button onClick={() => setIsEditing(true)} className="mt-4">
                        Edit Profile
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Betting Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Betting Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{totalBets}</div>
                  <div className="text-sm text-muted-foreground">Total Bets</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary">{wonBets}</div>
                  <div className="text-sm text-muted-foreground">Bets Won</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{winRate}%</div>
                  <div className="text-sm text-muted-foreground">Win Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{totalWon - totalStaked}</div>
                  <div className="text-sm text-muted-foreground">Net Profit</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Coin Balance */}
          <Card className="border-primary/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Coins className="w-8 h-8 text-primary" />
                  <span className="text-3xl font-bold text-primary">{profile?.coins || 0}</span>
                </div>
                <div className="text-sm text-muted-foreground mb-4">Available Coins</div>
                <Button asChild className="w-full neon-glow">
                  <Link href="/betting">Place New Bets</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" asChild className="w-full justify-start bg-transparent">
                <Link href="/betting/history">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Betting History
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full justify-start bg-transparent">
                <Link href="/matches">
                  <Target className="w-4 h-4 mr-2" />
                  Live Matches
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full justify-start bg-transparent">
                <Link href="/players">
                  <Trophy className="w-4 h-4 mr-2" />
                  Player Stats
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Account Status */}
          <Card>
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Account Type</span>
                  <span className="text-sm font-medium capitalize">{profile?.role || "User"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Status</span>
                  <span className="text-sm font-medium text-primary">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Email Verified</span>
                  <span className="text-sm font-medium text-primary">Yes</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
