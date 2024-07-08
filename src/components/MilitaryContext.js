import React, { createContext, useState, useContext, useCallback } from 'react';
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
    capacity: 1,
    description: 'Infantry unit description.',
    count: 0,
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
    capacity: 2,
    description: 'Cavalry unit description.',
    count: 0,
  }
];

export const MilitaryProvider = ({ children, spendResources, updateCapacityRates }) => {
  const [units, setUnits] = useState(initialUnitsData);

  const calculateTotalMilitaryCapacity = (units) => {
    return units.reduce((sum, unit) => sum + (unit.count * unit.capacity), 0);
  };

  const trainUnit = (unitId) => {
    setUnits(prevUnits =>
      prevUnits.map(unit => {
        if (unit.id === unitId) {
          const success = spendResources(unit.cost);
          if (success) {
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
                        buildProgress: 0,
                        count: (u.count || 0) + 1 // Anzahl der Einheiten erhöhen
                      };
                      updateCapacityRates('military', calculateTotalMilitaryCapacity([...prevUnits, newUnit]));
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
        if (unit.id === unitId && unit.count > 0) {
          const newCount = (unit.count || 0) - 1;
          updateCapacityRates('military', calculateTotalMilitaryCapacity([...prevUnits, { ...unit, count: newCount }]));
          return {
            ...unit,
            count: newCount, // Anzahl der Einheiten verringern
            isTraining: false,
            buildProgress: 0
          };
        }
        return unit;
      })
    );
  };

  const getMilitaryData = useCallback(() => {
    const militaryData = {};
    units.forEach(unit => {
      militaryData[unit.name.toLowerCase()] = unit.count;
    });
    return militaryData;
  }, [units]);

  const updateUnits = useCallback((militaryData) => {
    setUnits(prevUnits =>
      prevUnits.map(unit => ({
        ...unit,
        count: militaryData[unit.name.toLowerCase()] || 0
      }))
    );
  }, []);

  return (
    <MilitaryContext.Provider value={{ units, trainUnit, disbandUnit, getMilitaryData, updateUnits }}>
      {children}
    </MilitaryContext.Provider>
  );
};

export const useMilitary = () => useContext(MilitaryContext);
