export interface User {
  _id: string;
  email: string;
  username: string;
  role: 'user' | 'admin';
  wallet: number;
  createdAt: string;
}

export interface Player {
  _id: string;
  name: string;
  role: 'batsman' | 'bowler' | 'all-rounder' | 'wicket-keeper';
  team: string;
  photo: string;
  stats: {
    matches: number;
    runs: number;
    wickets: number;
    average: number;
    strikeRate: number;
  };
}

export interface Team {
  _id: string;
  name: string;
  logo: string;
  players: Player[];
  stats: {
    played: number;
    won: number;
    lost: number;
    points: number;
  };
}

export interface Match {
  _id: string;
  team1: Team;
  team2: Team;
  date: string;
  venue: string;
  status: 'upcoming' | 'live' | 'completed';
  result?: {
    winner: string;
    margin: string;
  };
  liveScore?: {
    team1Score: string;
    team2Score: string;
    overs: string;
    currentBatsmen: string[];
    currentBowler: string;
  };
}

export interface Bet {
  _id: string;
  userId: string;
  matchId: string;
  team: string;
  amount: number;
  odds: number;
  status: 'pending' | 'won' | 'lost';
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}