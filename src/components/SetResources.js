import { useState, useEffect } from 'react';

const useResources = () => {
  const [resources, setResources] = useState({
    water: 100,
    food: 100,
    wood: 100,
    stone: 0,
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
      setResources(prevResources => ({
        water: Math.min(prevResources.water + productionRates.water, capacityRates.water),
        food: Math.min(prevResources.food + productionRates.food, capacityRates.food),
        wood: Math.min(prevResources.wood + productionRates.wood, capacityRates.wood),
        stone: Math.min(prevResources.stone + productionRates.stone, capacityRates.stone),
      }));
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

  return { resources, updateProductionRate, spendResources, updateCapacityRates };
};

export default useResources;
