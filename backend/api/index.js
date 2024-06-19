const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.use(cors());
app.use(bodyParser.json());

app.post('/api/register', async (req, res) => {
  const { address } = req.body;
  console.log('Registering player with address:', address); // Debugging-Information
  try {
    const result = await pool.query('INSERT INTO players (address) VALUES ($1) ON CONFLICT (address) DO NOTHING RETURNING id', [address]);
    if (result.rows.length > 0) {
      res.status(201).json({ playerId: result.rows[0].id });
    } else {
      // Spieler existiert bereits
      const existingPlayer = await pool.query('SELECT id FROM players WHERE address = $1', [address]);
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
    res.status(500).json({ error: error.message });
  }
});

module.exports = app;
