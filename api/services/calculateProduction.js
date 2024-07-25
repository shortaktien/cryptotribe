const calculateCapacity = (baseCapacity, level, multiplier) => {
  if (!baseCapacity) return {}; // Check for undefined or null baseCapacity
  const capacity = {};
  Object.keys(baseCapacity).forEach(resource => {
    capacity[resource] = Math.ceil(baseCapacity[resource] * Math.pow(multiplier, level));
  });
  return capacity;
};

const calculateProduction = (buildings, baseProductions, multiplier) => {
  const production = {};

  Object.keys(buildings).forEach(buildingName => {
    const building = buildings[buildingName];
    const level = building.level || 0;
    const baseProduction = baseProductions[buildingName];
    
    if (baseProduction) {
      Object.keys(baseProduction).forEach(resource => {
        if (!production[resource]) {
          production[resource] = 0;
        }
        production[resource] += baseProduction[resource] * Math.pow(multiplier, level);
      });
    }
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

module.exports = {
  calculateCapacity,
  calculateProduction,
  calculateProductionWithinCapacity
};
