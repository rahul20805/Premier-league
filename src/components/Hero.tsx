import React from 'react';
import { Play, Calendar, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <div className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-neon-green to-neon-blue rounded-full mb-6 neon-glow">
              <Trophy className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-4">
              <span className="gradient-text">SPL</span>
            </h1>
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-6">
              Student Premier League
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Experience the thrill of cricket like never before. Watch live matches, 
              follow your favorite players, and join the ultimate student cricket tournament.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link to="/live" className="btn-primary flex items-center space-x-2">
              <Play className="h-5 w-5" />
              <span>Watch Live</span>
            </Link>
            <Link to="/fixtures" className="btn-secondary flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>View Fixtures</span>
            </Link>
          </div>

          {/* Live Match Highlight */}
          <div className="bg-gray-800 rounded-xl p-6 max-w-4xl mx-auto border border-gray-700">
            <div className="flex items-center justify-center mb-4">
              <span className="live-indicator">LIVE</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-2">Team Alpha</h3>
                <p className="text-2xl font-bold text-neon-green">185/4</p>
                <p className="text-sm text-gray-400">18.2 overs</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-2">vs</p>
                <p className="text-lg font-semibold text-white">Match 15</p>
                <p className="text-sm text-gray-400">Finals</p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-2">Team Beta</h3>
                <p className="text-2xl font-bold text-neon-blue">142/8</p>
                <p className="text-sm text-gray-400">20 overs</p>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-300">
                Team Alpha needs 43 runs from 10 balls
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;