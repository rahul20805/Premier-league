import React, { useState } from 'react';
import { DollarSign, TrendingUp, Trophy, Users, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Betting: React.FC = () => {
  const { user } = useAuth();
  const [selectedMatch, setSelectedMatch] = useState<number | null>(null);
  const [betAmount, setBetAmount] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');

  const availableMatches = [
    {
      id: 1,
      team1: { name: 'Team Alpha', odds: 1.8 },
      team2: { name: 'Team Gamma', odds: 2.1 },
      date: '2024-01-15',
      time: '14:00',
      status: 'upcoming'
    },
    {
      id: 2,
      team1: { name: 'Team Beta', odds: 2.3 },
      team2: { name: 'Team Delta', odds: 1.7 },
      date: '2024-01-16',
      time: '16:00',
      status: 'upcoming'
    },
    {
      id: 3,
      team1: { name: 'Team Epsilon', odds: 1.9 },
      team2: { name: 'Team Zeta', odds: 2.0 },
      date: '2024-01-17',
      time: '18:00',
      status: 'upcoming'
    }
  ];

  const myBets = [
    {
      id: 1,
      match: 'Team Alpha vs Team Beta',
      team: 'Team Alpha',
      amount: 50,
      odds: 1.8,
      potentialWin: 90,
      status: 'pending',
      date: '2024-01-10'
    },
    {
      id: 2,
      match: 'Team Gamma vs Team Delta',
      team: 'Team Delta',
      amount: 25,
      odds: 2.1,
      potentialWin: 52.5,
      status: 'won',
      date: '2024-01-09'
    },
    {
      id: 3,
      match: 'Team Epsilon vs Team Zeta',
      team: 'Team Epsilon',
      amount: 30,
      odds: 1.9,
      potentialWin: 57,
      status: 'lost',
      date: '2024-01-08'
    }
  ];

  const leaderboard = [
    { rank: 1, username: 'CricketKing', totalWinnings: 1250, betsWon: 15 },
    { rank: 2, username: 'BetMaster', totalWinnings: 980, betsWon: 12 },
    { rank: 3, username: 'LuckyStriker', totalWinnings: 875, betsWon: 11 },
    { rank: 4, username: 'SportsFan', totalWinnings: 720, betsWon: 9 },
    { rank: 5, username: 'WinnerTakesAll', totalWinnings: 650, betsWon: 8 }
  ];

  const handlePlaceBet = () => {
    if (!user) {
      alert('Please login to place bets');
      return;
    }
    
    if (!selectedMatch || !selectedTeam || !betAmount) {
      alert('Please fill in all bet details');
      return;
    }

    const amount = parseFloat(betAmount);
    if (amount > user.wallet) {
      alert('Insufficient wallet balance');
      return;
    }

    // In a real app, this would make an API call
    alert(`Bet placed successfully! ${amount} coins on ${selectedTeam}`);
    setBetAmount('');
    setSelectedTeam('');
    setSelectedMatch(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'won':
        return 'text-green-400';
      case 'lost':
        return 'text-red-400';
      default:
        return 'text-yellow-400';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'won':
        return 'bg-green-500/20 border-green-500/30';
      case 'lost':
        return 'bg-red-500/20 border-red-500/30';
      default:
        return 'bg-yellow-500/20 border-yellow-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Betting Arena</h1>
          <p className="text-gray-400">Place your bets and compete with other fans</p>
          
          {user && (
            <div className="mt-4 inline-flex items-center space-x-2 bg-gradient-to-r from-neon-green to-neon-blue px-6 py-2 rounded-full">
              <DollarSign className="h-5 w-5 text-black" />
              <span className="text-black font-bold">Wallet: ${user.wallet}</span>
            </div>
          )}
        </div>

        {!user && (
          <div className="card mb-8 border-yellow-500/30 bg-yellow-500/10">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-6 w-6 text-yellow-400" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-400">Login Required</h3>
                <p className="text-gray-300">Please login to place bets and track your winnings</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Available Matches */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <h2 className="text-2xl font-bold text-white mb-6">Available Matches</h2>
              
              <div className="space-y-4">
                {availableMatches.map((match) => (
                  <div
                    key={match.id}
                    className={`p-4 rounded-lg border transition-all cursor-pointer ${
                      selectedMatch === match.id
                        ? 'border-neon-blue bg-neon-blue/10'
                        : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                    }`}
                    onClick={() => setSelectedMatch(match.id)}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div className="text-sm text-gray-400">
                        {new Date(match.date).toLocaleDateString()} at {match.time}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTeam(match.team1.name);
                          setSelectedMatch(match.id);
                        }}
                        className={`p-3 rounded-lg border transition-all ${
                          selectedTeam === match.team1.name && selectedMatch === match.id
                            ? 'border-neon-green bg-neon-green/20'
                            : 'border-gray-600 hover:border-gray-500'
                        }`}
                      >
                        <div className="text-white font-semibold">{match.team1.name}</div>
                        <div className="text-neon-green text-lg font-bold">{match.team1.odds}x</div>
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTeam(match.team2.name);
                          setSelectedMatch(match.id);
                        }}
                        className={`p-3 rounded-lg border transition-all ${
                          selectedTeam === match.team2.name && selectedMatch === match.id
                            ? 'border-neon-green bg-neon-green/20'
                            : 'border-gray-600 hover:border-gray-500'
                        }`}
                      >
                        <div className="text-white font-semibold">{match.team2.name}</div>
                        <div className="text-neon-green text-lg font-bold">{match.team2.odds}x</div>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Place Bet */}
            {user && selectedMatch && selectedTeam && (
              <div className="card border-neon-green/30 bg-neon-green/5">
                <h3 className="text-xl font-bold text-white mb-4">Place Your Bet</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Selected Team: <span className="text-neon-green">{selectedTeam}</span>
                    </label>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Bet Amount
                    </label>
                    <input
                      type="number"
                      value={betAmount}
                      onChange={(e) => setBetAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-neon-blue"
                      min="1"
                      max={user.wallet}
                    />
                  </div>
                  
                  {betAmount && (
                    <div className="p-3 bg-gray-700 rounded-lg">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Potential Winnings:</span>
                        <span className="text-neon-green font-bold">
                          ${(parseFloat(betAmount) * (availableMatches.find(m => m.id === selectedMatch)?.team1.name === selectedTeam ? availableMatches.find(m => m.id === selectedMatch)?.team1.odds : availableMatches.find(m => m.id === selectedMatch)?.team2.odds) || 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <button
                    onClick={handlePlaceBet}
                    className="w-full btn-primary"
                    disabled={!betAmount || parseFloat(betAmount) > user.wallet}
                  >
                    Place Bet
                  </button>
                </div>
              </div>
            )}

            {/* My Bets */}
            {user && (
              <div className="card">
                <h2 className="text-2xl font-bold text-white mb-6">My Bets</h2>
                
                <div className="space-y-3">
                  {myBets.map((bet) => (
                    <div
                      key={bet.id}
                      className={`p-4 rounded-lg border ${getStatusBg(bet.status)}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="text-white font-semibold">{bet.match}</h4>
                          <p className="text-sm text-gray-400">Bet on: {bet.team}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(bet.status)}`}>
                          {bet.status.toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">Amount</p>
                          <p className="text-white font-semibold">${bet.amount}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Odds</p>
                          <p className="text-white font-semibold">{bet.odds}x</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Potential Win</p>
                          <p className="text-neon-green font-semibold">${bet.potentialWin}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Leaderboard */}
          <div className="card">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
              <Trophy className="h-6 w-6 text-neon-green" />
              <span>Leaderboard</span>
            </h2>
            
            <div className="space-y-3">
              {leaderboard.map((player) => (
                <div
                  key={player.rank}
                  className={`p-4 rounded-lg ${
                    player.rank === 1
                      ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30'
                      : 'bg-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          player.rank === 1
                            ? 'bg-yellow-500 text-black'
                            : player.rank <= 3
                            ? 'bg-gray-600 text-white'
                            : 'bg-gray-700 text-gray-300'
                        }`}
                      >
                        {player.rank}
                      </div>
                      <div>
                        <p className="text-white font-semibold">{player.username}</p>
                        <p className="text-xs text-gray-400">{player.betsWon} bets won</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-neon-green font-bold">${player.totalWinnings}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-gray-700 rounded-lg text-center">
              <Users className="h-8 w-8 text-neon-blue mx-auto mb-2" />
              <p className="text-white font-semibold">Join the Competition!</p>
              <p className="text-sm text-gray-400">Place bets to climb the leaderboard</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Betting;