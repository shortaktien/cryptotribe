import React, { createContext, useState, useContext } from 'react';

import lamberjackImage from "../assets/lamberjackImage.webp";
import stonemasonImage from "../assets/stonemasonImage.webp";
import warehouseImage from "../assets/warehouseImage.webp";
import houseImage from "../assets/houseImage.webp";
import farmImage from "../assets/farmImage.webp";
import drawingWellImage from "../assets/drawingWellImage.webp";
import kohlemineImage from "../assets/drawingWellImage.webp";
import goldmineImage from "../assets/drawingWellImage.webp";
import militaryImage from "../assets/drawingWellImage.webp";

const BuildingsContext = createContext();

const initialBuildingsData = [
  // Lumberjack
  {
    id: 1,
    name: 'Lumberjack',
    image: lamberjackImage,
    levels: [
      {
        level: 0,
        cost: { wood: 0 },
        production: { wood: 0 },
        description: 'Wood is the resource Number 1.',
        buildTime: 0
      },
      {
        level: 1,
        cost: { wood: 50, population: 1 },
        production: { wood: 10 },
        description: 'Wood is the resource Number 1.',
        buildTime: 3
      },
      {
        level: 2,
        cost: { wood: 150, stone: 50, population: 20 },
        production: { wood: 20 },
        description: 'Wood is the resource Number 1.',
        buildTime: 5
      },
      {
        level: 3,
        cost: { wood: 250, stone: 200, food: 100 },
        production: { wood: 30 },
        description: 'Wood is the resource Number 1.',
        buildTime: 8
      }
    ],
    currentLevel: 0
  },
  // Stonemason
  {
    id: 2,
    name: 'Stonemason',
    image: stonemasonImage,
    levels: [
      {
        level: 0,
        cost: { wood: 0 },
        production: { stone: 0 },
        description: 'Stone is the resource Number 2.',
        buildTime: 0
      },
      {
        level: 1,
        cost: { wood: 50 },
        production: { stone: 10, population: 1 },
        description: 'Stone is the resource Number 2.',
        buildTime: 3
      },
      {
        level: 2,
        cost: { wood: 200, stone: 150, population: 20 },
        production: { stone: 20 },
        description: 'Stone is the resource Number 2.',
        buildTime: 5
      },
      {
        level: 3,
        cost: { wood: 250, stone: 300, food: 300 },
        production: { stone: 30 },
        description: 'Stone is the resource Number 2.',
        buildTime: 8
      }
    ],
    currentLevel: 0
  },
  // Warehouse
  {
    id: 3,
    name: 'Warehouse',
    image: warehouseImage,
    levels: [
      {
        level: 0,
        cost: { wood: 0 },
        capacity: { water: 1000, food: 1000, wood: 1000, stone: 500 },
        description: 'A Warehouse to store Resources',
        buildTime: 0
      },
      {
        level: 1,
        cost: { wood: 50 },
        capacity: { water: 1000, food: 1000, wood: 1500, stone: 1000 },
        description: 'A Warehouse to store Resources',
        buildTime: 3
      },
      {
        level: 2,
        cost: { wood: 150, stone: 50, population: 20 },
        capacity: { water: 200, food: 200, wood: 200, stone: 150 },
        description: 'A Warehouse to store Resources',
        buildTime: 5
      },
      {
        level: 3,
        cost: { wood: 200, stone: 150, food: 200 },
        capacity: { water: 300, food: 300, wood: 400, stone: 300 },
        description: 'A Warehouse to store Resources',
        buildTime: 8
      }
    ],
    currentLevel: 0
  },
  // House
  {
    id: 4,
  name: 'House',
  image: houseImage,
  levels: [
    {
      level: 0,
      cost: { wood: 0 },
      production: { population: 0.1 },  // Neue Produktionsrate
      capacity: { population: 10 },     // Neue Kapazität
      description: 'Every good Tribe need Population',
      buildTime: 0
    },
    {
      level: 1,
      cost: { wood: 50 },
      production: { population: 0.3 },  // Neue Produktionsrate
      capacity: { population: 30 },     // Neue Kapazität
      description: 'Every good Tribe need Population',
      buildTime: 3
    },
    {
      level: 2,
      cost: { wood: 150, stone: 50 },
      production: { population: 0.5 },  // Neue Produktionsrate
      capacity: { population: 35 },     // Neue Kapazität
      description: 'Every good Tribe need Population',
      buildTime: 5
    },
    {
      level: 3,
      cost: { wood: 300, stone: 200, food: 200 },
      production: { population: 0.8 },  // Neue Produktionsrate
      capacity: { population: 40 },     // Neue Kapazität
      description: 'Every good Tribe need Population',
      buildTime: 8
    }
  ],
    currentLevel: 0
  },
  // Farm
  {
    id: 5,
    name: 'Farm',
    image: farmImage,
    levels: [
      {
        level: 0,
        cost: { wood: 0 },
        production: { food: 0 },
        description: 'Population need food, so build farms',
        buildTime: 0
      },
      {
        level: 1,
        cost: { wood: 50, population: 5 },
        production: { food: 6 },
        description: 'Population need food, so build farms',
        buildTime: 3
      },
      {
        level: 2,
        cost: { wood: 150, stone: 50, population: 20 },
        production: { food: 7 },
        description: 'Population need food, so build farms',
        buildTime: 5
      },
      {
        level: 3,
        cost: { wood: 300, stone: 200, food: 150 },
        production: { food: 8 },
        description: 'Population need food, so build farms',
        buildTime: 8
      }
    ],
    currentLevel: 0
  },
  // Drawing well
  {
    id: 6,
    name: 'Drawing well',
    image: drawingWellImage,
    levels: [
      {
        level: 0,
        cost: { wood: 0 },
        production: { water: 0 },
        description: 'Population need water, so build wells',
        buildTime: 0
      },
      {
        level: 1,
        cost: { wood: 50 },
        production: { water: 4, population: 1 },
        description: 'Population need water, so build wells',
        buildTime: 3
      },
      {
        level: 2,
        cost: { wood: 150, stone: 150, population: 20 },
        production: { water: 5 },
        description: 'Population need water, so build wells',
        buildTime: 5
      },
      {
        level: 3,
        cost: { wood: 300, stone: 200, food: 100 },
        production: { water: 6 },
        description: 'Population need water, so build wells',
        buildTime: 8
      }
    ],
    currentLevel: 0
  },
  // Science
  {
    id: 7,
    name: 'Science',
    image: drawingWellImage,
    levels: [
      {
        level: 0,
        cost: { wood: 0 },
        production: { knowledge: 0 },
        capacity: { knowledge: 100 },
        description: 'Science is important',
        buildTime: 0
      },
      {
        level: 1,
        cost: { wood: 150, population: 10 },
        production: { knowledge: 1 },
        capacity: { knowledge: 200 },
        description: 'Science is important',
        buildTime: 3
      },
      {
        level: 2,
        cost: { wood: 250, stone: 150, population: 20 },
        production: { knowledge: 2 },
        capacity: { knowledge: 300 },
        description: 'Science is important',
        buildTime: 5
      },
      {
        level: 3,
        cost: { wood: 300, stone: 200, food: 100 },
        production: { knowledge: 3 },
        capacity: { knowledge: 400 },
        description: 'Science is important',
        buildTime: 8
      }
    ],
    currentLevel: 0
  },
  // Kohlemine
  {
    id: 8,
    name: 'Kohlemine',
    image: kohlemineImage,
    levels: [
      {
        level: 0,
        cost: { wood: 0 },
        production: { kohle: 0 },
        description: 'Kohle ist wichtig für die Energieerzeugung.',
        buildTime: 0
      },
      {
        level: 1,
        cost: { wood: 50, population: 5 },
        production: { kohle: 10 },
        description: 'Kohle ist wichtig für die Energieerzeugung.',
        buildTime: 3
      },
      {
        level: 2,
        cost: { wood: 150, stone: 50, population: 20 },
        production: { kohle: 20 },
        description: 'Kohle ist wichtig für die Energieerzeugung.',
        buildTime: 5
      },
      {
        level: 3,
        cost: { wood: 300, stone: 200, food: 100 },
        production: { kohle: 30 },
        description: 'Kohle ist wichtig für die Energieerzeugung.',
        buildTime: 8
      }
    ],
    currentLevel: 0
  },
  // Goldmine
  {
    id: 9,
    name: 'Goldmine',
    image: goldmineImage,
    levels: [
      {
        level: 0,
        cost: { wood: 0 },
        production: { gold: 0 },
        description: 'Gold ist wertvoll für den Handel.',
        buildTime: 0
      },
      {
        level: 1,
        cost: { wood: 50, population: 5 },
        production: { gold: 10 },
        description: 'Gold ist wertvoll für den Handel.',
        buildTime: 3
      },
      {
        level: 2,
        cost: { wood: 150, stone: 50, population: 20 },
        production: { gold: 20 },
        description: 'Gold ist wertvoll für den Handel.',
        buildTime: 5
      },
      {
        level: 3,
        cost: { wood: 300, stone: 200, food: 100 },
        production: { gold: 30 },
        description: 'Gold ist wertvoll für den Handel.',
        buildTime: 8
      }
    ],
    currentLevel: 0
  },// Barracks
  {
    id: 10,
    name: 'Barracks',
    image: militaryImage,
    levels: [
      {
        level: 0,
        cost: { wood: 0 },
        capacity: { military: 0 },
        description: 'Barracks to train soldiers.',
        buildTime: 0
      },
      {
        level: 1,
        cost: { wood: 50, population: 5 },
        capacity: { military: 10 },
        description: 'Barracks to train soldiers.',
        buildTime: 3
      },
      {
        level: 2,
        cost: { wood: 150, stone: 50, population: 20 },
        capacity: { military: 20 },
        description: 'Barracks to train soldiers.',
        buildTime: 5
      },
      {
        level: 3,
        cost: { wood: 300, stone: 200, food: 100 },
        capacity: { military: 30 },
        description: 'Barracks to train soldiers.',
        buildTime: 8
      }
    ],
    currentLevel: 0
  }
];

export const BuildingsProvider = ({
  children,
  spendResources,
  updateProductionRate,
  updateCapacityRates,
  refundResources
}) => {
  const [buildings, setBuildings] = useState(initialBuildingsData);

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