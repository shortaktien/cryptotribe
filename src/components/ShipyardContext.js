import React, { createContext, useState, useContext } from 'react';
import shipImage1 from "../assets/waterImage.webp"; // Füge das entsprechende Bild hinzu
import shipImage2 from "../assets/waterImage.webp"; // Füge das entsprechende Bild hinzu

const ShipyardContext = createContext();

const initialShipsData = [
  {
    id: 1,
    name: 'Frigate',
    image: shipImage1,
    cost: { metal: 100, crystal: 50 }, //test
    buildTime: 10,
    attack: 5,
    defense: 3,
    capacity: 2, // Kapazität, die dieses Schiff benötigt
    description: 'Basic combat frigate.',
    count: 0 // Initialisiere die Anzahl der Schiffe
  },
  {
    id: 2,
    name: 'Destroyer',
    image: shipImage2,
    cost: { metal: 200, crystal: 100 }, //test
    buildTime: 20,
    attack: 10,
    defense: 5,
    capacity: 3, // Kapazität, die dieses Schiff benötigt
    description: 'Advanced combat destroyer.',
    count: 0 // Initialisiere die Anzahl der Schiffe
  }
];

export const ShipyardProvider = ({ children, spendResources, updateCapacityRates, refundResources, resources, capacityRates }) => {
  const [ships, setShips] = useState(initialShipsData);

  const buildShip = (shipId) => {
    setShips(prevShips =>
      prevShips.map(ship => {
        if (ship.id === shipId) {
          if (spendResources(ship.cost)) {
            const updatedShip = {
              ...ship,
              isBuilding: true,
              buildProgress: 0
            };
            const intervalId = setInterval(() => {
              setShips(prevShips =>
                prevShips.map(s => {
                  if (s.id === shipId) {
                    if (s.buildProgress >= ship.buildTime) {
                      clearInterval(intervalId);
                      updateCapacityRates('shipyard', ship.capacity);
                      const newShip = {
                        ...s,
                        isBuilding: false,
                        buildProgress: 0,
                        count: (s.count || 0) + 1 // Anzahl der Schiffe erhöhen
                      };
                      return newShip;
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
            return updatedShip;
          }
        }
        return ship;
      })
    );
  };

  const scrapShip = (shipId) => {
    setShips(prevShips =>
      prevShips.map(ship => {
        if (ship.id === shipId) {
          refundResources(ship.cost);
          updateCapacityRates('shipyard', -ship.capacity);
          return {
            ...ship,
            count: (ship.count || 0) - 1, // Anzahl der Schiffe verringern
            isBuilding: false,
            buildProgress: 0
          };
        }
        return ship;
      })
    );
  };

  return (
    <ShipyardContext.Provider value={{ ships, buildShip, scrapShip, resources, capacityRates }}>
      {children}
    </ShipyardContext.Provider>
  );
};

export const useShipyard = () => useContext(ShipyardContext);
