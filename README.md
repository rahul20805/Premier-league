# SPL - Student Premier League

A complete full-stack cricket tournament web application built with React, Node.js, Express, and MongoDB.

## Features

### Frontend Features
- **Modern UI**: Dark theme with neon accents, fully responsive design
- **Home Page**: Hero section with live match highlights and tournament stats
- **Live Matches**: Real-time score updates with embedded video streams
- **Players**: Comprehensive player profiles with detailed statistics
- **Scores & Fixtures**: Match results, points table, and upcoming fixtures
- **Betting System**: Virtual coin betting with leaderboards
- **Authentication**: Secure user registration and login

### Backend Features
- **RESTful API**: Complete API for all cricket data
- **Real-time Updates**: WebSocket integration for live scores
- **User Management**: JWT-based authentication
- **Database**: MongoDB with Mongoose ODM
- **Security**: Password hashing, input validation

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- Socket.IO client for real-time updates
- Lucide React for icons

### Backend
- Node.js with Express
- MongoDB with Mongoose
- Socket.IO for real-time communication
- JWT for authentication
- bcryptjs for password hashing

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd spl-cricket-app
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Environment Setup**
   Create a `.env` file in the server directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/spl
   JWT_SECRET=your-secret-key-here
   PORT=3001
   ```

5. **Start the application**
   
   **Terminal 1 - Backend:**
   ```bash
   cd server
   npm run dev
   ```
   
   **Terminal 2 - Frontend:**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

## Demo Credentials

For testing purposes, you can use:
- **Email**: demo@spl.com
- **Password**: demo123

Or create a new account to get $100 virtual coins as a welcome bonus.

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Players
- `GET /api/players` - Get all players
- `GET /api/players/:id` - Get player by ID

### Matches
- `GET /api/matches` - Get all matches
- `GET /api/matches/live` - Get live matches

### Betting
- `POST /api/bets` - Place a bet
- `GET /api/bets/user` - Get user's bets

## Features in Detail

### Live Score Updates
The application uses WebSocket connections to provide real-time score updates. Users can watch live matches with:
- Current scores and overs
- Active batsmen and bowler information
- Recent ball-by-ball updates
- Embedded video streams

### Betting System
- Virtual coin-based betting (no real money)
- Multiple betting options per match
- Real-time odds calculation
- Leaderboard system
- Wallet management

### Player Profiles
- Detailed statistics (runs, wickets, average, strike rate)
- Performance history
- Team information
- Role-based categorization

### Tournament Management
- Points table with live standings
- Fixture scheduling
- Match results and highlights
- Playoff qualification tracking

## Deployment

### Frontend Deployment
The frontend can be deployed to platforms like Vercel, Netlify, or GitHub Pages:

```bash
npm run build
```

### Backend Deployment
The backend can be deployed to platforms like Heroku, Railway, or DigitalOcean:

1. Set environment variables on your hosting platform
2. Ensure MongoDB connection string is configured
3. Deploy the server directory

### Database Setup
For production, use MongoDB Atlas or another cloud MongoDB service:

1. Create a MongoDB cluster
2. Get the connection string
3. Update the `MONGODB_URI` environment variable

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository.