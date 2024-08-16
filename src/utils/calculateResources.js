export const calculateGainedResources = (productionRates, timeDifferenceInSeconds) => {
  const gainedResources = {};

  console.log('Production Rates:', productionRates);
  console.log('Time difference in seconds:', timeDifferenceInSeconds);

  if (!productionRates || typeof productionRates !== 'object') {
    console.error('Invalid production rates:', productionRates);
    return gainedResources;
  }

  if (typeof timeDifferenceInSeconds !== 'number' || timeDifferenceInSeconds <= 0) {
    console.error('Invalid time difference:', timeDifferenceInSeconds);
    return gainedResources;
  }

  for (const resource in productionRates) {
    if (productionRates.hasOwnProperty(resource)) {
      const productionRate = productionRates[resource];

      if (typeof productionRate === 'number' && productionRate >= 0) {
        gainedResources[resource] = productionRate * timeDifferenceInSeconds;
      } else {
        console.warn(`Invalid production rate for ${resource}:`, productionRate);
        gainedResources[resource] = 0;  // Fallback, falls die Produktionsrate ungültig ist
      }
    }
  }

  console.log('Gained Resources:', gainedResources);
  return gainedResources;
};
