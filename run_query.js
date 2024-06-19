const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgres://default:vMYH8VtPze9O@ep-polished-credit-a43jgb6u.us-east-1.aws.neon.tech/verceldb?sslmode=require',
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect()
  .then(() => {
    console.log('Connected to database');
    return client.query('INSERT INTO players (address) VALUES ($1) RETURNING id', ['0x123456789abcdef']);
  })
  .then(result => {
    console.log('Player inserted with ID:', result.rows[0].id);
    return client.end();
  })
  .catch(err => {
    console.error('Error executing query', err.stack);
    client.end();
  });
