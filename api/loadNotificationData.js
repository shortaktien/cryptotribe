const { connectToDatabase } = require('./services/database');

module.exports = async (req, res) => {
  const { user_name } = req.query;

  if (!user_name) {
    return res.status(400).json({ error: 'user_name is required' });
  }

  const client = await connectToDatabase();

  try {
    const result = await client.query(
      `SELECT login_time, last_savegame FROM users WHERE user_name = $1`,
      [user_name]
    );

    if (result.rows.length > 0) {
      const { login_time, last_savegame } = result.rows[0];
      res.status(200).json({ login_time, last_savegame });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching notification data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.end();
  }
};
