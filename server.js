const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');

const app = express();
const port = 3000;

// PostgreSQL-Datenbankverbindung
const client = new Client({
    user: 'default',
    host: 'ep-patient-hat-a4x7f3cu-pooler.us-east-1.aws.neon.tech',
    database: 'verceldb',
    password: 'DLRHQ0AXr9nU',
    port: 5432,
});

client.connect()
    .then(() => console.log('Connected to PostgreSQL database'))
    .catch(err => console.error('Connection error', err.stack));

app.use(bodyParser.json());

// Route zum Speichern von Daten
app.post('/api/saveData', async (req, res) => {
    const { address, name, balance, resources } = req.body;
    try {
        const playerResult = await client.query(
            'INSERT INTO players (address, name, balance) VALUES ($1, $2, $3) RETURNING id',
            [address, name, balance]
        );
        const playerId = playerResult.rows[0].id;

        for (let resource of resources) {
            await client.query(
                'INSERT INTO resources (player_id, resource_name, resource_value, resource_capacity) VALUES ($1, $2, $3, $4)',
                [playerId, resource.name, resource.value, resource.capacity]
            );
        }

        res.status(200).send('Data saved successfully');
    } catch (err) {
        console.error('Error saving data', err);
        res.status(500).send('Error saving data');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
