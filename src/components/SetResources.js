import { useState, useEffect, useCallback } from 'react';

const useResources = () => {
  const [resources, setResources] = useState({
    water: 100,
    food: 100,
    wood: 100,
    stone: 0,
    knowledge: 100, // Wissenschaftsressourcen
    population: 10,  // Anfangspopulation
  });

  const [productionRates, setProductionRates] = useState({
    water: 0,
    food: 0,
    wood: 0,
    stone: 0,
    knowledge: 0, 
    population: 0,
  });

  const [capacityRates, setCapacityRates] = useState({
    water: 100,
    food: 100,
    wood: 100,
    stone: 50,
    knowledge: 100, // Wissenschaftskapazität
    population: 10
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
        const newResources = {
          water: Math.min(Math.max(prevResources.water + netProduction.water, 0), capacityRates.water),
          food: Math.min(Math.max(prevResources.food + netProduction.food, 0), capacityRates.food),
          wood: Math.min(prevResources.wood + netProduction.wood, capacityRates.wood),
          stone: Math.min(prevResources.stone + netProduction.stone, capacityRates.stone),
          knowledge: Math.min(prevResources.knowledge + netProduction.knowledge, capacityRates.knowledge),
          population: prevResources.population,
        };

        // Check if food or water is 0 and adjust population accordingly
        if (newResources.food === 0 || newResources.water === 0) {
          newResources.population = Math.max(newResources.population - 1, 0);
        } else {
          newResources.population = Math.min(newResources.population + netProduction.population, capacityRates.population);
        }

        return newResources;
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

  const refundResources = (refund) => {
    setResources(prevResources => {
      const updatedResources = { ...prevResources };
      for (const [resource, amount] of Object.entries(refund)) {
        updatedResources[resource] = Math.max(updatedResources[resource] + amount, 0); // Ensure resources do not go negative
      }
      return updatedResources;
    });
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

  return { resources, updateProductionRate, spendResources, updateCapacityRates, refundResources, updateResearchEffects };
};

export default useResources;
