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
        production: { wood: 1 },
        description: 'Wood is the resource Number 1.'
      },
      {
        level: 2,
        cost: { wood: 100, stone: 50 },
        production: { wood: 5 },
        description: 'Wood is the resource Number 1.'
      },
      {
        level: 3,
        cost: { wood: 52, stone: 0, food: 0 },
        production: { wood: 5 },
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
        production: { stone: 0.5 },
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
  // Weitere Gebäude ...
];

export const BuildingsProvider = ({ children }) => {
  const [buildings, setBuildings] = useState(initialBuildingsData);

  const upgradeBuilding = (buildingId, spendResources, updateProductionRate) => {
    setBuildings(prevBuildings =>
      prevBuildings.map(building => {
        if (building.id === buildingId) {
          const nextLevel = building.currentLevel + 1;
          if (nextLevel < building.levels.length) {
            const nextLevelData = building.levels[nextLevel];
            if (spendResources(nextLevelData.cost)) {
              const updatedBuilding = {
                ...building,
                currentLevel: nextLevel
              };
              Object.entries(nextLevelData.production).forEach(([resource, rate]) => {
                updateProductionRate(resource, rate);
              });
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
