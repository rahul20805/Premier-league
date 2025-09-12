import React, { useState } from 'react';
import { Search, Filter, User, TrendingUp, Target, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const Players: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedTeam, setSelectedTeam] = useState('all');

  const players = [
    {
      id: 1,
      name: 'Rahul Sharma',
      role: 'batsman',
      team: 'Team Alpha',
      photo: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200',
      stats: {
        matches: 12,
        runs: 485,
        wickets: 2,
        average: 48.5,
        strikeRate: 142.3
      }
    },
    {
      id: 2,
      name: 'Amit Patel',
      role: 'bowler',
      team: 'Team Beta',
      photo: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=200',
      stats: {
        matches: 11,
        runs: 45,
        wickets: 23,
        average: 18.2,
        strikeRate: 95.4
      }
    },
    {
      id: 3,
      name: 'Vikram Singh',
      role: 'all-rounder',
      team: 'Team Gamma',
      photo: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=200',
      stats: {
        matches: 13,
        runs: 320,
        wickets: 15,
        average: 32.0,
        strikeRate: 128.7
      }
    },
    {
      id: 4,
      name: 'Suresh Kumar',
      role: 'wicket-keeper',
      team: 'Team Delta',
      photo: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=200',
      stats: {
        matches: 10,
        runs: 298,
        wickets: 0,
        average: 37.3,
        strikeRate: 118.9
      }
    },
    {
      id: 5,
      name: 'Ravi Gupta',
      role: 'batsman',
      team: 'Team Epsilon',
      photo: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200',
      stats: {
        matches: 9,
        runs: 267,
        wickets: 1,
        average: 33.4,
        strikeRate: 135.2
      }
    },
    {
      id: 6,
      name: 'Manoj Yadav',
      role: 'bowler',
      team: 'Team Zeta',
      photo: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=200',
      stats: {
        matches: 8,
        runs: 23,
        wickets: 18,
        average: 16.8,
        strikeRate: 87.3
      }
    }
  ];

  const teams = ['Team Alpha', 'Team Beta', 'Team Gamma', 'Team Delta', 'Team Epsilon', 'Team Zeta'];
  const roles = ['batsman', 'bowler', 'all-rounder', 'wicket-keeper'];

  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || player.role === selectedRole;
    const matchesTeam = selectedTeam === 'all' || player.team === selectedTeam;
    return matchesSearch && matchesRole && matchesTeam;
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'batsman':
        return <Target className="h-4 w-4" />;
      case 'bowler':
        return <TrendingUp className="h-4 w-4" />;
      case 'all-rounder':
        return <Award className="h-4 w-4" />;
      case 'wicket-keeper':
        return <User className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
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
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Players</h1>
          <p className="text-gray-400">Meet the talented cricketers of SPL</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search players..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-neon-blue"
              />
            </div>

            {/* Role Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-neon-blue appearance-none"
              >
                <option value="all">All Roles</option>
                {roles.map(role => (
                  <option key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>

            {/* Team Filter */}
            <div>
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-neon-blue appearance-none"
              >
                <option value="all">All Teams</option>
                {teams.map(team => (
                  <option key={team} value={team}>{team}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Players Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlayers.map((player) => (
            <Link
              key={player.id}
              to={`/players/${player.id}`}
              className="card hover:neon-glow transition-all duration-300 transform hover:scale-105"
            >
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={player.photo}
                  alt={player.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-xl font-semibold text-white">{player.name}</h3>
                  <div className={`flex items-center space-x-1 ${getRoleColor(player.role)}`}>
                    {getRoleIcon(player.role)}
                    <span className="text-sm capitalize">
                      {player.role.replace('-', ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">{player.team}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <p className="text-gray-400">Matches</p>
                  <p className="text-white font-semibold">{player.stats.matches}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400">Runs</p>
                  <p className="text-neon-green font-semibold">{player.stats.runs}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400">Wickets</p>
                  <p className="text-neon-blue font-semibold">{player.stats.wickets}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400">Average</p>
                  <p className="text-white font-semibold">{player.stats.average}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Strike Rate</span>
                  <span className="text-sm text-neon-purple font-semibold">
                    {player.stats.strikeRate}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredPlayers.length === 0 && (
          <div className="text-center py-12">
            <User className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No players found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Players;