const { Client } = require('pg');

module.exports = async (req, res) => {
  const { address } = req.body;

  if (!address) {
    return res.status(400).json({ error: 'Address is required' });
  }

  const client = new Client({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    await client.connect();
    const result = await client.query(
      `INSERT INTO users (user_name, login_time) 
       VALUES ($1, $2)
       ON CONFLICT (user_name) 
       DO UPDATE SET login_time = EXCLUDED.login_time 
       RETURNING *`,
      [address, new Date()]
    );

    if (result.rows.length > 0) {
      //console.log('Address saved or updated successfully');
    } else {
      console.log('Failed to save or update address');
    }

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error saving address:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.end();
  }
};
