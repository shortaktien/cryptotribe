import { useState, useEffect, useCallback } from 'react';

const useResources = () => {
  const [resources, setResources] = useState({
    water: 100,
    food: 100,
    wood: 100,
    stone: 0,
    knowledge: 50, // Wissenschaftsressourcen
    population: 10,  // Anfangspopulation
  });

  const [productionRates, setProductionRates] = useState({
    water: 0,
    food: 0,
    wood: 0,
    stone: 0,
    knowledge: 0, // Wissenschaftsproduktion
  });

  const [capacityRates, setCapacityRates] = useState({
    water: 100,
    food: 100,
    wood: 100,
    stone: 50,
    knowledge: 100, // Wissenschaftskapazität
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

    // Apply research effects
    Object.entries(researchEffects).forEach(([resource, multiplier]) => {
      if (netProduction[resource] !== undefined) {
        netProduction[resource] += netProduction[resource] * multiplier;
      }
    });

    // Subtract population consumption
    const population = resources.population;
    netProduction.food -= population * 0.2; // Population consumption of food
    netProduction.water -= population * 0.1; // Population consumption of water

    return netProduction;
  }, [researchEffects, resources.population]);

  useEffect(() => {
    const interval = setInterval(() => {
      const netProduction = calculateNetProduction(productionRates);
      setResources(prevResources => {
        return {
          water: Math.min(Math.max(prevResources.water + netProduction.water, 0), capacityRates.water),
          food: Math.min(Math.max(prevResources.food + netProduction.food, 0), capacityRates.food),
          wood: Math.min(prevResources.wood + netProduction.wood, capacityRates.wood),
          stone: Math.min(prevResources.stone + netProduction.stone, capacityRates.stone),
          knowledge: Math.min(prevResources.knowledge + netProduction.knowledge, capacityRates.knowledge),
          population: prevResources.population,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [productionRates, capacityRates, researchEffects, resources.population, calculateNetProduction]);

  useEffect(() => {
    const netProduction = calculateNetProduction(productionRates);
    console.log("Current Net Production Rates:", netProduction);
  }, [productionRates, researchEffects, resources.population, calculateNetProduction]);

  const updateProductionRate = (resource, rate) => {
    setProductionRates(prevRates => ({
      ...prevRates,
      [resource]: rate
    }));
  };

  const updateCapacityRates = (resource, capacity) => {
    setCapacityRates(prevCapacity => ({
      ...prevCapacity,
      [resource]: capacity
    }));
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
        return false;  // Nicht genug Ressourcen
      }
      updatedResources[resource] -= amount;
    }
    setResources(updatedResources);
    return true;
  };

  return { resources, updateProductionRate, spendResources, updateCapacityRates, updatePopulation, updateResearchEffects };
};

export default useResources;
