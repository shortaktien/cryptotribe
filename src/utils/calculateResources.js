export const calculateGainedResources = (productionRates, timeDifferenceInSeconds) => {
  const gainedResources = {};

  console.log('Production Rates:', productionRates);
  console.log('Time difference in seconds:', timeDifferenceInSeconds);

  // Überprüfen, ob die Produktionsraten korrekt initialisiert wurden
  if (!productionRates || typeof productionRates !== 'object') {
    console.error('Invalid production rates:', productionRates);
    return gainedResources;
  }

  // Überprüfen, ob die Zeitdifferenz korrekt ist
  if (typeof timeDifferenceInSeconds !== 'number' || timeDifferenceInSeconds <= 0) {
    console.error('Invalid time difference:', timeDifferenceInSeconds);
    return gainedResources;
  }

  for (const resource in productionRates) {
    if (productionRates.hasOwnProperty(resource)) {
      const productionRate = productionRates[resource];

      // Überprüfen, ob die Produktionsrate eine gültige Zahl ist
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
