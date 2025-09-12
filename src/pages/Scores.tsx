import React, { useState } from 'react';
import { Trophy, Calendar, MapPin, Clock } from 'lucide-react';

const Scores: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'results' | 'points'>('results');

  const completedMatches = [
    {
      id: 1,
      team1: { name: 'Team Alpha', score: '185/4', overs: '20.0' },
      team2: { name: 'Team Beta', score: '142/8', overs: '20.0' },
      result: 'Team Alpha won by 43 runs',
      date: '2024-01-10',
      venue: 'Stadium A',
      highlights: ['Rahul Sharma 89*', 'Amit Patel 4/32']
    },
    {
      id: 2,
      team1: { name: 'Team Gamma', score: '156/6', overs: '20.0' },
      team2: { name: 'Team Delta', score: '158/3', overs: '17.2' },
      result: 'Team Delta won by 7 wickets',
      date: '2024-01-09',
      venue: 'Stadium B',
      highlights: ['Suresh Kumar 67*', 'Vikram Singh 3/28']
    },
    {
      id: 3,
      team1: { name: 'Team Epsilon', score: '178/5', overs: '20.0' },
      team2: { name: 'Team Zeta', score: '165/9', overs: '20.0' },
      result: 'Team Epsilon won by 13 runs',
      date: '2024-01-08',
      venue: 'Stadium C',
      highlights: ['Ravi Gupta 78', 'Manoj Yadav 5/31']
    },
    {
      id: 4,
      team1: { name: 'Team Beta', score: '134/7', overs: '20.0' },
      team2: { name: 'Team Gamma', score: '138/4', overs: '18.4' },
      result: 'Team Gamma won by 6 wickets',
      date: '2024-01-07',
      venue: 'Stadium A',
      highlights: ['Vikram Singh 45*', 'Amit Patel 3/25']
    }
  ];

  const pointsTable = [
    {
      position: 1,
      team: 'Team Alpha',
      played: 8,
      won: 7,
      lost: 1,
      nrr: '+1.45',
      points: 14
    },
    {
      position: 2,
      team: 'Team Delta',
      played: 8,
      won: 6,
      lost: 2,
      nrr: '+0.89',
      points: 12
    },
    {
      position: 3,
      team: 'Team Epsilon',
      played: 8,
      won: 5,
      lost: 3,
      nrr: '+0.34',
      points: 10
    },
    {
      position: 4,
      team: 'Team Gamma',
      played: 8,
      won: 4,
      lost: 4,
      nrr: '-0.12',
      points: 8
    },
    {
      position: 5,
      team: 'Team Beta',
      played: 8,
      won: 3,
      lost: 5,
      nrr: '-0.67',
      points: 6
    },
    {
      position: 6,
      team: 'Team Zeta',
      played: 8,
      won: 1,
      lost: 7,
      nrr: '-1.23',
      points: 2
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Scores & Results</h1>
          <p className="text-gray-400">Complete match results and tournament standings</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('results')}
              className={`px-6 py-2 rounded-md font-semibold transition-all ${
                activeTab === 'results'
                  ? 'bg-gradient-to-r from-neon-green to-neon-blue text-black'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Match Results
            </button>
            <button
              onClick={() => setActiveTab('points')}
              className={`px-6 py-2 rounded-md font-semibold transition-all ${
                activeTab === 'points'
                  ? 'bg-gradient-to-r from-neon-green to-neon-blue text-black'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Points Table
            </button>
          </div>
        </div>

        {/* Match Results */}
        {activeTab === 'results' && (
          <div className="space-y-6">
            {completedMatches.map((match) => (
              <div key={match.id} className="card">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Match Score */}
                  <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(match.date).toLocaleDateString()}</span>
                        <MapPin className="h-4 w-4 ml-4" />
                        <span>{match.venue}</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Team 1 */}
                      <div className="flex justify-between items-center p-4 bg-gray-700 rounded-lg">
                        <div>
                          <h3 className="text-lg font-semibold text-white">{match.team1.name}</h3>
                          <p className="text-sm text-gray-400">{match.team1.overs} overs</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-neon-green">{match.team1.score}</p>
                        </div>
                      </div>

                      {/* Team 2 */}
                      <div className="flex justify-between items-center p-4 bg-gray-700 rounded-lg">
                        <div>
                          <h3 className="text-lg font-semibold text-white">{match.team2.name}</h3>
                          <p className="text-sm text-gray-400">{match.team2.overs} overs</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-neon-blue">{match.team2.score}</p>
                        </div>
                      </div>
                    </div>

                    {/* Result */}
                    <div className="mt-4 p-3 bg-gradient-to-r from-neon-green/20 to-neon-blue/20 rounded-lg border border-neon-green/30">
                      <div className="flex items-center space-x-2">
                        <Trophy className="h-5 w-5 text-neon-green" />
                        <p className="text-white font-semibold">{match.result}</p>
                      </div>
                    </div>
                  </div>

                  {/* Match Highlights */}
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Match Highlights</h4>
                    <div className="space-y-2">
                      {match.highlights.map((highlight, index) => (
                        <div
                          key={index}
                          className="p-3 bg-gray-700 rounded-lg text-sm text-gray-300"
                        >
                          {highlight}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Points Table */}
        {activeTab === 'points' && (
          <div className="card">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
              <Trophy className="h-6 w-6 text-neon-green" />
              <span>Tournament Standings</span>
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Pos</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Team</th>
                    <th className="text-center py-3 px-4 text-gray-400 font-semibold">P</th>
                    <th className="text-center py-3 px-4 text-gray-400 font-semibold">W</th>
                    <th className="text-center py-3 px-4 text-gray-400 font-semibold">L</th>
                    <th className="text-center py-3 px-4 text-gray-400 font-semibold">NRR</th>
                    <th className="text-center py-3 px-4 text-gray-400 font-semibold">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {pointsTable.map((team) => (
                    <tr
                      key={team.position}
                      className={`border-b border-gray-700 hover:bg-gray-700/50 transition-colors ${
                        team.position <= 4 ? 'bg-green-500/10' : ''
                      }`}
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              team.position === 1
                                ? 'bg-yellow-500 text-black'
                                : team.position <= 4
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-600 text-white'
                            }`}
                          >
                            {team.position}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-white font-semibold">{team.team}</span>
                      </td>
                      <td className="py-4 px-4 text-center text-gray-300">{team.played}</td>
                      <td className="py-4 px-4 text-center text-neon-green font-semibold">
                        {team.won}
                      </td>
                      <td className="py-4 px-4 text-center text-red-400 font-semibold">
                        {team.lost}
                      </td>
                      <td className="py-4 px-4 text-center text-gray-300">{team.nrr}</td>
                      <td className="py-4 px-4 text-center">
                        <span className="text-neon-blue font-bold text-lg">{team.points}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 p-4 bg-gray-700 rounded-lg">
              <h3 className="text-white font-semibold mb-2">Qualification Status</h3>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-300">Qualified for Playoffs</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                  <span className="text-gray-300">Eliminated</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Scores;