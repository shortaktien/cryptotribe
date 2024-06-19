require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

const port = process.env.PORT || 5000;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.use(cors({
  origin: '*', // Erlaube alle Ursprünge, du kannst hier auch spezifische URLs angeben
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204
}));
app.use(bodyParser.json());

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Connected to the database');
  release();
});

app.post('/api/register', async (req, res) => {
  const { address } = req.body;
  console.log('Registering player with address:', address); // Debugging-Information
  try {
    const result = await pool.query('INSERT INTO players (address) VALUES ($1) ON CONFLICT (address) DO NOTHING RETURNING id', [address]);
    console.log('Query result:', result); // Debugging-Information
    if (result.rows.length > 0) {
      console.log('Player registered with ID:', result.rows[0].id);
      res.status(201).json({ playerId: result.rows[0].id });
    } else {
      // Spieler existiert bereits
      const existingPlayer = await pool.query('SELECT id FROM players WHERE address = $1', [address]);
      console.log('Existing player ID:', existingPlayer.rows[0].id);
      res.status(200).json({ playerId: existingPlayer.rows[0].id });
    }
  } catch (error) {
    console.error('Error registering player:', error); // Debugging-Information
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/state/:address', async (req, res) => {
  const { address } = req.params;
  try {
    const playerResult = await pool.query('SELECT id FROM players WHERE address = $1', [address]);
    if (playerResult.rows.length === 0) {
      console.log('Player not found for address:', address);
      return res.status(404).json({ error: 'Player not found' });
    }
    const playerId = playerResult.rows[0].id;

    const buildingsResult = await pool.query('SELECT * FROM buildings WHERE player_id = $1', [playerId]);
    const unitsResult = await pool.query('SELECT * FROM units WHERE player_id = $1', [playerId]);

    res.status(200).json({
      buildings: buildingsResult.rows,
      units: unitsResult.rows
    });
  } catch (error) {
    console.error('Error fetching game state:', error); // Debugging-Information
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
