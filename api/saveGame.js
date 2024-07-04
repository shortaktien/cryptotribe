const { Client } = require('pg');

module.exports = async (req, res) => {
  console.log('Received request:', req.body); // Logging request body
  const { user_name, resources, buildings, capacities } = req.body;

  if (!user_name || !resources || !buildings || !capacities) {
    console.error('Missing user_name, resources, buildings, or capacities');
    return res.status(400).json({ error: 'User name, resources, buildings, and capacities are required' });
  }

  const client = new Client({
    connectionString: process.env.POSTGRES_URL,
  });

  try {
    await client.connect();
    console.log('Connected to database');

    const query1 = `
      INSERT INTO player_progress (user_name, resources, created_at, updated_at)
      VALUES ($1, $2, NOW(), NOW())
      ON CONFLICT (user_name)
      DO UPDATE SET resources = $2, updated_at = NOW()
      RETURNING *;
    `;
    const values1 = [user_name, JSON.stringify(resources)];

    console.log('Executing query for resources:', query1, values1);
    const result1 = await client.query(query1, values1);
    console.log('Query result for resources:', result1.rows[0]);

    const query2 = `
      INSERT INTO building_progress (user_name, buildings, capacities, created_at, updated_at)
      VALUES ($1, $2, $3, NOW(), NOW())
      ON CONFLICT (user_name)
      DO UPDATE SET buildings = $2, capacities = $3, updated_at = NOW()
      RETURNING *;
    `;
    const values2 = [user_name, JSON.stringify(buildings), JSON.stringify(capacities)];

    console.log('Executing query for buildings and capacities:', query2, values2);
    const result2 = await client.query(query2, values2);
    console.log('Query result for buildings and capacities:', result2.rows[0]);

    res.status(201).json({ resources: result1.rows[0], buildings: result2.rows[0], capacities: result2.rows[0] });
  } catch (error) {
    console.error('Error saving game progress:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.end();
    console.log('Database connection closed');
  }
};
