import React from 'react';
import Hero from '../components/Hero';
import { Calendar, Users, Trophy, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const upcomingMatches = [
    {
      id: 1,
      team1: 'Team Alpha',
      team2: 'Team Gamma',
      date: '2024-01-15',
      time: '14:00',
      venue: 'Stadium A'
    },
    {
      id: 2,
      team1: 'Team Beta',
      team2: 'Team Delta',
      date: '2024-01-16',
      time: '16:00',
      venue: 'Stadium B'
    },
    {
      id: 3,
      team1: 'Team Epsilon',
      team2: 'Team Zeta',
      date: '2024-01-17',
      time: '18:00',
      venue: 'Stadium C'
    }
  ];

  const topPlayers = [
    {
      id: 1,
      name: 'Rahul Sharma',
      role: 'Batsman',
      runs: 485,
      average: 48.5,
      photo: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      id: 2,
      name: 'Amit Patel',
      role: 'Bowler',
      wickets: 23,
      average: 18.2,
      photo: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      id: 3,
      name: 'Vikram Singh',
      role: 'All-rounder',
      runs: 320,
      wickets: 15,
      photo: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150'
    }
  ];

  const stats = [
    { icon: Users, label: 'Total Players', value: '120+' },
    { icon: Trophy, label: 'Matches Played', value: '45' },
    { icon: Calendar, label: 'Teams', value: '8' },
    { icon: TrendingUp, label: 'Total Bets', value: '$12.5K' }
  ];

  return (
    <div className="min-h-screen">
      <Hero />
      
      {/* Stats Section */}
      <section className="py-16 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-neon-green to-neon-blue rounded-full mb-4">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Matches */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Upcoming Matches</h2>
            <p className="text-gray-400">Don't miss the exciting matches coming up</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingMatches.map((match) => (
              <div key={match.id} className="card hover:neon-glow">
                <div className="text-center">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold text-white">{match.team1}</span>
                    <span className="text-gray-400">vs</span>
                    <span className="text-lg font-semibold text-white">{match.team2}</span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-400">
                    <p>{new Date(match.date).toLocaleDateString()} at {match.time}</p>
                    <p>{match.venue}</p>
                  </div>
                  <Link 
                    to="/betting" 
                    className="mt-4 inline-block btn-primary text-sm"
                  >
                    Place Bet
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link to="/fixtures" className="btn-secondary">
              View All Fixtures
            </Link>
          </div>
        </div>
      </section>

      {/* Top Players */}
      <section className="py-16 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Top Performers</h2>
            <p className="text-gray-400">Meet the stars of SPL</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topPlayers.map((player) => (
              <div key={player.id} className="card text-center">
                <img
                  src={player.photo}
                  alt={player.name}
                  className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-white mb-2">{player.name}</h3>
                <p className="text-neon-blue mb-3">{player.role}</p>
                <div className="space-y-1 text-sm text-gray-400">
                  {player.runs && <p>Runs: {player.runs}</p>}
                  {player.wickets && <p>Wickets: {player.wickets}</p>}
                  <p>Average: {player.average}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link to="/players" className="btn-secondary">
              View All Players
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;