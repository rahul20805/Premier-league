import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import LiveMatches from './pages/LiveMatches';
import Players from './pages/Players';
import PlayerProfile from './pages/PlayerProfile';
import Scores from './pages/Scores';
import Fixtures from './pages/Fixtures';
import Betting from './pages/Betting';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-900">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/live" element={<LiveMatches />} />
            <Route path="/players" element={<Players />} />
            <Route path="/players/:id" element={<PlayerProfile />} />
            <Route path="/scores" element={<Scores />} />
            <Route path="/fixtures" element={<Fixtures />} />
            <Route path="/betting" element={<Betting />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;