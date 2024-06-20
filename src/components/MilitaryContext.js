import React, { createContext, useState, useContext } from 'react';
import unitImage1 from "../assets/infantrieUnitImage.webp"; 
import unitImage2 from "../assets/cavalryUnitImage.webp";

const MilitaryContext = createContext();

const initialUnitsData = [
  {
    id: 1,
    name: 'Infantry',
    image: unitImage1,
    cost: { food: 10, population: 1 },
    buildTime: 3,
    attack: 2,
    defense: 1,
    life: 10,
    capacity: 1, // Kapazität, die diese Einheit benötigt
    description: 'Basic infantry unit.',
    count: 0 // Initialisiere die Anzahl der Einheiten
  },
  {
    id: 2,
    name: 'Cavalry',
    image: unitImage2,
    cost: { food: 20, population: 1 },
    buildTime: 5,
    attack: 1,
    defense: 2,
    life: 15,
    capacity: 2, // Kapazität, die diese Einheit benötigt
    description: 'Basic cavalry unit.',
    count: 0 // Initialisiere die Anzahl der Einheiten
  }
];

export const MilitaryProvider = ({ children, spendResources, updateCapacityRates, refundResources, resources, capacityRates }) => {
  const [units, setUnits] = useState(initialUnitsData);

  const trainUnit = (unitId) => {
    setUnits(prevUnits =>
      prevUnits.map(unit => {
        if (unit.id === unitId) {
          if (spendResources(unit.cost)) {
            const updatedUnit = {
              ...unit,
              isTraining: true,
              buildProgress: 0
            };
            const intervalId = setInterval(() => {
              setUnits(prevUnits =>
                prevUnits.map(u => {
                  if (u.id === unitId) {
                    if (u.buildProgress >= unit.buildTime) {
                      clearInterval(intervalId);
                      updateCapacityRates('military', unit.capacity);
                      const newUnit = {
                        ...u,
                        isTraining: false,
                        buildProgress: 0,
                        count: (u.count || 0) + 1 // Anzahl der Einheiten erhöhen
                      };
                      return newUnit;
                    }
                    return {
                      ...u,
                      buildProgress: u.buildProgress + 1
                    };
                  }
                  return u;
                })
              );
            }, 1000);
            return updatedUnit;
          }
        }
        return unit;
      })
    );
  };

  const disbandUnit = (unitId) => {
    setUnits(prevUnits =>
      prevUnits.map(unit => {
        if (unit.id === unitId) {
          refundResources(unit.cost);
          updateCapacityRates('military', -unit.capacity);
          return {
            ...unit,
            count: (unit.count || 0) - 1, // Anzahl der Einheiten verringern
            isTraining: false,
            buildProgress: 0
          };
        }
        return unit;
      })
    );
  };

  return (
    <MilitaryContext.Provider value={{ units, trainUnit, disbandUnit, resources, capacityRates }}>
      {children}
    </MilitaryContext.Provider>
  );
};

export const useMilitary = () => useContext(MilitaryContext);
