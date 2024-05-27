import { useState, useEffect } from 'react';
import { useBuildings } from './BuildingsContext';

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

  const { buildings } = useBuildings();

  const [capacities, setCapacities] = useState({
    water: Infinity, // assuming no capacity limit for water
    food: Infinity, // assuming no capacity limit for food
    wood: 200, // initial capacity for wood
    stone: 100, // initial capacity for stone
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setResources(prevResources => {
        let newResources = { ...prevResources };
        Object.keys(productionRates).forEach(resource => {
          const newAmount = prevResources[resource] + productionRates[resource];
          newResources[resource] = Math.min(newAmount, capacities[resource]);
        });
        return newResources;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [productionRates, capacities]);

  useEffect(() => {
    const storageBuilding = buildings.find(building => building.name === 'Lager');
    if (storageBuilding) {
      const currentLevel = storageBuilding.currentLevel;
      const newCapacities = storageBuilding.levels[currentLevel].capacity;
      setCapacities(prevCapacities => ({
        ...prevCapacities,
        ...newCapacities
      }));
    }
  }, [buildings]);

  const updateProductionRate = (resource, rate) => {
    setProductionRates(prevRates => ({
      ...prevRates,
      [resource]: prevRates[resource] + rate
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

  return { resources, updateProductionRate, spendResources };
};

export default useResources;
