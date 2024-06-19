import { Pool } from 'pg';
import { config } from 'dotenv';
import cors from 'cors';

config();

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const corsOptions = {
  origin: 'https://cryptotribe.vercel.app',
  optionsSuccessStatus: 200
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests are allowed' });
    return;
  }

  cors(corsOptions)(req, res, async () => {
    const { address } = req.body;
    console.log('Registering player with address:', address);
    try {
      const existingPlayer = await pool.query('SELECT id FROM players WHERE address = $1', [address]);
      if (existingPlayer.rows.length > 0) {
        console.log('Player already exists with ID:', existingPlayer.rows[0].id);
        res.status(200).json({ playerId: existingPlayer.rows[0].id });
      } else {
        const result = await pool.query('INSERT INTO players (address) VALUES ($1) RETURNING id', [address]);
        console.log('Player registered with ID:', result.rows[0].id);
        res.status(201).json({ playerId: result.rows[0].id });
      }
    } catch (error) {
      console.error('Error registering player:', error);
      res.status(500).json({ error: error.message });
    }
  });
}
