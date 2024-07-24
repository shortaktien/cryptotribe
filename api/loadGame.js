const { connectToDatabase } = require('../api/services/database');
const loadResources = require('../api/services/loadResources');
const loadBuildings = require('../api/services/loadBuildings');
const loadMilitary = require('../api/services/loadMilitary');
const { calculateCapacity, calculateProduction, calculateProductionWithinCapacity } = require('../api/services/calculateProduction');
const saveResources = require('../api/services/saveResources');
const saveBuildings = require('../api/services/saveBuildings');
const saveCapacities = require('../api/services/saveCapacities'); // assuming this service exists
const saveProductionRates = require('../api/services/saveProductionRates'); // assuming this service exists
const saveMilitary = require('../api/services/saveMilitary');

module.exports = async (req, res) => {
  const { user_name } = req.query;

  if (!user_name) {
    console.log('User name is required');
    return res.status(400).json({ error: 'User name is required' });
  }

  const client = await connectToDatabase();

  let resourcesResult;
  let buildingsResult;
  let militaryResult;

  try {
    console.log('Database connection successful');

    // Laden der Ressourcen, Gebäude und Militärdaten
    try {
      resourcesResult = await loadResources(client, user_name);
      console.log('Resources query result:', resourcesResult);

      buildingsResult = await loadBuildings(client, user_name);
      console.log('Buildings query result:', buildingsResult);

      militaryResult = await loadMilitary(client, user_name);
      console.log('Loaded military units:', militaryResult);
    } catch (error) {
      if (error.message.includes('User not found')) {
        console.log('New user detected, initializing with default values');

        // Standardwerte für neue Benutzer
        resourcesResult = {
          resources: {
            water: 250,
            food: 250,
            wood: 300,
            stone: 100,
            knowledge: 0,
            population: 15,
            coal: 0,
            gold: 0,
            military: 0,
          },
          updated_at: new Date().toISOString()
        };

        await saveResources(client, user_name, resourcesResult.resources, 0);

        buildingsResult = {
          lumberjack_level: 0, lumberjack_is_building: false, lumberjack_build_start_time: null, lumberjack_build_time_remaining: null,
          stonemason_level: 0, stonemason_is_building: false, stonemason_build_start_time: null, stonemason_build_time_remaining: null,
          warehouse_level: 0, warehouse_is_building: false, warehouse_build_start_time: null, warehouse_build_time_remaining: null,
          house_level: 0, house_is_building: false, house_build_start_time: null, house_build_time_remaining: null,
          farm_level: 0, farm_is_building: false, farm_build_start_time: null, farm_build_time_remaining: null,
          drawing_well_level: 0, drawing_well_is_building: false, drawing_well_build_start_time: null, drawing_well_build_time_remaining: null,
          science_level: 0, science_is_building: false, science_build_start_time: null, science_build_time_remaining: null,
          kohlemine_level: 0, kohlemine_is_building: false, kohlemine_build_start_time: null, kohlemine_build_time_remaining: null,
          goldmine_level: 0, goldmine_is_building: false, goldmine_build_start_time: null, goldmine_build_time_remaining: null,
          barracks_level: 0, barracks_is_building: false, barracks_build_start_time: null, barracks_build_time_remaining: null,
          fortifications_level: 0, fortifications_is_building: false, fortifications_build_start_time: null, fortifications_build_time_remaining: null,
          harbor_level: 0, harbor_is_building: false, harbor_build_start_time: null, harbor_build_time_remaining: null,
          merchant_level: 0, merchant_is_building: false, merchant_build_start_time: null, merchant_build_time_remaining: null,
        };

        await saveBuildings(client, user_name, buildingsResult);

        militaryResult = [];

        await saveMilitary(client, user_name, militaryResult);
      } else {
        throw error;
      }
    }

    const capacities = {
      water: 500,
      food: 500,
      wood: 500,
      stone: 500,
      knowledge: 100,
      population: 15,
      coal: 500,
      gold: 500,
      military: 0,
      maxMilitaryCapacity: 0
    };

    const productionRates = {
      water: 40 / 3600,
      food: 35 / 3600,
      wood: 33 / 3600,
      stone: 29 / 3600,
      knowledge: 1 / 3600,
      population: 1 / 3600,
      coal: 15 / 3600,
      gold: 0.01 / 3600
    };

    await saveCapacities(client, user_name, capacities);
    await saveProductionRates(client, user_name, productionRates);

    const { resources, updated_at } = resourcesResult;
    const {
      lumberjack_level, lumberjack_is_building, lumberjack_build_start_time, lumberjack_build_time_remaining,
      stonemason_level, stonemason_is_building, stonemason_build_start_time, stonemason_build_time_remaining,
      warehouse_level, warehouse_is_building, warehouse_build_start_time, warehouse_build_time_remaining,
      house_level, house_is_building, house_build_start_time, house_build_time_remaining,
      farm_level, farm_is_building, farm_build_start_time, farm_build_time_remaining,
      drawing_well_level, drawing_well_is_building, drawing_well_build_start_time, drawing_well_build_time_remaining,
      science_level, science_is_building, science_build_start_time, science_build_time_remaining,
      kohlemine_level, kohlemine_is_building, kohlemine_build_start_time, kohlemine_build_time_remaining,
      goldmine_level, goldmine_is_building, goldmine_build_start_time, goldmine_build_time_remaining,
      barracks_level, barracks_is_building, barracks_build_start_time, barracks_build_time_remaining,
      fortifications_level, fortifications_is_building, fortifications_build_start_time, fortifications_build_time_remaining,
      harbor_level, harbor_is_building, harbor_build_start_time, harbor_build_time_remaining,
      merchant_level, merchant_is_building, merchant_build_start_time, merchant_build_time_remaining
    } = buildingsResult;

    const buildings = [
      {
        name: 'Lumberjack',
        currentLevel: lumberjack_level,
        isBuilding: lumberjack_is_building,
        buildStartTime: lumberjack_build_start_time,
        buildTimeRemaining: lumberjack_build_time_remaining
      },
      {
        name: 'Stonemason',
        currentLevel: stonemason_level,
        isBuilding: stonemason_is_building,
        buildStartTime: stonemason_build_start_time,
        buildTimeRemaining: stonemason_build_time_remaining
      },
      {
        name: 'Warehouse',
        currentLevel: warehouse_level,
        isBuilding: warehouse_is_building,
        buildStartTime: warehouse_build_start_time,
        buildTimeRemaining: warehouse_build_time_remaining
      },
      {
        name: 'House',
        currentLevel: house_level,
        isBuilding: house_is_building,
        buildStartTime: house_build_start_time,
        buildTimeRemaining: house_build_time_remaining
      },
      {
        name: 'Farm',
        currentLevel: farm_level,
        isBuilding: farm_is_building,
        buildStartTime: farm_build_start_time,
        buildTimeRemaining: farm_build_time_remaining
      },
      {
        name: 'Drawing well',
        currentLevel: drawing_well_level,
        isBuilding: drawing_well_is_building,
        buildStartTime: drawing_well_build_start_time,
        buildTimeRemaining: drawing_well_build_time_remaining
      },
      {
        name: 'Science',
        currentLevel: science_level,
        isBuilding: science_is_building,
        buildStartTime: science_build_start_time,
        buildTimeRemaining: science_build_time_remaining
      },
      {
        name: 'Kohlemine',
        currentLevel: kohlemine_level,
        isBuilding: kohlemine_is_building,
        buildStartTime: kohlemine_build_start_time,
        buildTimeRemaining: kohlemine_build_time_remaining
      },
      {
        name: 'Goldmine',
        currentLevel: goldmine_level,
        isBuilding: goldmine_is_building,
        buildStartTime: goldmine_build_start_time,
        buildTimeRemaining: goldmine_build_time_remaining
      },
      {
        name: 'Barracks',
        currentLevel: barracks_level,
        isBuilding: barracks_is_building,
        buildStartTime: barracks_build_start_time,
        buildTimeRemaining: barracks_build_time_remaining
      },
      {
        name: 'Fortifications',
        currentLevel: fortifications_level,
        isBuilding: fortifications_is_building,
        buildStartTime: fortifications_build_start_time,
        buildTimeRemaining: fortifications_build_time_remaining
      },
      {
        name: 'Harbor',
        currentLevel: harbor_level,
        isBuilding: harbor_is_building,
        buildStartTime: harbor_build_start_time,
        buildTimeRemaining: harbor_build_time_remaining
      },
      {
        name: 'Merchant',
        currentLevel: merchant_level,
        isBuilding: merchant_is_building,
        buildStartTime: merchant_build_start_time,
        buildTimeRemaining: merchant_build_time_remaining
      }
    ];

    console.log('Buildings loaded and calculated:', buildings);

    // Berechnung und Protokollierung der Ressourcen
    const currentTime = new Date();
    const lastUpdateTime = new Date(updated_at);
    const timeDifferenceInSeconds = Math.floor((currentTime - lastUpdateTime) / 1000);

    console.log(`User ${user_name} was away for ${timeDifferenceInSeconds} seconds.`);

    const gainedResources = {};
    buildings.forEach(building => {
      if (building.currentLevel > 0) {
        const productionRate = building.production;
        if (productionRate) {
          Object.keys(productionRate).forEach(resource => {
            const gained = productionRate[resource] * timeDifferenceInSeconds;
            gainedResources[resource] = (gainedResources[resource] || 0) + gained;
          });
        }
      }
    });

    console.log(`Resources gained by user ${user_name} during absence:`, gainedResources);

    const { updatedResources, finalGainedResources } = calculateProductionWithinCapacity(resources, gainedResources, capacities);

    console.log('Final resources after production:', updatedResources);

    res.status(200).json({ resources: updatedResources, buildings, capacities, timeDifferenceInSeconds, gainedResources: finalGainedResources, economic_points: 0, military: militaryResult });
  } catch (error) {
    console.error('Error loading game progress:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.end();
  }
};
