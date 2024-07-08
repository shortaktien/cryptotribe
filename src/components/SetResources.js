import { useState, useEffect, useCallback } from 'react';

const useResources = () => {
  const [resources, setResources] = useState({
    water: 250,
    food: 250,
    wood: 300,
    stone: 100,
    knowledge: 0,
    population: 15,
    coal: 0,
    gold: 0,
    military: 0,
  });

  const [productionRates, setProductionRates] = useState({
    water: 40 / 3600,
    food: 35 / 3600,
    wood: 33 / 3600,
    stone: 29 / 3600,
    knowledge: 1 / 3600,
    population: 1 / 3600,
    coal: 15 / 3600,
    gold: 0.01 / 3600
  });

  const [capacityRates, setCapacityRates] = useState({
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
  });

  const [resourceChanges, setResourceChanges] = useState({
    water: 0,
    food: 0,
    wood: 0,
    stone: 0,
    knowledge: 0,
    population: 0,
    coal: 0,
    gold: 0,
    military: 0
  });

  const [researchEffects, setResearchEffects] = useState({
    food: 0,
  });

  const updateResearchEffects = (newEffects) => {
    setResearchEffects(prevEffects => ({
      ...prevEffects,
      ...newEffects,
    }));
  };

  const calculateNetProduction = useCallback((baseProduction) => {
    const netProduction = { ...baseProduction };

    Object.entries(researchEffects).forEach(([resource, multiplier]) => {
      if (netProduction[resource] !== undefined) {
        netProduction[resource] += netProduction[resource] * multiplier;
      }
    });

    const population = resources.population;
    netProduction.food -= (population * 0.2) / 3600;
    netProduction.water -= (population * 0.1) / 3600;

    return netProduction;
  }, [researchEffects, resources.population]);

  useEffect(() => {
    const interval = setInterval(() => {
      const netProduction = calculateNetProduction(productionRates);
      setResources(prevResources => {
        const newResources = {
          water: Math.min(Math.max(prevResources.water + netProduction.water, 0), capacityRates.water),
          food: Math.min(Math.max(prevResources.food + netProduction.food, 0), capacityRates.food),
          wood: Math.min(prevResources.wood + netProduction.wood, capacityRates.wood),
          stone: Math.min(prevResources.stone + netProduction.stone, capacityRates.stone),
          knowledge: Math.min(prevResources.knowledge + netProduction.knowledge, capacityRates.knowledge),
          population: Math.min(prevResources.population + netProduction.population, capacityRates.population),
          coal: Math.min(prevResources.coal + netProduction.coal, capacityRates.coal),
          gold: Math.min(prevResources.gold + netProduction.gold, capacityRates.gold),
          military: Math.min(prevResources.military, capacityRates.military)
        };

        const changes = {};
        Object.keys(newResources).forEach(resource => {
          changes[resource] = newResources[resource] - prevResources[resource];
        });

        setResourceChanges(changes);

        return newResources;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [productionRates, capacityRates, researchEffects, resources.population, calculateNetProduction]);

  const updateProductionRate = (resource, rate) => {
    setProductionRates(prevRates => ({
      ...prevRates,
      [resource]: rate
    }));
  };

  const updateCapacityRates = (resource, amount) => {
    setCapacityRates(prevCapacityRates => ({
      ...prevCapacityRates,
      [resource]: amount
    }));

    if (resource === 'military') {
      setResources(prevResources => ({
        ...prevResources,
        military: Math.min(prevResources.military + amount, capacityRates.maxMilitaryCapacity)
      }));
    }
  };

  const updatePopulation = (population) => {
    setResources(prevResources => ({
      ...prevResources,
      population: prevResources.population + population
    }));
  };

  const spendResources = (cost) => {
    const updatedResources = { ...resources };
    for (const [resource, amount] of Object.entries(cost)) {
      if (updatedResources[resource] < amount) {
        return false;
      }
      updatedResources[resource] -= amount;
    }
    setResources(updatedResources);
    return true;
  };

  const refundResources = (refund) => {
    setResources(prevResources => {
      const newResources = { ...prevResources };
      for (const [resource, amount] of Object.entries(refund)) {
        newResources[resource] += amount;
      }
      return newResources;
    });
  };

  const getNetProductionRates = () => calculateNetProduction(productionRates);
  const getProductionRates = () => productionRates; // Brutto-Produktionsraten

  const setLoadedProductionRates = (loadedProductionRates) => {
    setProductionRates(loadedProductionRates);
  };

  return { 
    resources, 
    setResources,
    resourceChanges,
    updateProductionRate, 
    spendResources, 
    updateCapacityRates, 
    updatePopulation, 
    updateResearchEffects, 
    capacityRates,
    setCapacityRates, 
    refundResources, 
    getNetProductionRates,
    getProductionRates, // Brutto-Produktionsraten zurückgeben
    setLoadedProductionRates // Hinzugefügte Methode
  };
};

export default useResources;


