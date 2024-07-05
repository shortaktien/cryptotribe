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
    console.log('Database connection successful');

    const query = 'SELECT nickname FROM users WHERE user_name = $1';
    const values = [user_name];
    const result = await client.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { nickname } = result.rows[0];
    res.status(200).json({ nickname });
  } catch (error) {
    console.error('Error loading nickname:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.end();
  }
};
