import React, { createContext, useState, useContext } from 'react';

import unitImage from "../assets/lamberjackImage.webp"; // Temporäres Bild verwenden

const MilitaryContext = createContext();

const initialUnitsData = [
  {
    id: 1,
    name: 'Infantry',
    image: unitImage,
    cost: { food: 10, population: 1 },
    capacity: { military: 1 },
    buildTime: 3,
    attack: 2,
    defense: 1,
    description: 'Basic infantry unit.'
  },
  {
    id: 2,
    name: 'Cavalry',
    image: unitImage,
    cost: { food: 20, population: 1 },
    capacity: { military: 2 },
    buildTime: 5,
    attack: 1,
    defense: 2,
    description: 'Basic cavalry unit.'
  }
];

export const MilitaryProvider = ({
  children,
  spendResources,
  updateCapacityRates,
  refundResources
}) => {
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
                      const newUnit = {
                        ...u,
                        isTraining: false,
                        buildProgress: 0
                      };
                      Object.entries(u.capacity).forEach(([resource, capacity]) => {
                        updateCapacityRates(resource, capacity);
                      });
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
          Object.entries(unit.capacity).forEach(([resource, capacity]) => {
            updateCapacityRates(resource, -capacity);
          });
          refundResources(unit.cost);
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
