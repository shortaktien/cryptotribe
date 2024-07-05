const { Client } = require('pg');

module.exports = async (req, res) => {
  const { user_name, nickname } = req.body;

  if (!user_name || !nickname) {
    return res.status(400).json({ error: 'User name and nickname are required' });
  }

  const client = new Client({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    await client.connect();
    const checkNicknameQuery = 'SELECT user_name FROM users WHERE LOWER(nickname) = LOWER($1)';
    const checkNicknameValues = [nickname.toLowerCase()];
    const checkNicknameResult = await client.query(checkNicknameQuery, checkNicknameValues);

    if (checkNicknameResult.rows.length > 0) {
      return res.status(400).json({ error: 'Nickname already exists' });
    }

    const query = `
      INSERT INTO users (user_name, nickname, login_time)
      VALUES ($1, $2, NOW())
      ON CONFLICT (user_name)
      DO UPDATE SET nickname = EXCLUDED.nickname, login_time = EXCLUDED.login_time
      RETURNING *;
    `;
    const values = [user_name, nickname.toLowerCase()];

    const result = await client.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error saving nickname:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.end();
  }
};
