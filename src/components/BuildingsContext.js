import React, { createContext, useState, useContext, useEffect } from 'react';

import lamberjackImage from "../assets/lamberjackImage.webp";
import stonemasonImage from "../assets/stonemasonImage.webp";
import warehouseImage from "../assets/warehouseImage.webp";
import houseImage from "../assets/houseImage.webp";
import farmImage from "../assets/farmImage.webp";
import scienceBuildingImage from "../assets/scienceBuildingImage.webp";
import drawingWellImage from "../assets/drawingWellImage.webp";
import kohlemineImage from "../assets/coalMineImage.webp";
import goldmineImage from "../assets/goldMineBuildingImage.webp";
import militaryImage from "../assets/barracksBuildingImage.webp";
import fortImage from "../assets/fortBuildingImage.webp";
import harborImage from "../assets/ShipyardBuildingImage.webp";
import merchantImage from "../assets/merchantBuildingImage.webp";

const BuildingsContext = createContext();

const initialBuildingsData = [
  // Lumberjack
  {
    id: 1,
    name: 'Lumberjack',
    image: lamberjackImage,
    baseCost: { wood: 50, stone: 10, coal: 10, population: 1 },
    baseProduction: { wood: 33 / 3600 }, // pro Sekunde
    baseBuildTime: 5,
    currentLevel: 0,
    description: 'A sturdy structure where wood is harvested, vital for building and maintaining your realm. The legendary lumberjack Tharok, wielding twin battle axes, achieved great feats in the dense forests of Ealdoria.'
  },

  // Stonemason
  {
    id: 2,
    name: 'Stonemason',
    image: stonemasonImage,
    baseCost: { wood: 50, stone: 50, population: 1 },
    baseProduction: { stone: 29 / 3600 }, // pro Sekunde
    baseBuildTime: 6,
    currentLevel: 0,
    description: 'A workshop where skilled craftsmen shape stone, crucial for constructing resilient buildings. Ealdorias unique Eldarite stones, imbued with the hidden power of the Threads of Continuity, provide unmatched strength and durability to your structures.'
  },

  // Warehouse
  {
    id: 3,
    name: 'Warehouse',
    image: warehouseImage,
    baseCost: { wood: 60, stone: 150, population: 2 },
    baseCapacity: { water: 500, food: 500, wood: 500, stone: 500 },
    baseBuildTime: 3,
    currentLevel: 0,
    description: 'A fortified storage facility to safeguard your resources. Protecting your supplies from the marauding Skarn Raiders is crucial for sustaining your realms growth and ensuring a steady flow of materials.'
  },

  // House
  {
    id: 4,
    name: 'House',
    image: houseImage,
    baseCost: { wood: 50, stone: 50 },
    baseProduction: { population: 5 / 3600 }, // pro Sekunde
    baseCapacity: { population: 30 },
    baseBuildTime: 3,
    currentLevel: 0,
    description: 'A humble dwelling where citizens live, fostering a sense of community and providing shelter for your growing population. Essential for maintaining happiness and productivity. King Eldran of the Ehra insisted on these houses for all.'
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
    description: 'A fertile plot where crops are cultivated, ensuring food for your populace. The mighty farmer Brina, blessed by the Gleam of Eternity, enhanced harvests and secured abundant yields for the realm.'
  },

  // Drawing well
  {
    id: 6,
    name: 'Drawing well',
    image: drawingWellImage,
    baseCost: { wood: 50, stone: 35, population: 1 },
    baseProduction: { water: 40 / 3600 }, // pro Sekunde
    baseBuildTime: 6,
    currentLevel: 0,
    description: 'A deep well providing fresh water, vital for sustaining life in your realm. During the Festival of the Silver Moon, the water is believed to possess potent healing powers, revered by all.'
  },

  // Science
  {
    id: 7,
    name: 'Science',
    image: scienceBuildingImage,
    baseCost: { wood: 100, stone: 150, population: 1 },
    baseProduction: { knowledge: 10 / 3600 }, // pro Sekunde
    baseCapacity: { knowledge: 200 },
    baseBuildTime: 3,
    currentLevel: 0,
    description: 'A center of knowledge and innovation, driving progress in your realm. Beware the risk of scholars turning mad, corrupted by the Dark Veils influence, requiring them to be dealt with repeatedly to protect your kingdom.'
  },

  // Coalmine
  {
    id: 8,
    name: 'Kohlemine',
    image: kohlemineImage,
    baseCost: { wood: 250, stone: 500, population: 5 },
    baseProduction: { coal: 15 / 3600 }, // pro Sekunde
    baseBuildTime: 6,
    currentLevel: 0,
    description: 'A grimy pit where coal is extracted, crucial for powering your industry. The filthy mines of Grimscar are plagued daily by goblins and the wretched Skulkin, making every shift a hazardous endeavor.'
  },

  // Goldmine
  {
    id: 9,
    name: 'Goldmine',
    image: goldmineImage,
    baseCost: { wood: 500, stone: 1000, population: 10 },
    baseProduction: { gold: 0.01 / 3600 }, // pro Sekunde
    baseBuildTime: 6,
    currentLevel: 0,
    description: 'A glittering mine yielding precious gold, enabling wealth and opulence like the grand capital of Aurumspire. However, it also attracts the dangers of envious rival nations seeking to plunder your riches.'
  },

  // Barracks
  {
    id: 10,
    name: 'Barracks',
    image: militaryImage,
    baseCost: { wood: 50, stone: 50, population: 5 },
    baseCapacity: { military: 10 },
    baseBuildTime: 3,
    currentLevel: 0,
    description: 'A fortified building where soldiers are trained, known as the birthplace of the Tarnished Warriors. Here, legends are forged, and the might of your army is built to defend and conquer.'
  },

  // Fortifications
  {
    id: 11,
    name: "Fortifications",
    image: fortImage,
    baseCost: { wood: 50, stone: 50, population: 5 },
    baseBuildTime: 3,
    currentLevel: 0,
    description: "Massive, robust walls forming the backbone of your realm's defenses. The Great Bastions must be constantly manned by the stalwart giants of Tharundor, for defense is paramount in the struggle for survival."
  },

  // Harbor
  {
    id: 12,
    name: "Harbor",
    image: harborImage,
    baseCost: { wood: 150, stone: 150, population: 5 },
    baseBuildTime: 3,
    currentLevel: 0,
    description: "A bustling port providing access to the vast world of Ealdoria. Who knows what mysteries and opportunities lie beyond the horizon, waiting to be discovered by intrepid sailors?"
  },

  // Merchant
  {
    id: 13,
    name: "Merchant",
    image: merchantImage,
    baseCost: { wood: 50, stone: 50, population: 1 },
    baseBuildTime: 3,
    currentLevel: 0,
    description: "A peculiar man gazes at you, his eyes filled with secrets. He knows all the hidden truths of Ealdoria. Where did he acquire all these mysterious wares? Only he knows."
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

    // Füge spezielle Logik für Kohleproduktion hinzu
    if (production && level >= 5 && building.baseProduction.coal) {
      production.coal = building.baseProduction.coal * Math.pow(1.9, level - 5); // Beginne die Kohleproduktion ab Level 5
    }

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

const BuildingsProvider = ({
  children,
  initialBuildings,
  spendResources,
  updateProductionRate,
  updateCapacityRates,
  refundResources
}) => {
  const [buildings, setBuildings] = useState(
    (initialBuildings || initialBuildingsData).map(building => ({
      ...building,
      levels: generateLevels(building),
      currentLevel: building.currentLevel || 0
    }))
  );

  useEffect(() => {
    if (initialBuildings) {
      setBuildings(initialBuildings.map(building => ({
        ...building,
        levels: generateLevels(building),
        currentLevel: building.currentLevel || 0
      })));
    }
  }, [initialBuildings]);

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

  useEffect(() => {
    buildings.forEach(building => {
      console.log(`${building.name}: Level ${building.currentLevel}`);
    });
  }, [buildings]);

  return (
    <BuildingsContext.Provider value={{ buildings, upgradeBuilding, demolishBuilding }}>
      {children}
    </BuildingsContext.Provider>
  );
};

export const useBuildings = () => useContext(BuildingsContext);
export { BuildingsProvider, initialBuildingsData };