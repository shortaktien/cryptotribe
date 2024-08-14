export const calculateGainedResources = (productionRates, timeDifferenceInSeconds) => {
  const gainedResources = {};

  console.log('Production Rates:', productionRates);
  console.log('Time difference in seconds:', timeDifferenceInSeconds);

  for (const resource in productionRates) {
      gainedResources[resource] = productionRates[resource] * timeDifferenceInSeconds;
  }

  console.log('Gained Resources:', gainedResources);
  return gainedResources;
};
