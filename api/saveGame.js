const { Client } = require('pg');

module.exports = async (req, res) => {
  console.log('Received request:', req.body); // Logging request body
  const { user_name, resources } = req.body;

  if (!user_name || !resources) {
    console.error('Missing user_name or resources');
    return res.status(400).json({ error: 'User name and resources are required' });
  }

  const client = new Client({
    connectionString: process.env.POSTGRES_URL,
  });

  try {
    await client.connect();
    console.log('Connected to database');

    const query = `
      INSERT INTO player_progress (user_name, resources, created_at, updated_at)
      VALUES ($1, $2, NOW(), NOW())
      ON CONFLICT (user_name)
      DO UPDATE SET resources = $2, updated_at = NOW()
      RETURNING *;
    `;
    const values = [user_name, JSON.stringify(resources)];

    console.log('Executing query:', query, values);
    const result = await client.query(query, values);
    console.log('Query result:', result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error saving game progress:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.end();
    console.log('Database connection closed');
  }
};
