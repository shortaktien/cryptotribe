import React, { createContext, useState, useContext } from 'react';

import lamberjackImage from "../assets/lamberjackImage.webp";
import stonemasonImage from "../assets/stonemasonImage.webp";
import warehouseImage from "../assets/warehouseImage.webp";
import houseImage from "../assets/houseImage.webp";
import farmImage from "../assets/farmImage.webp";
import scienceBuildingImage from "../assets/scienceBuildingImage.webp"
import drawingWellImage from "../assets/drawingWellImage.webp";
import kohlemineImage from "../assets/coalMineImage.webp";
import goldmineImage from "../assets/goldMineBuildingImage.webp";
import militaryImage from "../assets/barracksBuildingImage.webp";
import fortImage from "../assets/barracksBuildingImage.webp";
import harborImage from "../assets/barracksBuildingImage.webp";

const BuildingsContext = createContext();

const initialBuildingsData = [
  // Lumberjack
  {
    id: 1,
    name: 'Lumberjack',
    image: lamberjackImage,
    baseCost: { wood: 50, population: 1 },
    baseProduction: { wood: 33 /3600 }, // pro Sekunde
    baseBuildTime: 5,
    currentLevel: 0,
    description: 'Wood is the resource Number 1.'
  },

  // Stonemason
  {
    id: 2,
    name: 'Stonemason',
    image: stonemasonImage,
    baseCost: { wood: 50, population: 1 },
    baseProduction: { stone: 29 /3600 }, // pro Sekunde
    baseBuildTime: 6,
    currentLevel: 0,
    description: 'Stone is the resource Number 2'
  },

  // Warehouse
  {
    id: 3,
    name: 'Warehouse',
    image: warehouseImage,
    baseCost: { wood: 50 },
    baseCapacity: { water: 500, food: 500, wood: 500, stone: 500 },
    baseBuildTime: 3,
    currentLevel: 0,
    description: 'A Warehouse to store Resources'
  },

  // House
  {
    id: 4,
    name: 'House',
    image: houseImage,
    baseCost: { wood: 50 },
    baseProduction: { population: 5 /3600 }, // pro Sekunde
    baseCapacity: { population: 30 },
    baseBuildTime: 3,
    currentLevel: 0,
    description: 'Every good Tribe needs Population'
  },

  // Farm
  {
    id: 5,
    name: 'Farm',
    image: farmImage,
    baseCost: { wood: 50, population: 1 },
    baseProduction: { food: 35 / 3600 }, // pro Sekunde
    baseBuildTime: 6,
    currentLevel: 0,
    description: 'Population need food, so build farms'
  },

  // Drawing well
  {
    id: 6,
    name: 'Drawing well',
    image: drawingWellImage,
    baseCost: { wood: 50, population: 1 },
    baseProduction: { water: 40 / 3600 }, // pro Sekunde
    baseBuildTime: 6,
    currentLevel: 0,
    description: 'Population need water, so build wells'
  },

  // Science
  {
    id: 7,
    name: 'Science',
    image: scienceBuildingImage,
    baseCost: { wood: 1, population: 1 },
    baseProduction: { knowledge: 10000 / 3600 }, // pro Sekunde
    baseCapacity: { knowledge: 200 },
    baseBuildTime: 3,
    currentLevel: 0,
    description: 'Science is important'
  },

  // Coalmine
  {
    id: 8,
    name: 'Kohlemine',
    image: kohlemineImage,
    baseCost: { wood: 50, population: 1 },
    baseProduction: { coal: 15 / 3600 }, // pro Sekunde
    baseBuildTime: 6,
    currentLevel: 0,
    description: 'Coal is important for energy production.'
  },

  // Goldmine
  {
    id: 9,
    name: 'Goldmine',
    image: goldmineImage,
    baseCost: { wood: 50, population: 1 },
    baseProduction: { gold: 0.01 / 3600 }, // pro Sekunde
    baseBuildTime: 6,
    currentLevel: 0,
    description: 'Gold is valuable for trading.'
  },

  // Barracks
  {
    id: 10,
    name: 'Barracks',
    image: militaryImage,
    baseCost: { wood: 50, population: 5 },
    baseCapacity: { military: 10 },
    baseBuildTime: 3,
    currentLevel: 0,
    description: 'Barracks to train soldiers.'
  },

  //Fortifications
  {
    id: 11,
    name: "Fortifications",
    image: fortImage,
    baseCost: {wood: 50, stone: 50, population: 5},
    baseBuildTime: 3,
    currentLevel: 0,
    description: "Includes all types of walls, towers, and gates used for defending a city or castle."
  },

  //Harbor
  {
    id: 12,
    name: "Harbor",
    image: harborImage,
    baseCost: {wood: 50, stone: 50, population: 5},
    baseBuildTime: 3,
    currentLevel: 0,
    description: "A harbor is a key trade hub with docks, warehouses, and shipyards. It facilitates import, export, and naval operations"
  }
];

