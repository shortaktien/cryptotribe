import { Pool } from 'pg';
import { config } from 'dotenv';

config();

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests are allowed' });
    return;
  }

  const { playerId, type, count } = req.body;
  try {
    await pool.query(
      'INSERT INTO units (player_id, type, count) VALUES ($1, $2, $3)',
      [playerId, type, count]
    );
    res.status(201).json({ message: 'Units saved' });
  } catch (error) {
    console.error('Error saving units:', error);
    res.status(500).json({ error: error.message });
  }
}
