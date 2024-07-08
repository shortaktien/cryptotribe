const { Client } = require('pg');

module.exports = async (req, res) => {
  const client = new Client({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    await client.connect();
    const result = await client.query(`
      SELECT pp.user_name, u.nickname, pp.economic_points 
      FROM player_progress pp
      LEFT JOIN users u ON pp.user_name = u.user_name
      ORDER BY pp.economic_points DESC
    `);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching players:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.end();
  }
};
