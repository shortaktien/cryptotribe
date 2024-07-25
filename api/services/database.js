const { Client } = require('pg');

const connectToDatabase = async () => {
  const client = new Client({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  await client.connect();
  return client;
};

module.exports = { connectToDatabase };
