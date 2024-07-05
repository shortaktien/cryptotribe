const { Client } = require('pg');

const calculateCapacity = (baseCapacity, level, multiplier) => {
  const capacity = {};
  Object.keys(baseCapacity).forEach(resource => {
    capacity[resource] = Math.ceil(baseCapacity[resource] * Math.pow(multiplier, level));
  });
  return capacity;
};

const calculateProductionWithinCapacity = (currentResources, gainedResources, capacities) => {
  const updatedResources = { ...currentResources };
  const finalGainedResources = { ...gainedResources };

  Object.keys(gainedResources).forEach(resource => {
    if (updatedResources[resource] + gainedResources[resource] > capacities[resource]) {
      finalGainedResources[resource] = capacities[resource] - updatedResources[resource];
      updatedResources[resource] = capacities[resource];
    } else {
      updatedResources[resource] += gainedResources[resource];
    }
  });

  return { updatedResources, finalGainedResources };
};

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

    const resourcesQuery = 'SELECT resources, updated_at, economic_points FROM player_progress WHERE user_name = $1';
    const resourcesValues = [user_name];
    const resourcesResult = await client.query(resourcesQuery, resourcesValues);

    if (resourcesResult.rows.length === 0) {
      console.log('User not found in player_progress');
      return res.status(404).json({ error: 'User not found in player_progress' });
    }
    console.log('Resources query result:', resourcesResult.rows[0]);

    const buildingsQuery = 'SELECT buildings, capacities FROM building_progress WHERE user_name = $1';
    const buildingsValues = [user_name];
    const buildingsResult = await client.query(buildingsQuery, buildingsValues);

    if (buildingsResult.rows.length === 0) {
      console.log('User not found in building_progress');
      return res.status(404).json({ error: 'User not found in building_progress' });
    }
    console.log('Buildings and capacities query result:', buildingsResult.rows[0]);

    const { resources, updated_at, economic_points } = resourcesResult.rows[0];
    let { buildings, capacities } = buildingsResult.rows[0];

    // Berechnung der Kapazitäten basierend auf dem Level
    buildings = buildings.map(building => {
      if (building.name === 'Warehouse') {
        building.capacity = calculateCapacity(building.baseCapacity, building.currentLevel, 1.4);
        console.log(`Calculated capacity for Warehouse level ${building.currentLevel}:`, building.capacity);
      }
      return building;
    });

    // Kapazitäten aktualisieren
    capacities = buildings.reduce((acc, building) => {
      if (building.name === 'Warehouse') {
        acc = { ...acc, ...building.capacity };
      }
      return acc;
    }, capacities);

    const currentTime = new Date();
    const lastUpdateTime = new Date(updated_at);
    const timeDifferenceInSeconds = (currentTime - lastUpdateTime) / 1000;

    // Ausgabe der Zeitdifferenz in der Konsole
    console.log(`User ${user_name} was away for ${timeDifferenceInSeconds} seconds.`);

    // Berechne die neuen Ressourcen basierend auf der verstrichenen Zeit und der Produktionsrate der Gebäude
    const gainedResources = {};
    buildings.forEach(building => {
      if (building.currentLevel > 0) {
        const productionRate = building.levels[building.currentLevel].production;
        if (productionRate) {
          Object.keys(productionRate).forEach(resource => {
            const gained = productionRate[resource] * timeDifferenceInSeconds;
            gainedResources[resource] = (gainedResources[resource] || 0) + gained;
          });
        }
      }
    });

    // Ausgabe der gewonnenen Ressourcen in der Konsole
    console.log(`Resources gained by user ${user_name} during absence:`, gainedResources);

    // Begrenzung der Produktionsmenge auf die Kapazitätsgrenzen
    const { updatedResources, finalGainedResources } = calculateProductionWithinCapacity(resources, gainedResources, capacities);

    res.status(200).json({ resources: updatedResources, buildings, capacities, timeDifferenceInSeconds, gainedResources: finalGainedResources, economic_points });
  } catch (error) {
    console.error('Error loading game progress:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.end();
  }
};
