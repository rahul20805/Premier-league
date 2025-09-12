"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Plus, Trash2 } from "lucide-react"
import Link from "next/link"

interface AdminMatchEventsClientProps {
  match: any
  events: any[]
  homeTeamPlayers: any[]
  awayTeamPlayers: any[]
}

export function AdminMatchEventsClient({
  match,
  events: initialEvents,
  homeTeamPlayers,
  awayTeamPlayers,
}: AdminMatchEventsClientProps) {
  const [events, setEvents] = useState(initialEvents)
  const [isAddEventDialogOpen, setIsAddEventDialogOpen] = useState(false)
  const [newEvent, setNewEvent] = useState({
    player_id: "",
    event_type: "",
    minute: "",
    description: "",
  })
  const supabase = createClient()
  const { toast } = useToast()

  const allPlayers = [...homeTeamPlayers, ...awayTeamPlayers]

  const addEvent = async () => {
    try {
      if (!newEvent.player_id || !newEvent.event_type || !newEvent.minute) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        return
      }

      const { data, error } = await supabase
        .from("match_events")
        .insert({
          match_id: match.id,
          player_id: newEvent.player_id,
          event_type: newEvent.event_type,
          minute: Number.parseInt(newEvent.minute),
          description: newEvent.description,
        })
        .select(`
          *,
          player:players(name, jersey_number, team_id)
        `)

      if (error) throw error

      setEvents([...events, ...data].sort((a, b) => a.minute - b.minute))
      setIsAddEventDialogOpen(false)
      setNewEvent({ player_id: "", event_type: "", minute: "", description: "" })

      toast({
        title: "Event Added",
        description: "Match event has been recorded successfully",
      })
    } catch (error) {
      console.error("Error adding event:", error)
      toast({
        title: "Error",
        description: "Failed to add event",
        variant: "destructive",
      })
    }
  }

  const deleteEvent = async (eventId: string) => {
    try {
      const { error } = await supabase.from("match_events").delete().eq("id", eventId)

      if (error) throw error

      setEvents(events.filter((event) => event.id !== eventId))

      toast({
        title: "Event Deleted",
        description: "Match event has been removed",
      })
    } catch (error) {
      console.error("Error deleting event:", error)
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      })
    }
  }

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case "goal":
        return "⚽"
      case "yellow_card":
        return "🟨"
      case "red_card":
        return "🟥"
      case "substitution":
        return "🔄"
      case "penalty":
        return "🥅"
      default:
        return "📝"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link href="/admin/matches" className="text-muted-foreground hover:text-foreground">
            ← Back to Matches
          </Link>
          <h1 className="text-4xl font-bold neon-text">Match Events</h1>
        </div>
        <Dialog open={isAddEventDialogOpen} onOpenChange={setIsAddEventDialogOpen}>
          <DialogTrigger asChild>
            <Button className="neon-glow">
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Match Event</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="player">Player</Label>
                <Select
                  value={newEvent.player_id}
                  onValueChange={(value) => setNewEvent({ ...newEvent, player_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select player" />
                  </SelectTrigger>
                  <SelectContent>
                    {allPlayers.map((player) => (
                      <SelectItem key={player.id} value={player.id}>
                        #{player.jersey_number} {player.name} (
                        {player.team_id === match.home_team_id ? match.home_team.name : match.away_team.name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="event_type">Event Type</Label>
                <Select
                  value={newEvent.event_type}
                  onValueChange={(value) => setNewEvent({ ...newEvent, event_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="goal">Goal ⚽</SelectItem>
                    <SelectItem value="yellow_card">Yellow Card 🟨</SelectItem>
                    <SelectItem value="red_card">Red Card 🟥</SelectItem>
                    <SelectItem value="substitution">Substitution 🔄</SelectItem>
                    <SelectItem value="penalty">Penalty 🥅</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="minute">Minute</Label>
                <Input
                  id="minute"
                  type="number"
                  min="1"
                  max="120"
                  placeholder="Match minute"
                  value={newEvent.minute}
                  onChange={(e) => setNewEvent({ ...newEvent, minute: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  placeholder="Additional details"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                />
              </div>
              <Button onClick={addEvent} className="w-full">
                Add Event
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Match Info */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={match.home_team.logo_url || "/placeholder.svg"}
                alt={match.home_team.name}
                className="w-12 h-12 rounded"
              />
              <span className="text-xl font-bold">{match.home_team.name}</span>
            </div>
            <div className="text-3xl font-bold">
              {match.home_score} - {match.away_score}
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-xl font-bold">{match.away_team.name}</span>
              <img
                src={match.away_team.logo_url || "/placeholder.svg"}
                alt={match.away_team.name}
                className="w-12 h-12 rounded"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Match Timeline ({events.length} events)</CardTitle>
        </CardHeader>
        <CardContent>
          {events.length > 0 ? (
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">{getEventIcon(event.event_type)}</div>
                    <div>
                      <div className="font-medium">
                        {event.player?.name} #{event.player?.jersey_number}
                      </div>
                      <div className="text-sm text-muted-foreground capitalize">
                        {event.event_type.replace("_", " ")}
                        {event.description && ` - ${event.description}`}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {event.player?.team_id === match.home_team_id ? match.home_team.name : match.away_team.name}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-lg font-bold text-primary">{event.minute}'</div>
                    <Button size="sm" variant="ghost" onClick={() => deleteEvent(event.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No events recorded yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
