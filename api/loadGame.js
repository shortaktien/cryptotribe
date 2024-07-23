const { loadResources } = require('./services/loadResources');
const { loadBuildings } = require('./services/loadBuildings');
const { calculateCapacity, calculateProduction, calculateProductionWithinCapacity } = require('./services/calculateProduction');

module.exports = async (req, res) => {
  const { user_name } = req.query;

  if (!user_name) {
    console.log('User name is required');
    return res.status(400).json({ error: 'User name is required' });
  }

  try {
    const resourcesData = await loadResources(user_name);
    const buildingsData = await loadBuildings(user_name);

    const { resources, updated_at, economic_points, military } = resourcesData;
    let { buildings, capacities } = buildingsData;

    console.log('Raw buildings data:', buildings);
    console.log('Raw capacities data:', capacities);

    try {
      buildings = JSON.parse(buildings);
    } catch (error) {
      console.error('Error parsing buildings:', error);
    }

    try {
      capacities = JSON.parse(capacities);
    } catch (error) {
      console.error('Error parsing capacities:', error);
    }

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
        capacities['maxMilitaryCapacity'] = building.capacity.military;
      }

      if (building.isBuilding) {
        const buildStartTime = new Date(building.buildStartTime);
        const currentTime = new Date();
        const timeElapsed = Math.floor((currentTime - buildStartTime) / 1000);
        const newBuildTimeRemaining = building.buildTimeRemaining - timeElapsed;
        building.buildTimeRemaining = newBuildTimeRemaining > 0 ? newBuildTimeRemaining : 0;
        building.isBuilding = newBuildTimeRemaining > 0;

        if (!building.isBuilding) {
          building.currentLevel += 1;
        }
      }

      return building;
    });

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

    console.log(`Loaded military units for user ${user_name}:`, military);

    res.status(200).json({ resources: updatedResources, buildings, capacities, timeDifferenceInSeconds, gainedResources: finalGainedResources, economic_points, military });
  } catch (error) {
    console.error('Error loading game progress:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
