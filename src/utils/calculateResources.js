// calculateResources.js
export const calculateGainedResources = (productionRates, timeDifferenceInSeconds) => {
    const gainedResources = {};
  
    for (const resource in productionRates) {
      gainedResources[resource] = productionRates[resource] * (timeDifferenceInSeconds / 3600); // assuming productionRates is per hour
    }
  
    return gainedResources;
  };
  