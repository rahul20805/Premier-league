import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Target, TrendingUp, Award, User, Calendar, MapPin } from 'lucide-react';

const PlayerProfile: React.FC = () => {
  const { id } = useParams();

  // Mock player data - in real app, fetch from API
  const player = {
    id: 1,
    name: 'Rahul Sharma',
    role: 'batsman',
    team: 'Team Alpha',
    photo: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    age: 22,
    hometown: 'Mumbai, India',
    joinedDate: '2023-08-15',
    stats: {
      matches: 12,
      runs: 485,
      wickets: 2,
      average: 48.5,
      strikeRate: 142.3,
      highestScore: 89,
      fifties: 4,
      hundreds: 0,
      catches: 8
    },
    recentMatches: [
      { opponent: 'Team Beta', runs: 67, balls: 45, result: 'Won' },
      { opponent: 'Team Gamma', runs: 23, balls: 18, result: 'Lost' },
      { opponent: 'Team Delta', runs: 89, balls: 62, result: 'Won' },
      { opponent: 'Team Epsilon', runs: 34, balls: 28, result: 'Won' },
      { opponent: 'Team Zeta', runs: 12, balls: 15, result: 'Lost' }
    ]
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'batsman':
        return <Target className="h-6 w-6" />;
      case 'bowler':
        return <TrendingUp className="h-6 w-6" />;
      case 'all-rounder':
        return <Award className="h-6 w-6" />;
      case 'wicket-keeper':
        return <User className="h-6 w-6" />;
      default:
        return <User className="h-6 w-6" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'batsman':
        return 'text-neon-green';
      case 'bowler':
        return 'text-neon-blue';
      case 'all-rounder':
        return 'text-neon-purple';
      case 'wicket-keeper':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/players"
          className="inline-flex items-center space-x-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Players</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Player Info */}
          <div className="lg:col-span-1">
            <div className="card text-center">
              <img
                src={player.photo}
                alt={player.name}
                className="w-32 h-32 rounded-full mx-auto mb-6 object-cover"
              />
              
              <h1 className="text-3xl font-bold text-white mb-2">{player.name}</h1>
              
              <div className={`flex items-center justify-center space-x-2 mb-4 ${getRoleColor(player.role)}`}>
                {getRoleIcon(player.role)}
                <span className="text-lg capitalize font-semibold">
                  {player.role.replace('-', ' ')}
                </span>
              </div>
              
              <p className="text-xl text-gray-300 mb-6">{player.team}</p>
              
              <div className="space-y-3 text-left">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Age</p>
                    <p className="text-white">{player.age} years</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Hometown</p>
                    <p className="text-white">{player.hometown}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Joined SPL</p>
                    <p className="text-white">
                      {new Date(player.joinedDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats and Performance */}
          <div className="lg:col-span-2 space-y-8">
            {/* Career Stats */}
            <div className="card">
              <h2 className="text-2xl font-bold text-white mb-6">Career Statistics</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-neon-green">{player.stats.matches}</p>
                  <p className="text-gray-400">Matches</p>
                </div>
                
                <div className="text-center">
                  <p className="text-3xl font-bold text-neon-blue">{player.stats.runs}</p>
                  <p className="text-gray-400">Runs</p>
                </div>
                
                <div className="text-center">
                  <p className="text-3xl font-bold text-neon-purple">{player.stats.average}</p>
                  <p className="text-gray-400">Average</p>
                </div>
                
                <div className="text-center">
                  <p className="text-3xl font-bold text-yellow-400">{player.stats.strikeRate}</p>
                  <p className="text-gray-400">Strike Rate</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6 pt-6 border-t border-gray-700">
                <div className="text-center">
                  <p className="text-xl font-bold text-white">{player.stats.highestScore}</p>
                  <p className="text-gray-400 text-sm">Highest Score</p>
                </div>
                
                <div className="text-center">
                  <p className="text-xl font-bold text-white">{player.stats.fifties}</p>
                  <p className="text-gray-400 text-sm">Fifties</p>
                </div>
                
                <div className="text-center">
                  <p className="text-xl font-bold text-white">{player.stats.hundreds}</p>
                  <p className="text-gray-400 text-sm">Hundreds</p>
                </div>
                
                <div className="text-center">
                  <p className="text-xl font-bold text-white">{player.stats.catches}</p>
                  <p className="text-gray-400 text-sm">Catches</p>
                </div>
              </div>
            </div>

            {/* Recent Matches */}
            <div className="card">
              <h2 className="text-2xl font-bold text-white mb-6">Recent Performances</h2>
              
              <div className="space-y-4">
                {player.recentMatches.map((match, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="text-white font-semibold">vs {match.opponent}</p>
                        <p className="text-sm text-gray-400">
                          {match.runs} runs ({match.balls} balls)
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          match.result === 'Won'
                            ? 'bg-green-500 text-white'
                            : 'bg-red-500 text-white'
                        }`}
                      >
                        {match.result}
                      </span>
                      <p className="text-sm text-gray-400 mt-1">
                        SR: {((match.runs / match.balls) * 100).toFixed(1)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfile;