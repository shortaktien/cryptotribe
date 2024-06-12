import React, { createContext, useState, useContext } from 'react';
import unitImage from "../assets/lamberjackImage.webp"; // Temporäres Bild verwenden

const MilitaryContext = createContext();

const initialUnitsData = [
  {
    id: 1,
    name: 'Infantry',
    image: unitImage,
    cost: { food: 10, population: 1 },
    buildTime: 3,
    attack: 2,
    defense: 1,
    capacity: 1, // Kapazität, die diese Einheit benötigt
    description: 'Basic infantry unit.'
  },
  {
    id: 2,
    name: 'Cavalry',
    image: unitImage,
    cost: { food: 20, population: 1 },
    buildTime: 5,
    attack: 1,
    defense: 2,
    capacity: 2, // Kapazität, die diese Einheit benötigt
    description: 'Basic cavalry unit.'
  }
];

export const MilitaryProvider = ({ children, spendResources, updateCapacityRates, refundResources, resources, capacityRates }) => {
  const [units, setUnits] = useState(initialUnitsData);

  const trainUnit = (unitId) => {
    setUnits(prevUnits =>
      prevUnits.map(unit => {
        if (unit.id === unitId) {
          if (spendResources(unit.cost) && (resources.military + unit.capacity <= capacityRates.maxMilitaryCapacity)) {
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
                      updateCapacityRates('military', unit.capacity); // Kapazität erhöhen
                      const newUnit = {
                        ...u,
                        isTraining: false,
                        buildProgress: 0
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
          updateCapacityRates('military', -unit.capacity); // Kapazität verringern
          return {
            ...unit,
            isTraining: false,
            buildProgress: 0
          };
        }
        return unit;
      })
    );
  };

  return (
    <MilitaryContext.Provider value={{ units, trainUnit, disbandUnit }}>
      {children}
    </MilitaryContext.Provider>
  );
};

export const useMilitary = () => useContext(MilitaryContext);