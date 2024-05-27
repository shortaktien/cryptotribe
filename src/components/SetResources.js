import { useState, useEffect } from 'react';

const useResources = () => {
  const [resources, setResources] = useState({
    water: 100,
    food: 100,
    wood: 100,
    stone: 0,
    population: 10,  // Anfangspopulation
  });

  const [productionRates, setProductionRates] = useState({
    water: 0,
    food: 0,
    wood: 0,
    stone: 0,
  });

  const [capacityRates, setCapacityRates] = useState({
    water: 100,
    food: 100,
    wood: 100,
    stone: 50,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setResources(prevResources => {
        const waterConsumption = prevResources.population * 0.2;
        const foodConsumption = prevResources.population * 0.1;
        return {
          water: Math.min(Math.max(prevResources.water + productionRates.water - waterConsumption, 0), capacityRates.water),
          food: Math.min(Math.max(prevResources.food + productionRates.food - foodConsumption, 0), capacityRates.food),
          wood: Math.min(prevResources.wood + productionRates.wood, capacityRates.wood),
          stone: Math.min(prevResources.stone + productionRates.stone, capacityRates.stone),
          population: prevResources.population
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [productionRates, capacityRates]);

  const updateProductionRate = (resource, rate) => {
    setProductionRates(prevRates => ({
      ...prevRates,
      [resource]: prevRates[resource] + rate
    }));
  };

  const updateCapacityRates = (resource, capacity) => {
    setCapacityRates(prevCapacity => {
      return {
        ...prevCapacity,
        [resource]: capacity
      };
    });
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

  return { resources, updateProductionRate, spendResources, updateCapacityRates, updatePopulation };
};

export default useResources;
