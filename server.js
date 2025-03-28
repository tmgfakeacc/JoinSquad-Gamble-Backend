const express = require('express');
const cors = require('cors');
const mysql = require('mysql2'); // Use mysql2 instead of pg

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection
const pool = mysql.createPool({
  user: 'root',
  host: 'localhost',
  database: 'gambling_app',
  password: 'Laughing@101',
  port: 3306,
});

// Test endpoint
app.get('/', (req, res) => {
  res.send('Gambling App Backend');
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.promise().query('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // For now, assume the password is correct (we’ll add proper hashing later)
    if (password !== 'hashed_password') {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Return a token (for now, just a placeholder)
    res.json({ token: 'fake-token', user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Check if the user already exists
    const [existingUser] = await pool.promise().query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // For now, store the password as-is (we’ll add hashing later)
    const [result] = await pool.promise().query(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, password]
    );

    res.json({ message: 'User registered successfully', userId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.post('/api/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    // Check if the user exists
    const [user] = await pool.promise().query('SELECT * FROM users WHERE email = ?', [email]);
    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the password (we’ll add hashing later)
    await pool.promise().query('UPDATE users SET password_hash = ? WHERE email = ?', [newPassword, email]);

    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Fetch all game events
app.get('/api/games', async (req, res) => {
  try {
    const [games] = await pool.promise().query('SELECT * FROM game_events');
    res.json(games);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

const http = require('http');
const { Server } = require('socket.io');
const ioClient = require('socket.io-client');

const server = http.createServer(app);
const io = new Server(server);

// Connect to SquadJS Socket.IO API
const squadSocket = ioClient('http://localhost:3001', {
  query: { securityToken: '1' }
});

squadSocket.on('connect', () => {
  console.log('Connected to SquadJS Socket.IO API');
});

// Listen for live events
squadSocket.on('playerJoin', async (data) => {
  try {
    await pool.promise().query(
      'INSERT INTO game_events (event_type, player_name) VALUES (?, ?)',
      ['playerJoin', data.playerName]
    );
    io.emit('gameEvent', { type: 'playerJoin', data });
    console.log('Player Joined:', data);
  } catch (err) {
    console.error('Error storing playerJoin event:', err);
  }
});

squadSocket.on('playerLeave', async (data) => {
  try {
    await pool.promise().query(
      'INSERT INTO game_events (event_type, player_name) VALUES (?, ?)',
      ['playerLeave', data.playerName]
    );
    io.emit('gameEvent', { type: 'playerLeave', data });
    console.log('Player Left:', data);
  } catch (err) {
    console.error('Error storing playerLeave event:', err);
  }
});

squadSocket.on('playerKill', async (data) => {
  try {
    await pool.promise().query(
      'INSERT INTO game_events (event_type, killer_name, victim_name) VALUES (?, ?, ?)',
      ['playerKill', data.killerName, data.victimName]
    );
    io.emit('gameEvent', { type: 'playerKill', data });
    console.log('Player Kill:', data);
  } catch (err) {
    console.error('Error storing playerKill event:', err);
  }
});

squadSocket.on('roundEnd', async (data) => {
  try {
    await pool.promise().query(
      'INSERT INTO game_events (event_type, winning_team) VALUES (?, ?)',
      ['roundEnd', data.winningTeam]
    );
    io.emit('gameEvent', { type: 'roundEnd', data });
    console.log('Round Ended:', data);
  } catch (err) {
    console.error('Error storing roundEnd event:', err);
  }
});

squadSocket.on('disconnect', () => {
  console.log('Disconnected from SquadJS Socket.IO API');
});

// Fetch details of a specific game event
app.get('/api/games/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [game] = await pool.promise().query('SELECT * FROM game_events WHERE id = ?', [id]);
    if (game.length === 0) {
      return res.status(404).json({ error: 'Game not found' });
    }
    res.json(game[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Place a bet
app.post('/api/bets', async (req, res) => {
  const { userId, gameId, amount } = req.body;
  try {
    // Check if the user and game exist
    const [user] = await pool.promise().query('SELECT * FROM users WHERE id = ?', [userId]);
    const [game] = await pool.promise().query('SELECT * FROM game_events WHERE id = ?', [gameId]);

    if (user.length === 0 || game.length === 0) {
      return res.status(404).json({ error: 'User or game not found' });
    }

    // Insert the bet
    const [result] = await pool.promise().query(
      'INSERT INTO bets (user_id, game_id, amount) VALUES (?, ?, ?)',
      [userId, gameId, amount]
    );

    res.json({ message: 'Bet placed successfully', betId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Fetch a user’s bet history
app.get('/api/bets/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const [bets] = await pool.promise().query('SELECT * FROM bets WHERE user_id = ?', [userId]);
    res.json(bets);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Fetch top users
app.get('/api/leaderboard', async (req, res) => {
  try {
    const [leaderboard] = await pool.promise().query(
      'SELECT users.username, SUM(bets.amount) AS total_bet_amount FROM bets ' +
      'JOIN users ON bets.user_id = users.id ' +
      'GROUP BY users.id ORDER BY total_bet_amount DESC LIMIT 10'
    );
    res.json(leaderboard);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Fetch user profile details
app.get('/api/profile/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const [user] = await pool.promise().query('SELECT * FROM users WHERE id = ?', [userId]);
    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Update user profile
app.put('/api/profile/:userId', async (req, res) => {
  const { userId } = req.params;
  const { username, email } = req.body;
  try {
    // Check if the user exists
    const [user] = await pool.promise().query('SELECT * FROM users WHERE id = ?', [userId]);
    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the user profile
    await pool.promise().query(
      'UPDATE users SET username = ?, email = ? WHERE id = ?',
      [username, email, userId]
    );

    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Start the server
server.listen(5000, () => console.log('Server running on port 5000'));