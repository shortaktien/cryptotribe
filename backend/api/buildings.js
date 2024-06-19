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

  const { playerId, type, level, position } = req.body;
  try {
    await pool.query(
      'INSERT INTO buildings (player_id, type, level, position) VALUES ($1, $2, $3, $4)',
      [playerId, type, level, position]
    );
    res.status(201).json({ message: 'Building saved' });
  } catch (error) {
    console.error('Error saving building:', error);
    res.status(500).json({ error: error.message });
  }
}
