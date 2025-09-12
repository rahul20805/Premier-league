import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

const LiveMatches: React.FC = () => {
  const [selectedMatch, setSelectedMatch] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  const liveMatches = [
    {
      id: 1,
      team1: { name: 'Team Alpha', score: '185/4', overs: '18.2' },
      team2: { name: 'Team Beta', score: '142/8', overs: '20.0' },
      status: 'Team Alpha needs 43 runs from 10 balls',
      venue: 'Stadium A',
      currentBatsmen: ['Rahul Sharma (45*)', 'Amit Patel (23*)'],
      currentBowler: 'Vikram Singh',
      recentBalls: ['4', '1', '0', '6', '2', 'W'],
      streamUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      id: 2,
      team1: { name: 'Team Gamma', score: '156/6', overs: '19.4' },
      team2: { name: 'Team Delta', score: '158/3', overs: '17.2' },
      status: 'Team Delta won by 7 wickets',
      venue: 'Stadium B',
      currentBatsmen: ['Suresh Kumar (67*)', 'Ravi Gupta (34*)'],
      currentBowler: 'Manoj Yadav',
      recentBalls: ['1', '4', '0', '1', '2', '4'],
      streamUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    }
  ];

  const currentMatch = liveMatches[selectedMatch];

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Live Matches</h1>
          <p className="text-gray-400">Watch cricket action unfold in real-time</p>
        </div>

        {/* Match Selector */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          {liveMatches.map((match, index) => (
            <button
              key={match.id}
              onClick={() => setSelectedMatch(index)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                selectedMatch === index
                  ? 'bg-gradient-to-r from-neon-green to-neon-blue text-black'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              {match.team1.name} vs {match.team2.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Live Stream */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Live Stream</h2>
                <div className="flex items-center space-x-2">
                  <span className="live-indicator">LIVE</span>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600"
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600"
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <iframe
                  src={currentMatch.streamUrl}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Live Cricket Stream"
                ></iframe>
              </div>
              
              <div className="mt-4 text-center">
                <p className="text-gray-400 text-sm">Venue: {currentMatch.venue}</p>
              </div>
            </div>
          </div>

          {/* Live Scoreboard */}
          <div className="space-y-6">
            {/* Score Card */}
            <div className="card">
              <h3 className="text-lg font-bold text-white mb-4">Live Score</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-700 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-white">{currentMatch.team1.name}</h4>
                    <p className="text-2xl font-bold text-neon-green">{currentMatch.team1.score}</p>
                    <p className="text-sm text-gray-400">{currentMatch.team1.overs} overs</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-gray-700 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-white">{currentMatch.team2.name}</h4>
                    <p className="text-2xl font-bold text-neon-blue">{currentMatch.team2.score}</p>
                    <p className="text-sm text-gray-400">{currentMatch.team2.overs} overs</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-gray-700 rounded-lg">
                <p className="text-sm text-center text-white font-medium">
                  {currentMatch.status}
                </p>
              </div>
            </div>

            {/* Current Players */}
            <div className="card">
              <h3 className="text-lg font-bold text-white mb-4">On Field</h3>
              
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-semibold text-gray-400 mb-2">Batsmen</h4>
                  {currentMatch.currentBatsmen.map((batsman, index) => (
                    <p key={index} className="text-white text-sm">{batsman}</p>
                  ))}
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-gray-400 mb-2">Bowler</h4>
                  <p className="text-white text-sm">{currentMatch.currentBowler}</p>
                </div>
              </div>
            </div>

            {/* Recent Balls */}
            <div className="card">
              <h3 className="text-lg font-bold text-white mb-4">Recent Balls</h3>
              
              <div className="flex space-x-2">
                {currentMatch.recentBalls.map((ball, index) => (
                  <div
                    key={index}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                      ball === '4' ? 'bg-green-500 text-white' :
                      ball === '6' ? 'bg-purple-500 text-white' :
                      ball === 'W' ? 'bg-red-500 text-white' :
                      'bg-gray-600 text-white'
                    }`}
                  >
                    {ball}
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

export default LiveMatches;