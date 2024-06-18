const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 5000;

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
  try {
    const result = await pool.query('INSERT INTO players (address) VALUES ($1) RETURNING id', [address]);
    res.status(201).json({ playerId: result.rows[0].id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/buildings', async (req, res) => {
  const { playerId, type, level, position } = req.body;
  try {
    await pool.query(
      'INSERT INTO buildings (player_id, type, level, position) VALUES ($1, $2, $3, $4)',
      [playerId, type, level, position]
    );
    res.status(201).json({ message: 'Building saved' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/units', async (req, res) => {
  const { playerId, type, count } = req.body;
  try {
    await pool.query(
      'INSERT INTO units (player_id, type, count) VALUES ($1, $2, $3)',
      [playerId, type, count]
    );
    res.status(201).json({ message: 'Units saved' });
  } catch (error) {
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
