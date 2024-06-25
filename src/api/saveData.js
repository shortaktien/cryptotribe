// src/api/saveData.js
import { Client } from 'pg';

export default async (req, res) => {
  if (req.method === 'POST') {
    const { address, name, balance, resources } = req.body;

    const client = new Client({
      connectionString: process.env.POSTGRES_URL, // Verweis auf die Umgebungsvariable
    });

    await client.connect();

    try {
      const query = `
        INSERT INTO user_resources (address, name, balance, resources)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (address) 
        DO UPDATE SET name = $2, balance = $3, resources = $4
      `;
      const values = [address, name, balance, JSON.stringify(resources)];
      await client.query(query, values);
      res.status(200).json({ message: 'Data saved successfully!' });
    } catch (error) {
      console.error('Error saving data:', error);
      res.status(500).json({ error: 'Error saving data' });
    } finally {
      await client.end();
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
