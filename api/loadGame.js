const { connectToDatabase } = require('../api/services/database');
const loadResources = require('../api/services/loadResources');
const loadBuildings = require('../api/services/loadBuildings');
const saveResources = require('../api/services/saveResources');
const saveBuildings = require('../api/services/saveBuildings');
const saveProductionRates = require('../api/services/saveProductionRates');
const { calculateProduction } = require('../api/services/calculateProduction');

const baseProductions = {
  lumberjack: { wood: 0.009166666666666667 },
  stonemason: { stone: 0.008055555555555555 },
  warehouse: null,
  house: { population: 0.001388888888888889 },
  farm: { food: 0.009722222222222222 },
  drawing_well: { water: 0.011111111111111112 },
  science: { knowledge: 0.002777777777777778 },
  kohlemine: { coal: 0.004166666666666667 },
  goldmine: { gold: 0.000002777777777777778 },
  barracks: { military: 0 },
  fortifications: null,
  harbor: null,
  merchant: null
};

module.exports = async (req, res) => {
  const { user_name } = req.query;

  if (!user_name) {
    return res.status(400).json({ error: 'User name is required' });
  }

  try {
    const client = await connectToDatabase();

    let resourcesResult;
    let buildingsResult;

    try {
      resourcesResult = await loadResources(client, user_name);
      buildingsResult = await loadBuildings(client, user_name);
    } catch (error) {
      if (error.message.includes('User not found')) {
        // Initial values for a new user
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
          updated_at: new Date().toISOString(),
        };

        buildingsResult = {
          buildings: {
            lumberjack: { level: 0 },
            stonemason: { level: 0 },
            warehouse: { level: 0 },
            house: { level: 0 },
            farm: { level: 0 },
            drawing_well: { level: 0 },
            science: { level: 0 },
            kohlemine: { level: 0 },
            goldmine: { level: 0 },
            barracks: { level: 0 },
            fortifications: { level: 0 },
            harbor: { level: 0 },
            merchant: { level: 0 }
          }
        };

        // Save default values to the database
        await saveResources(client, user_name, resourcesResult.resources, 0);
        await saveBuildings(client, user_name, buildingsResult.buildings);
      } else {
        throw error;
      }
    }

    // Calculate production rates
    const productionRates = calculateProduction(buildingsResult.buildings, baseProductions, 1.8);
    console.log('Calculated production rates:', productionRates);

    await saveProductionRates(client, user_name, productionRates);

    res.status(200).json({
      resources: resourcesResult.resources,
      buildings: buildingsResult.buildings,
      productionRates,
      updated_at: resourcesResult.updated_at,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};
