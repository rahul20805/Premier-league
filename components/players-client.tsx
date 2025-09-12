"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Search, Grid, List } from "lucide-react"

interface PlayersClientProps {
  players: any[]
  teams: any[]
}

export function PlayersClient({ players, teams }: PlayersClientProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTeam, setSelectedTeam] = useState<string>("all")
  const [selectedPosition, setSelectedPosition] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<string>("goals")

  const positions = ["Forward", "Midfielder", "Defender", "Goalkeeper"]

  const filteredAndSortedPlayers = useMemo(() => {
    const filtered = players.filter((player) => {
      const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesTeam = selectedTeam === "all" || player.team_id === selectedTeam
      const matchesPosition = selectedPosition === "all" || player.position === selectedPosition
      return matchesSearch && matchesTeam && matchesPosition
    })

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "goals":
          return b.goals - a.goals
        case "assists":
          return b.assists - a.assists
        case "matches":
          return b.matches_played - a.matches_played
        case "name":
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })
  }, [players, searchTerm, selectedTeam, selectedPosition, sortBy])

  const topScorers = players.slice(0, 5)
  const topAssists = [...players].sort((a, b) => b.assists - a.assists).slice(0, 5)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold neon-text">Players</h1>
        <div className="flex items-center space-x-2">
          <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
            <Grid className="w-4 h-4" />
          </Button>
          <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Players</TabsTrigger>
          <TabsTrigger value="top-scorers">Top Scorers</TabsTrigger>
          <TabsTrigger value="top-assists">Top Assists</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search players..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Teams" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Teams</SelectItem>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedPosition} onValueChange={setSelectedPosition}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Positions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Positions</SelectItem>
                    {positions.map((position) => (
                      <SelectItem key={position} value={position}>
                        {position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="goals">Goals</SelectItem>
                    <SelectItem value="assists">Assists</SelectItem>
                    <SelectItem value="matches">Matches Played</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                  </SelectContent>
                </Select>
                <div className="text-sm text-muted-foreground flex items-center">
                  {filteredAndSortedPlayers.length} players found
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Players Grid/List */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedPlayers.map((player) => (
                <PlayerCard key={player.id} player={player} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-4">Player</th>
                        <th className="text-left p-4">Team</th>
                        <th className="text-center p-4">Position</th>
                        <th className="text-center p-4">Goals</th>
                        <th className="text-center p-4">Assists</th>
                        <th className="text-center p-4">Matches</th>
                        <th className="text-center p-4">Cards</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAndSortedPlayers.map((player) => (
                        <tr key={player.id} className="border-b border-border/50 hover:bg-muted/20">
                          <td className="p-4">
                            <Link
                              href={`/players/${player.id}`}
                              className="flex items-center space-x-3 hover:text-primary"
                            >
                              <img
                                src={player.photo_url || "/placeholder.svg?height=40&width=40"}
                                alt={player.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                              <div>
                                <div className="font-medium">{player.name}</div>
                                <div className="text-sm text-muted-foreground">#{player.jersey_number}</div>
                              </div>
                            </Link>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <img
                                src={player.team?.logo_url || "/placeholder.svg"}
                                alt={player.team?.name}
                                className="w-6 h-6 rounded"
                              />
                              <span className="text-sm">{player.team?.name}</span>
                            </div>
                          </td>
                          <td className="text-center p-4">
                            <Badge variant="outline">{player.position}</Badge>
                          </td>
                          <td className="text-center p-4 font-bold text-primary">{player.goals}</td>
                          <td className="text-center p-4 font-bold text-secondary">{player.assists}</td>
                          <td className="text-center p-4">{player.matches_played}</td>
                          <td className="text-center p-4">
                            <div className="flex items-center justify-center space-x-1">
                              {player.yellow_cards > 0 && (
                                <span className="text-yellow-500 text-sm">{player.yellow_cards}🟨</span>
                              )}
                              {player.red_cards > 0 && (
                                <span className="text-red-500 text-sm">{player.red_cards}🟥</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="top-scorers" className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold">Top Goal Scorers</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topScorers.map((player, index) => (
                  <div key={player.id} className="flex items-center space-x-4 p-3 rounded-lg bg-muted/20">
                    <div className="text-2xl font-bold text-primary w-8">{index + 1}</div>
                    <img
                      src={player.photo_url || "/placeholder.svg?height=50&width=50"}
                      alt={player.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <Link href={`/players/${player.id}`} className="font-medium hover:text-primary">
                        {player.name}
                      </Link>
                      <div className="text-sm text-muted-foreground flex items-center space-x-2">
                        <img
                          src={player.team?.logo_url || "/placeholder.svg"}
                          alt={player.team?.name}
                          className="w-4 h-4 rounded"
                        />
                        <span>{player.team?.name}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{player.goals}</div>
                      <div className="text-sm text-muted-foreground">goals</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="top-assists" className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold">Top Assist Providers</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topAssists.map((player, index) => (
                  <div key={player.id} className="flex items-center space-x-4 p-3 rounded-lg bg-muted/20">
                    <div className="text-2xl font-bold text-secondary w-8">{index + 1}</div>
                    <img
                      src={player.photo_url || "/placeholder.svg?height=50&width=50"}
                      alt={player.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <Link href={`/players/${player.id}`} className="font-medium hover:text-primary">
                        {player.name}
                      </Link>
                      <div className="text-sm text-muted-foreground flex items-center space-x-2">
                        <img
                          src={player.team?.logo_url || "/placeholder.svg"}
                          alt={player.team?.name}
                          className="w-4 h-4 rounded"
                        />
                        <span>{player.team?.name}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-secondary">{player.assists}</div>
                      <div className="text-sm text-muted-foreground">assists</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function PlayerCard({ player }: { player: any }) {
  return (
    <Card className="hover:border-primary/40 transition-colors">
      <CardContent className="pt-6">
        <Link href={`/players/${player.id}`} className="block">
          <div className="text-center mb-4">
            <img
              src={player.photo_url || "/placeholder.svg?height=80&width=80"}
              alt={player.name}
              className="w-20 h-20 rounded-full object-cover mx-auto mb-3"
            />
            <h3 className="font-bold text-lg hover:text-primary transition-colors">{player.name}</h3>
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <span>#{player.jersey_number}</span>
              <span>•</span>
              <Badge variant="outline" className="text-xs">
                {player.position}
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-2 mb-4">
            <img
              src={player.team?.logo_url || "/placeholder.svg"}
              alt={player.team?.name}
              className="w-6 h-6 rounded"
            />
            <span className="text-sm font-medium">{player.team?.name}</span>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{player.goals}</div>
              <div className="text-xs text-muted-foreground">Goals</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-secondary">{player.assists}</div>
              <div className="text-xs text-muted-foreground">Assists</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{player.matches_played}</div>
              <div className="text-xs text-muted-foreground">Matches</div>
            </div>
          </div>

          {(player.yellow_cards > 0 || player.red_cards > 0) && (
            <div className="flex items-center justify-center space-x-2 mt-3 pt-3 border-t border-border">
              {player.yellow_cards > 0 && <span className="text-yellow-500 text-sm">{player.yellow_cards} 🟨</span>}
              {player.red_cards > 0 && <span className="text-red-500 text-sm">{player.red_cards} 🟥</span>}
            </div>
          )}
        </Link>
      </CardContent>
    </Card>
  )
}
