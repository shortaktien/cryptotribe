const { Client } = require('pg');

const calculateCapacity = (baseCapacity, level, multiplier) => {
  const capacity = { ...baseCapacity };
  Object.keys(baseCapacity).forEach(resource => {
    capacity[resource] = Math.ceil(baseCapacity[resource] * Math.pow(multiplier, level));
  });
  return capacity;
};

const calculateProduction = (baseProduction, level, multiplier) => {
  const production = { ...baseProduction };
  Object.keys(baseProduction).forEach(resource => {
    production[resource] = baseProduction[resource] * Math.pow(multiplier, level);
  });
  return production;
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

    const resourcesQuery = 'SELECT resources, updated_at, economic_points, military FROM player_progress WHERE user_name = $1';
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

    const { resources, updated_at, economic_points, military } = resourcesResult.rows[0];
    let { buildings, capacities } = buildingsResult.rows[0];

    // Berechnung der Kapazitäten und Produktionsraten basierend auf dem Level
    buildings = buildings.map(building => {
      if (building.name === 'Warehouse' || building.name === 'House') {
        building.capacity = calculateCapacity(building.baseCapacity, building.currentLevel, 1.4);
        console.log(`Calculated capacity for ${building.name} level ${building.currentLevel}:`, building.capacity);
      } else if (['Lumberjack', 'Stonemason', 'Farm', 'Drawing well', 'Kohlemine', 'Goldmine', 'House', 'Science'].includes(building.name)) {
        building.production = calculateProduction(building.baseProduction, building.currentLevel, 1.8);
        console.log(`Calculated production for ${building.name} level ${building.currentLevel}:`, building.production);
      } else if (building.name === 'Barracks') {
        building.capacity = calculateCapacity(building.baseCapacity, building.currentLevel, 1.4);
        console.log(`Calculated capacity for Barracks level ${building.currentLevel}:`, building.capacity);
        capacities['maxMilitaryCapacity'] = building.capacity.military; // Korrigierte Zuweisung
      }
      return building;
    });

    // Kapazitäten aktualisieren
    capacities = buildings.reduce((acc, building) => {
      if (building.capacity) {
        acc = { ...acc, ...building.capacity };
      }
      return acc;
    }, capacities);

    const currentTime = new Date();
    const lastUpdateTime = new Date(updated_at);
    const timeDifferenceInSeconds = Math.floor((currentTime - lastUpdateTime) / 1000); // Ensure integer seconds

    // Ausgabe der Zeitdifferenz in der Konsole
    console.log(`User ${user_name} was away for ${timeDifferenceInSeconds} seconds.`);

    // Berechne die neuen Ressourcen basierend auf der verstrichenen Zeit und der Produktionsrate der Gebäude
    const gainedResources = {};
    buildings.forEach(building => {
      if (building.currentLevel > 0) {
        const productionRate = building.production; // Verwendet die berechnete Produktionsrate
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

    // Konsolenausgabe der geladenen militärischen Einheiten
    console.log(`Loaded military units for user ${user_name}:`, military);

    res.status(200).json({ resources: updatedResources, buildings, capacities, timeDifferenceInSeconds, gainedResources: finalGainedResources, economic_points, military });
  } catch (error) {
    console.error('Error loading game progress:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.end();
  }
};
