import React, { createContext, useState, useContext } from 'react';
import wallImage from "../assets/wallsUnitImage.webp"; // Füge das entsprechende Bild hinzu
import towerImage from "../assets/towerUnitImage.webp"; // Füge das entsprechende Bild hinzu

const DefenseContext = createContext();

const initialStructuresData = [
  {
    id: 1,
    name: 'Wall',
    image: wallImage,
    cost: { wood: 100, stone: 50 },
    buildTime: 10,
    defense: 5,
    capacity: 2, // Kapazität, die diese Struktur benötigt
    description: 'Basic defensive wall.',
    count: 0 // Initialisiere die Anzahl der Strukturen
  },
  {
    id: 2,
    name: 'Tower',
    image: towerImage,
    cost: { wood: 200, stone: 100 },
    buildTime: 20,
    defense: 10,
    capacity: 3, // Kapazität, die diese Struktur benötigt
    description: 'Defensive tower.',
    count: 0 // Initialisiere die Anzahl der Strukturen
  }
];

export const DefenseProvider = ({ children, spendResources, updateCapacityRates, refundResources, resources, capacityRates }) => {
  const [structures, setStructures] = useState(initialStructuresData);

  const buildStructure = (structureId) => {
    setStructures(prevStructures =>
      prevStructures.map(structure => {
        if (structure.id === structureId) {
          if (spendResources(structure.cost)) {
            const updatedStructure = {
              ...structure,
              isBuilding: true,
              buildProgress: 0
            };
            const intervalId = setInterval(() => {
              setStructures(prevStructures =>
                prevStructures.map(s => {
                  if (s.id === structureId) {
                    if (s.buildProgress >= structure.buildTime) {
                      clearInterval(intervalId);
                      updateCapacityRates('defense', structure.capacity);
                      const newStructure = {
                        ...s,
                        isBuilding: false,
                        buildProgress: 0,
                        count: (s.count || 0) + 1 // Anzahl der Strukturen erhöhen
                      };
                      return newStructure;
                    }
                    return {
                      ...s,
                      buildProgress: s.buildProgress + 1
                    };
                  }
                  return s;
                })
              );
            }, 1000);
            return updatedStructure;
          }
        }
        return structure;
      })
    );
  };

  const demolishStructure = (structureId) => {
    setStructures(prevStructures =>
      prevStructures.map(structure => {
        if (structure.id === structureId) {
          refundResources(structure.cost);
          updateCapacityRates('defense', -structure.capacity);
          return {
            ...structure,
            count: (structure.count || 0) - 1, // Anzahl der Strukturen verringern
            isBuilding: false,
            buildProgress: 0
          };
        }
        return structure;
      })
    );
  };

  return (
    <DefenseContext.Provider value={{ structures, buildStructure, demolishStructure, resources, capacityRates }}>
      {children}
    </DefenseContext.Provider>
  );
};

export const useDefense = () => useContext(DefenseContext);
