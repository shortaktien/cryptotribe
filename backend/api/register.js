import { Pool } from 'pg';
import { config } from 'dotenv';
import Cors from 'cors';

config();

const cors = Cors({
  methods: ['POST', 'GET', 'HEAD'],
  origin: '*', // Hier können Sie die spezifischen Ursprünge angeben, die Sie zulassen möchten
});

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);

  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method);
    res.status(405).send({ message: 'Only POST requests are allowed' });
    return;
  }

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
}
