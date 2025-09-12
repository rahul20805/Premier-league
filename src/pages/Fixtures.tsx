import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Bell } from 'lucide-react';

const Fixtures: React.FC = () => {
  const [selectedWeek, setSelectedWeek] = useState('current');

  const upcomingMatches = [
    {
      id: 1,
      team1: 'Team Alpha',
      team2: 'Team Gamma',
      date: '2024-01-15',
      time: '14:00',
      venue: 'Stadium A',
      status: 'upcoming',
      matchType: 'League Match'
    },
    {
      id: 2,
      team1: 'Team Beta',
      team2: 'Team Delta',
      date: '2024-01-16',
      time: '16:00',
      venue: 'Stadium B',
      status: 'upcoming',
      matchType: 'League Match'
    },
    {
      id: 3,
      team1: 'Team Epsilon',
      team2: 'Team Zeta',
      date: '2024-01-17',
      time: '18:00',
      venue: 'Stadium C',
      status: 'upcoming',
      matchType: 'League Match'
    },
    {
      id: 4,
      team1: 'Team Alpha',
      team2: 'Team Beta',
      date: '2024-01-18',
      time: '15:00',
      venue: 'Stadium A',
      status: 'upcoming',
      matchType: 'Semi-Final'
    },
    {
      id: 5,
      team1: 'Team Gamma',
      team2: 'Team Delta',
      date: '2024-01-19',
      time: '17:00',
      venue: 'Stadium B',
      status: 'upcoming',
      matchType: 'Semi-Final'
    },
    {
      id: 6,
      team1: 'TBD',
      team2: 'TBD',
      date: '2024-01-21',
      time: '19:00',
      venue: 'Stadium A',
      status: 'upcoming',
      matchType: 'Final'
    }
  ];

  const getMatchTypeColor = (matchType: string) => {
    switch (matchType) {
      case 'Final':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500';
      case 'Semi-Final':
        return 'bg-gradient-to-r from-purple-500 to-pink-500';
      default:
        return 'bg-gradient-to-r from-blue-500 to-cyan-500';
    }
  };

  const isToday = (dateString: string) => {
    const today = new Date().toDateString();
    const matchDate = new Date(dateString).toDateString();
    return today === matchDate;
  };

  const isTomorrow = (dateString: string) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const matchDate = new Date(dateString).toDateString();
    return tomorrow.toDateString() === matchDate;
  };

  const getDateLabel = (dateString: string) => {
    if (isToday(dateString)) return 'Today';
    if (isTomorrow(dateString)) return 'Tomorrow';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Fixtures</h1>
          <p className="text-gray-400">Upcoming matches and tournament schedule</p>
        </div>

        {/* Filter Options */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setSelectedWeek('current')}
              className={`px-6 py-2 rounded-md font-semibold transition-all ${
                selectedWeek === 'current'
                  ? 'bg-gradient-to-r from-neon-green to-neon-blue text-black'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setSelectedWeek('next')}
              className={`px-6 py-2 rounded-md font-semibold transition-all ${
                selectedWeek === 'next'
                  ? 'bg-gradient-to-r from-neon-green to-neon-blue text-black'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Next Week
            </button>
            <button
              onClick={() => setSelectedWeek('all')}
              className={`px-6 py-2 rounded-md font-semibold transition-all ${
                selectedWeek === 'all'
                  ? 'bg-gradient-to-r from-neon-green to-neon-blue text-black'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              All Fixtures
            </button>
          </div>
        </div>

        {/* Fixtures List */}
        <div className="space-y-6">
          {upcomingMatches.map((match) => (
            <div key={match.id} className="card hover:neon-glow transition-all duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
                {/* Match Type & Date */}
                <div className="text-center lg:text-left">
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-2 ${getMatchTypeColor(match.matchType)}`}>
                    {match.matchType}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-center lg:justify-start space-x-2 text-gray-400">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">{getDateLabel(match.date)}</span>
                    </div>
                    <div className="flex items-center justify-center lg:justify-start space-x-2 text-gray-400">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{match.time}</span>
                    </div>
                    <div className="flex items-center justify-center lg:justify-start space-x-2 text-gray-400">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{match.venue}</span>
                    </div>
                  </div>
                </div>

                {/* Teams */}
                <div className="lg:col-span-2">
                  <div className="flex items-center justify-center space-x-6">
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-white mb-2">{match.team1}</h3>
                      <div className="w-16 h-16 bg-gradient-to-br from-neon-green to-neon-blue rounded-full mx-auto flex items-center justify-center">
                        <span className="text-black font-bold text-lg">
                          {match.team1.split(' ')[1]?.charAt(0) || 'T'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-gray-400 text-sm mb-2">vs</p>
                      <div className="w-8 h-8 bg-gray-600 rounded-full mx-auto flex items-center justify-center">
                        <span className="text-white text-xs">VS</span>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-white mb-2">{match.team2}</h3>
                      <div className="w-16 h-16 bg-gradient-to-br from-neon-blue to-neon-purple rounded-full mx-auto flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {match.team2.split(' ')[1]?.charAt(0) || 'T'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="text-center space-y-3">
                  <button className="w-full btn-primary flex items-center justify-center space-x-2">
                    <Bell className="h-4 w-4" />
                    <span>Set Reminder</span>
                  </button>
                  
                  <button className="w-full btn-secondary">
                    Place Bet
                  </button>
                  
                  {(isToday(match.date) || isTomorrow(match.date)) && (
                    <div className="inline-block px-3 py-1 bg-red-500 text-white text-xs rounded-full animate-pulse">
                      {isToday(match.date) ? 'Today!' : 'Tomorrow!'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tournament Schedule Info */}
        <div className="mt-12 card">
          <h2 className="text-2xl font-bold text-white mb-6">Tournament Schedule</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">League Stage</h3>
              <p className="text-gray-400 text-sm">Jan 10 - Jan 17</p>
              <p className="text-gray-400 text-sm">Round-robin format</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Semi-Finals</h3>
              <p className="text-gray-400 text-sm">Jan 18 - Jan 19</p>
              <p className="text-gray-400 text-sm">Top 4 teams qualify</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Final</h3>
              <p className="text-gray-400 text-sm">Jan 21</p>
              <p className="text-gray-400 text-sm">Championship match</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fixtures;