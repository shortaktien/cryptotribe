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
  if (req.method !== 'GET') {
    res.status(405).send({ message: 'Only GET requests are allowed' });
    return;
  }

  const { address } = req.query;
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
    console.error('Error fetching game state:', error);
    res.status(500).json({ error: error.message });
  }
}
