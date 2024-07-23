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
  
  module.exports = {
    calculateCapacity,
    calculateProduction,
    calculateProductionWithinCapacity,
  };
  