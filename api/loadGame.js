const { Client } = require('pg');

module.exports = async (req, res) => {
  const { user_name } = req.query;

  if (!user_name) {
    console.log('User name is required');
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

    const resourcesQuery = 'SELECT resources, updated_at FROM player_progress WHERE user_name = $1';
    const resourcesValues = [user_name];
    const resourcesResult = await client.query(resourcesQuery, resourcesValues);

    if (resourcesResult.rows.length === 0) {
      console.log('User not found in player_progress');
      return res.status(404).json({ error: 'User not found in player_progress' });
    }
    console.log('Resources query result:', resourcesResult.rows[0]);

    const buildingsQuery = 'SELECT buildings FROM building_progress WHERE user_name = $1';
    const buildingsValues = [user_name];
    const buildingsResult = await client.query(buildingsQuery, buildingsValues);

    if (buildingsResult.rows.length === 0) {
      console.log('User not found in building_progress');
      return res.status(404).json({ error: 'User not found in building_progress' });
    }
    console.log('Buildings query result:', buildingsResult.rows[0]);

    const { resources, updated_at } = resourcesResult.rows[0];
    const buildings = buildingsResult.rows[0].buildings;

    const currentTime = new Date();
    const lastUpdateTime = new Date(updated_at);
    const timeDifferenceInSeconds = (currentTime - lastUpdateTime) / 1000;

    // Ausgabe der Zeitdifferenz in der Konsole
    console.log(`User ${user_name} was away for ${timeDifferenceInSeconds} seconds.`);

    // Berechne die neuen Ressourcen basierend auf der verstrichenen Zeit und der Produktionsrate der Gebäude
    const updatedResources = { ...resources };
    const gainedResources = {};

    // Produktionsraten basierend auf den Gebäuden berechnen
    buildings.forEach(building => {
      if (building.currentLevel > 0) {
        const productionRate = building.levels[building.currentLevel].production;
        if (productionRate) {
          Object.keys(productionRate).forEach(resource => {
            const gained = productionRate[resource] * timeDifferenceInSeconds;
            updatedResources[resource] = (updatedResources[resource] || 0) + gained;
            gainedResources[resource] = (gainedResources[resource] || 0) + gained;
          });
        }
      }
    });

    // Ausgabe der gewonnenen Ressourcen in der Konsole
    console.log(`Resources gained by user ${user_name} during absence:`, gainedResources);

    res.status(200).json({ resources: updatedResources, buildings });
  } catch (error) {
    console.error('Error loading game progress:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.end();
  }
};
