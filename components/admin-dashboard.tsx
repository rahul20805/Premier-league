"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Users, Trophy, Target, Coins, TrendingUp, Settings, Plus } from "lucide-react"

interface AdminDashboardProps {
  stats: {
    totalTeams: number
    totalPlayers: number
    totalMatches: number
    totalUsers: number
    liveMatches: number
    pendingBets: number
    totalCoins: number
  }
}

export function AdminDashboard({ stats }: AdminDashboardProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold neon-text">Admin Dashboard</h1>
        <Badge variant="secondary" className="text-lg px-3 py-1">
          Administrator
        </Badge>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="w-8 h-8 text-primary" />
              <div>
                <div className="text-3xl font-bold">{stats.totalUsers}</div>
                <div className="text-sm text-muted-foreground">Total Users</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-secondary/20">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Trophy className="w-8 h-8 text-secondary" />
              <div>
                <div className="text-3xl font-bold">{stats.totalTeams}</div>
                <div className="text-sm text-muted-foreground">Teams</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-accent/20">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Target className="w-8 h-8 text-accent" />
              <div>
                <div className="text-3xl font-bold">{stats.totalMatches}</div>
                <div className="text-sm text-muted-foreground">Matches</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-chart-1/20">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Coins className="w-8 h-8 text-chart-1" />
              <div>
                <div className="text-3xl font-bold">{stats.totalCoins.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Coins</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-destructive rounded-full animate-pulse"></div>
              <span>Live Matches</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-destructive mb-2">{stats.liveMatches}</div>
            <p className="text-sm text-muted-foreground">Matches currently in progress</p>
            <Button asChild className="mt-4 w-full bg-transparent" variant="outline">
              <Link href="/admin/matches">Manage Matches</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Pending Bets</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary mb-2">{stats.pendingBets}</div>
            <p className="text-sm text-muted-foreground">Bets awaiting resolution</p>
            <Button asChild className="mt-4 w-full bg-transparent" variant="outline">
              <Link href="/admin/bets">Manage Bets</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>System Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Database</span>
                <Badge variant="default">Online</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Real-time</span>
                <Badge variant="default">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Betting</span>
                <Badge variant="default">Enabled</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button asChild className="h-20 flex-col space-y-2">
              <Link href="/admin/matches/new">
                <Plus className="w-6 h-6" />
                <span>Create Match</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
              <Link href="/admin/teams">
                <Trophy className="w-6 h-6" />
                <span>Manage Teams</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
              <Link href="/admin/players">
                <Target className="w-6 h-6" />
                <span>Manage Players</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
              <Link href="/admin/users">
                <Users className="w-6 h-6" />
                <span>Manage Users</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