const calculateCost = (baseCost, level, multiplier) => {
  const cost = {};
  Object.keys(baseCost).forEach(resource => {
    cost[resource] = Math.ceil(baseCost[resource] * Math.pow(multiplier, level));
  });
  return cost;
};

const calculateProduction = (baseProduction, level, multiplier) => {
  const production = {};
  Object.keys(baseProduction).forEach(resource => {
    production[resource] = baseProduction[resource] * Math.pow(multiplier, level); // Gebrochene Zahlen beibehalten
  });
  return production;
};

const calculateCapacity = (baseCapacity, level, multiplier) => {
  const capacity = {};
  Object.keys(baseCapacity).forEach(resource => {
    capacity[resource] = Math.ceil(baseCapacity[resource] * Math.pow(multiplier, level));
  });
  return capacity;
};

const generateLevels = (building, maxLevel = 20) => {
  const levels = [];
  for (let level = 0; level <= maxLevel; level++) {
    const cost = calculateCost(building.baseCost, level, 1.5);
    const production = building.baseProduction ? calculateProduction(building.baseProduction, level, 1.8) : null;
    const capacity = building.baseCapacity ? calculateCapacity(building.baseCapacity, level, 1.4) : null;
    const buildTime = Math.ceil(building.baseBuildTime * Math.pow(1.8, level));

    levels.push({
      level,
      cost,
      production,
      capacity,
      buildTime,
      description: building.description
    });
  }
  return levels;
};

export const BuildingsProvider = ({
  children,
  spendResources,
  updateProductionRate,
  updateCapacityRates,
  refundResources
}) => {
  const [buildings, setBuildings] = useState(
    initialBuildingsData.map(building => ({
      ...building,
      levels: generateLevels(building),
      currentLevel: 0
    }))
  );

  const upgradeBuilding = (buildingId, spendResources, updateProductionRate, updateCapacityRates) => {
    setBuildings(prevBuildings =>
      prevBuildings.map(building => {
        if (building.id === buildingId) {
          const nextLevel = building.currentLevel + 1;
          if (nextLevel < building.levels.length) {
            const nextLevelData = building.levels[nextLevel];
            const totalCost = { ...nextLevelData.cost };
            if (spendResources(totalCost)) {
              const updatedBuilding = {
                ...building,
                isBuilding: true,
                buildProgress: 0
              };
              const intervalId = setInterval(() => {
                setBuildings(prevBuildings =>
                  prevBuildings.map(b => {
                    if (b.id === buildingId) {
                      if (b.buildProgress >= nextLevelData.buildTime) {
                        clearInterval(intervalId);
                        const newBuilding = {
                          ...b,
                          currentLevel: nextLevel,
                          isBuilding: false,
                          buildProgress: 0
                        };
                        if (nextLevelData.production) {
                          Object.entries(nextLevelData.production).forEach(([resource, rate]) => {
                            updateProductionRate(resource, rate);
                          });
                        }
                        if (nextLevelData.capacity) {
                          Object.entries(nextLevelData.capacity).forEach(([resource, capacity]) => {
                            updateCapacityRates(resource, capacity);
                          });
                        }
                        if (building.name === 'Barracks') {
                          updateCapacityRates('maxMilitaryCapacity', nextLevelData.capacity.military);
                        }
                        return newBuilding;
                      }
                      return {
                        ...b,
                        buildProgress: b.buildProgress + 1
                      };
                    }
                    return b;
                  })
                );
              }, 1000);
              return updatedBuilding;
            }
          }
        }
        return building;
      })
    );
  };

  const demolishBuilding = (buildingId, resourceNames, resourceCosts) => {
    setBuildings(prevBuildings =>
      prevBuildings.map(building => {
        if (building.id === buildingId) {
          const prevLevel = building.currentLevel - 1;
          if (prevLevel >= 0) {
            const currentLevelData = building.levels[building.currentLevel];
            const updatedBuilding = {
              ...building,
              currentLevel: prevLevel
            };

            // Ressourcen zurückerstatten
            resourceNames.forEach((resource, index) => {
              refundResources({ [resource]: resourceCosts[index] });
            });

            // Produktionsrate und Kapazität reduzieren
            if (currentLevelData.production) {
              Object.entries(currentLevelData.production).forEach(([resource, rate]) => {
                updateProductionRate(resource, -rate); // Reduzierung der Produktionsrate
              });
            }

            if (currentLevelData.capacity) {
              Object.entries(currentLevelData.capacity).forEach(([resource, capacity]) => {
                updateCapacityRates(resource, -capacity); // Reduzierung der Kapazitätsrate
              });
            }

            return updatedBuilding;
          } else {
            console.log('Cannot demolish a building at level 0');
          }
        }
        return building;
      })
    );
  };

  return (
    <BuildingsContext.Provider value={{ buildings, upgradeBuilding, demolishBuilding }}>
      {children}
    </BuildingsContext.Provider>
  );
};

export const useBuildings = () => useContext(BuildingsContext);
