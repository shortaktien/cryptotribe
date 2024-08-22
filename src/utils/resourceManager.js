export const calculateNetProduction = (baseProduction, researchEffects = {}, population) => {
    const netProduction = { ...baseProduction };

    Object.entries(researchEffects).forEach(([resource, multiplier]) => {
        if (netProduction[resource] !== undefined) {
            netProduction[resource] += netProduction[resource] * multiplier;
        }
    });

    netProduction.food -= (population * 0.2) / 3600;
    netProduction.water -= (population * 0.1) / 3600;

    return netProduction;
};

export const updateResources = (currentResources, productionRates, capacityRates) => {
    const newResources = { ...currentResources };

    Object.keys(newResources).forEach(resource => {
        if (productionRates[resource] !== undefined) {
            const potentialNewValue = newResources[resource] + productionRates[resource];
            if (potentialNewValue <= capacityRates[resource]) {
                newResources[resource] = potentialNewValue;
            } else {
                newResources[resource] = capacityRates[resource]; // Setzt auf die Kapazität, wenn das Limit erreicht ist
            }
        }
    });

    return newResources;  // Rückgabe der aktualisierten Ressourcen
};

export const initializeResources = (loadedResources, defaultResources) => {
    return { ...defaultResources, ...loadedResources };
};

export const initializeProductionRates = (loadedProductionRates, defaultProductionRates) => {
    return { ...defaultProductionRates, ...loadedProductionRates };
};

export const updateResearchEffects = (currentEffects, newEffects) => {
    return { ...currentEffects, ...newEffects };
};

export const startResourceProduction = (setResources, productionRates, capacityRates, researchEffects, population) => {
    const interval = setInterval(() => {
        setResources(prevResources => {
            const netProduction = calculateNetProduction(productionRates, researchEffects, population);

            const newResources = { ...prevResources };

            Object.keys(newResources).forEach(resource => {
                if (netProduction[resource] !== undefined) {
                    const newAmount = newResources[resource] + netProduction[resource];
                    // Überprüfen, ob die neue Menge die Kapazität überschreitet
                    if (newAmount <= capacityRates[resource]) {
                        newResources[resource] = newAmount;
                    } else {
                        newResources[resource] = capacityRates[resource]; // Auf max. Kapazität setzen
                    }
                }
            });

            return newResources;
        });
    }, 1000); // Jede Sekunde

    return interval; // Um später das Intervall zu löschen, falls nötig
};

// Hinzufügen von calculateGainedResources
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
