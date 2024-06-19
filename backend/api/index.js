require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db').default; // Importiere die Kysely-Datenbankinstanz

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/register', async (req, res) => {
  const { address } = req.body;
  console.log('Registering player with address:', address);
  try {
    const existingPlayer = await db
      .selectFrom('players')
      .select('id')
      .where('address', '=', address)
      .executeTakeFirst();

    if (existingPlayer) {
      console.log('Player already exists with ID:', existingPlayer.id);
      res.status(200).json({ playerId: existingPlayer.id });
    } else {
      const [newPlayer] = await db
        .insertInto('players')
        .values({ address })
        .returning('id')
        .execute();

      console.log('Player registered with ID:', newPlayer.id);
      res.status(201).json({ playerId: newPlayer.id });
    }
  } catch (error) {
    console.error('Error registering player:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/state/:address', async (req, res) => {
  const { address } = req.params;
  try {
    const player = await db
      .selectFrom('players')
      .select('id')
      .where('address', '=', address)
      .executeTakeFirst();

    if (!player) {
      console.log('Player not found for address:', address);
      return res.status(404).json({ error: 'Player not found' });
    }

    const buildings = await db
      .selectFrom('buildings')
      .selectAll()
      .where('player_id', '=', player.id)
      .execute();

    const units = await db
      .selectFrom('units')
      .selectAll()
      .where('player_id', '=', player.id)
      .execute();

    res.status(200).json({
      buildings,
      units
    });
  } catch (error) {
    console.error('Error fetching game state:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
