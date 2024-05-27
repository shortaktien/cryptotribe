import React, { createContext, useState, useContext } from 'react';

const BuildingsContext = createContext();

const initialBuildingsData = [
  //Lamberjack
  {
    id: 1,
    name: 'Lumberjack',
    image: 'green_building1.jpg',
    levels: [
      {
        level: 0,
        cost: { wood: 0 },
        production: { wood: 0 },
        description: 'Wood is the resource Number 1.'
      },
      {
        level: 1,
        cost: { wood: 50 },
        production: { wood: 10 },
        description: 'Wood is the resource Number 1.'
      },
      {
        level: 2,
        cost: { wood: 100, stone: 50 },
        production: { wood: 20 },
        description: 'Wood is the resource Number 1.'
      },
      {
        level: 3,
        cost: { wood: 52, stone: 0, food: 0 },
        production: { wood: 30 },
        description: 'Wood is the resource Number 1.'
      }
    ],
    currentLevel: 0
  },
  //Stonemason
  {
    id: 2,
    name: 'Stonemason',
    image: 'green_building1.jpg',
    levels: [
      {
        level: 0,
        cost: { wood: 0 },
        production: { stone: 0 },
        description: 'Stone is the resource Number 2.'
      },
      {
        level: 1,
        cost: { wood: 50 },
        production: { stone: 10 },
        description: 'Stone is the resource Number 2.'
      },
      {
        level: 2,
        cost: { wood: 100, stone: 50 },
        production: { stone: 5 },
        description: 'Stone is the resource Number 2.'
      },
      {
        level: 3,
        cost: { wood: 52, stone: 0, food: 0 },
        production: { stone: 5 },
        description: 'Stone is the resource Number 2.'
      }
    ],
    currentLevel: 0
  },
  //Warehouse
  {
    id: 3,
    name: 'Warehouse',
    image: 'green_building1.jpg',
    levels: [
      {
        level: 0,
        cost: { wood: 0 },
        capacity: { water: 100, food: 100, wood: 100, stone: 50 },
        description: 'A Warehouse to store Resources'
      },
      {
        level: 1,
        cost: { wood: 50 },
        capacity: { water: 100, food: 100, wood: 150, stone: 100 },
        description: 'A Warehouse to store Resources'
      },
      {
        level: 2,
        cost: { wood: 150, stone: 50 },
        capacity: { water: 100, food: 100, wood: 200, stone: 50 },
        description: 'A Warehouse to store Resources'
      },
      {
        level: 3,
        cost: { wood: 52, stone: 0, food: 0 },
        capacity: { water: 100, food: 100, wood: 100, stone: 50 },
        description: 'A Warehouse to store Resources'
      }
    ],
    currentLevel: 0
  },
  //House
  {
    id: 4,
    name: 'House',
    image: 'green_building1.jpg',
    levels: [
      {
        level: 0,
        cost: { wood: 0 },
        population: 10,
        description: 'Every good Tribe need Population'
      },
      {
        level: 1,
        cost: { wood: 50 },
        population: 20,
        description: 'Every good Tribe need Population'
      },
      {
        level: 2,
        cost: { wood: 150, stone: 50 },
        population: 30,
        description: 'Every good Tribe need Population'
      },
      {
        level: 3,
        cost: { wood: 52, stone: 0, food: 0 },
        population: 40,
        description: 'Every good Tribe need Population'
      }
    ],
    currentLevel: 0
  },
  //Farm
  {
    id: 5,
    name: 'Farm',
    image: 'green_building1.jpg',
    levels: [
      {
        level: 0,
        cost: { wood: 0 },
        production: { food: 0 },
        description: 'Population need food, so build farms'
      },
      {
        level: 1,
        cost: { wood: 50 },
        production: { food: 4 },
        description: 'Population need food, so build farms'
      },
      {
        level: 2,
        cost: { wood: 150, stone: 50 },
        production: { food: 5 },
        description: 'Population need food, so build farms'
      },
      {
        level: 3,
        cost: { wood: 52, stone: 0, food: 0 },
        production: { food: 5 },
        description: 'Population need food, so build farms'
      }
    ],
    currentLevel: 0
  },
  //Drawing well
  {
    id: 6,
    name: 'Drawing well',
    image: 'green_building1.jpg',
    levels: [
      {
        level: 0,
        cost: { wood: 0 },
        production: { water: 0 },
        description: 'Population need food, so build farms'
      },
      {
        level: 1,
        cost: { wood: 50 },
        production: { water: 5 },
        description: 'Population need food, so build farms'
      },
      {
        level: 2,
        cost: { wood: 150, stone: 50 },
        production: { water: 5 },
        description: 'Population need food, so build farms'
      },
      {
        level: 3,
        cost: { wood: 52, stone: 0, food: 0 },
        production: { water: 5 },
        description: 'Population need food, so build farms'
      }
    ],
    currentLevel: 0
  },
  // Weitere Gebäude ...
];

export const BuildingsProvider = ({ children }) => {
  const [buildings, setBuildings] = useState(initialBuildingsData);

  const upgradeBuilding = (
      buildingId, 
      spendResources, 
      updateProductionRate, 
      updateCapacityRates, 
      updatePopulation) => {
    setBuildings(prevBuildings =>
      prevBuildings.map(building => {
        if (building.id === buildingId) {
          const nextLevel = building.currentLevel + 1;
          if (nextLevel < building.levels.length) {
            const nextLevelData = building.levels[nextLevel];
            if (spendResources(nextLevelData.cost)) {
              const updatedBuilding = {
                ...building,
                currentLevel: nextLevel,
                capacity: { ...nextLevelData.capacity } // Clone the capacity object
              };
              console.log('Current capacities:', updatedBuilding.capacity);             
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
              if (nextLevelData.population) {
                updatePopulation(nextLevelData.population);
                console.log(`Building ${building.name} upgraded to level ${nextLevel}. Current water consumption: ${nextLevelData.population * 0.2}, Current food consumption: ${nextLevelData.population * 0.2}`);
              }
              return updatedBuilding;
            }
          }
        }
        return building;
      })
    );
  };
  

  return (
    <BuildingsContext.Provider value={{ buildings, upgradeBuilding }}>
      {children}
    </BuildingsContext.Provider>
  );
};

export const useBuildings = () => useContext(BuildingsContext);