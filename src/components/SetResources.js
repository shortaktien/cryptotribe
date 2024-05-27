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

  useEffect(() => {
    const interval = setInterval(() => {
      setResources(prevResources => ({
        water: prevResources.water + productionRates.water,
        food: prevResources.food + productionRates.food,
        wood: prevResources.wood + productionRates.wood,
        stone: prevResources.stone + productionRates.stone,
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [productionRates]);

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
