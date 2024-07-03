const { Client } = require('pg');

module.exports = async (req, res) => {
  const { user_name } = req.query;

  if (!user_name) {
    return res.status(400).json({ error: 'User name is required' });
  }

  const client = new Client({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    await client.connect();

    const query1 = 'SELECT resources FROM player_progress WHERE user_name = $1';
    const values1 = [user_name];
    const result1 = await client.query(query1, values1);

    console.log('Query1 result:', result1.rows);

    if (result1.rows.length === 0) {
      return res.status(404).json({ error: 'User not found in player_progress' });
    }

    const query2 = 'SELECT buildings FROM building_progress WHERE user_name = $1';
    const values2 = [user_name];
    const result2 = await client.query(query2, values2);

    console.log('Query2 result:', result2.rows);

    if (result2.rows.length === 0) {
      return res.status(404).json({ error: 'User not found in building_progress' });
    }

    res.status(200).json({ resources: result1.rows[0].resources, buildings: result2.rows[0].buildings });
  } catch (error) {
    console.error('Error loading game progress:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.end();
  }
};
