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

app.listen(5000, () => console.log('Server running on port 5000'));