const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection (using in-memory for demo)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/spl';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  wallet: { type: Number, default: 100 },
  createdAt: { type: Date, default: Date.now }
});

// Player Schema
const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, enum: ['batsman', 'bowler', 'all-rounder', 'wicket-keeper'], required: true },
  team: { type: String, required: true },
  photo: { type: String, required: true },
  stats: {
    matches: { type: Number, default: 0 },
    runs: { type: Number, default: 0 },
    wickets: { type: Number, default: 0 },
    average: { type: Number, default: 0 },
    strikeRate: { type: Number, default: 0 }
  }
});

// Match Schema
const matchSchema = new mongoose.Schema({
  team1: { type: String, required: true },
  team2: { type: String, required: true },
  date: { type: Date, required: true },
  venue: { type: String, required: true },
  status: { type: String, enum: ['upcoming', 'live', 'completed'], default: 'upcoming' },
  result: {
    winner: String,
    margin: String
  },
  liveScore: {
    team1Score: String,
    team2Score: String,
    overs: String,
    currentBatsmen: [String],
    currentBowler: String
  }
});

// Bet Schema
const betSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  matchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Match', required: true },
  team: { type: String, required: true },
  amount: { type: Number, required: true },
  odds: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'won', 'lost'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Player = mongoose.model('Player', playerSchema);
const Match = mongoose.model('Match', matchSchema);
const Bet = mongoose.model('Bet', betSchema);

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Auth Routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      email,
      username,
      password: hashedPassword,
      wallet: 100 // Welcome bonus
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        wallet: user.wallet,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        wallet: user.wallet,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Player Routes
app.get('/api/players', async (req, res) => {
  try {
    const players = await Player.find();
    res.json(players);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/players/:id', async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }
    res.json(player);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Match Routes
app.get('/api/matches', async (req, res) => {
  try {
    const matches = await Match.find().sort({ date: 1 });
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/matches/live', async (req, res) => {
  try {
    const liveMatches = await Match.find({ status: 'live' });
    res.json(liveMatches);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Betting Routes
app.post('/api/bets', authenticateToken, async (req, res) => {
  try {
    const { matchId, team, amount, odds } = req.body;
    const userId = req.user.userId;

    // Check user wallet
    const user = await User.findById(userId);
    if (user.wallet < amount) {
      return res.status(400).json({ message: 'Insufficient wallet balance' });
    }

    // Create bet
    const bet = new Bet({
      userId,
      matchId,
      team,
      amount,
      odds
    });

    await bet.save();

    // Update user wallet
    user.wallet -= amount;
    await user.save();

    res.status(201).json(bet);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/bets/user', authenticateToken, async (req, res) => {
  try {
    const bets = await Bet.find({ userId: req.user.userId })
      .populate('matchId')
      .sort({ createdAt: -1 });
    res.json(bets);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Socket.IO for live updates
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-match', (matchId) => {
    socket.join(`match-${matchId}`);
    console.log(`User ${socket.id} joined match ${matchId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Simulate live score updates
setInterval(() => {
  // This would be replaced with real cricket API integration
  const mockUpdate = {
    matchId: '1',
    team1Score: `${Math.floor(Math.random() * 200)}/4`,
    team2Score: `${Math.floor(Math.random() * 200)}/6`,
    overs: `${Math.floor(Math.random() * 20)}.${Math.floor(Math.random() * 6)}`,
    currentBatsmen: ['Player A (45*)', 'Player B (23*)'],
    currentBowler: 'Player C'
  };

  io.to('match-1').emit('score-update', mockUpdate);
}, 10000); // Update every 10 seconds

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    
    // Seed initial data
    seedData();
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Seed initial data
async function seedData() {
  try {
    // Check if data already exists
    const playerCount = await Player.countDocuments();
    if (playerCount > 0) return;

    // Seed players
    const players = [
      {
        name: 'Rahul Sharma',
        role: 'batsman',
        team: 'Team Alpha',
        photo: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200',
        stats: { matches: 12, runs: 485, wickets: 2, average: 48.5, strikeRate: 142.3 }
      },
      {
        name: 'Amit Patel',
        role: 'bowler',
        team: 'Team Beta',
        photo: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=200',
        stats: { matches: 11, runs: 45, wickets: 23, average: 18.2, strikeRate: 95.4 }
      },
      {
        name: 'Vikram Singh',
        role: 'all-rounder',
        team: 'Team Gamma',
        photo: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=200',
        stats: { matches: 13, runs: 320, wickets: 15, average: 32.0, strikeRate: 128.7 }
      }
    ];

    await Player.insertMany(players);

    // Seed matches
    const matches = [
      {
        team1: 'Team Alpha',
        team2: 'Team Beta',
        date: new Date('2024-01-15T14:00:00Z'),
        venue: 'Stadium A',
        status: 'upcoming'
      },
      {
        team1: 'Team Gamma',
        team2: 'Team Delta',
        date: new Date('2024-01-16T16:00:00Z'),
        venue: 'Stadium B',
        status: 'upcoming'
      }
    ];

    await Match.insertMany(matches);

    console.log('Initial data seeded successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});