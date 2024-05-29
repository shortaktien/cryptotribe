import React, { createContext, useState, useContext } from 'react';

import lamberjackImage from "../assets/lamberjackImage.webp";
import stonemasonImage from "../assets/stonemasonImage.webp";
import warehouseImage from "../assets/warehouseImage.webp";
import houseImage from "../assets/houseImage.webp";
import farmImage from "../assets/farmImage.webp";
import drawingWellImage from "../assets/drawingWellImage.webp";

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
        cost: { wood: 150, stone: 50, population: 20 },
        production: { wood: 20 },
        description: 'Wood is the resource Number 1.'
      },
      {
        level: 3,
        cost: { wood: 250, stone: 200, food: 100 },
        production: { wood: 30 },
        description: 'Wood is the resource Number 1.'
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
        cost: { wood: 200, stone: 150, population: 20 },
        production: { stone: 20 },
        description: 'Stone is the resource Number 2.'
      },
      {
        level: 3,
        cost: { wood: 250, stone: 300, food: 300 },
        production: { stone: 30 },
        description: 'Stone is the resource Number 2.'
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
        cost: { wood: 150, stone: 50, population: 20 },
        capacity: { water: 200, food: 200, wood: 200, stone: 150 },
        description: 'A Warehouse to store Resources'
      },
      {
        level: 3,
        cost: { wood: 200, stone: 150, food: 200 },
        capacity: { water: 300, food: 300, wood: 300, stone: 200 },
        description: 'A Warehouse to store Resources'
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
      capacity: { population: 20 },     // Neue Kapazität
      description: 'Every good Tribe need Population'
    },
    {
      level: 1,
      cost: { wood: 50 },
      production: { population: 0.2 },  // Neue Produktionsrate
      capacity: { population: 30 },     // Neue Kapazität
      description: 'Every good Tribe need Population'
    },
    {
      level: 2,
      cost: { wood: 150, stone: 50 },
      production: { population: 0.3 },  // Neue Produktionsrate
      capacity: { population: 40 },     // Neue Kapazität
      description: 'Every good Tribe need Population'
    },
    {
      level: 3,
      cost: { wood: 300, stone: 200, food: 200 },
      production: { population: 0.4 },  // Neue Produktionsrate
      capacity: { population: 50 },     // Neue Kapazität
      description: 'Every good Tribe need Population'
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
        description: 'Population need food, so build farms'
      },
      {
        level: 1,
        cost: { wood: 50 },
        production: { food: 3 },
        description: 'Population need food, so build farms'
      },
      {
        level: 2,
        cost: { wood: 150, stone: 50, population: 20 },
        production: { food: 4 },
        description: 'Population need food, so build farms'
      },
      {
        level: 3,
        cost: { wood: 300, stone: 200, food: 150 },
        production: { food: 5 },
        description: 'Population need food, so build farms'
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
        description: 'Population need water, so build wells'
      },
      {
        level: 1,
        cost: { wood: 50 },
        production: { water: 4 },
        description: 'Population need water, so build wells'
      },
      {
        level: 2,
        cost: { wood: 150, stone: 150, population: 20 },
        production: { water: 5 },
        description: 'Population need water, so build wells'
      },
      {
        level: 3,
        cost: { wood: 300, stone: 200, food: 100 },
        production: { water: 6 },
        description: 'Population need water, so build wells'
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
        description: 'Science is important'
      },
      {
        level: 1,
        cost: { wood: 150 },
        production: { knowledge: 1 },
        description: 'Science is important'
      },
      {
        level: 2,
        cost: { wood: 250, stone: 150, population: 20 },
        production: { knowledge: 2 },
        description: 'Science is important'
      },
      {
        level: 3,
        cost: { wood: 300, stone: 200, food: 100 },
        production: { knowledge: 3 },
        description: 'Science is important'
      }
    ],
    currentLevel: 0
  }
  // Weitere Gebäude ...
];

export const BuildingsProvider = ({
  children,
  spendResources,
  updateProductionRate,
  updateCapacityRates,
  updatePopulation // Sicherstellen, dass es eine Funktion ist
}) => {
  const [buildings, setBuildings] = useState(initialBuildingsData);

  const upgradeBuilding = (
    buildingId, 
    spendResources, 
    updateProductionRate, 
    updateCapacityRates 
  ) => {
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
                currentLevel: nextLevel
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
