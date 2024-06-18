import React, { useState, useEffect } from 'react';
import { useShipyard } from './ShipyardContext';
import shipyardMainPage from "../assets/ShipyardBuildingImage.webp"; // Füge das entsprechende Bild hinzu
import './Shipyard.css';

const defaultImage = {
  id: 0,
  name: 'Welcome to Shipyard',
  image: shipyardMainPage,
  info: 'Select a ship to see details.'
};

const Shipyard = ({ resources, capacityRates, spendResources, handleBuildShip, handleScrapShip }) => {
  const [selectedShip, setSelectedShip] = useState(defaultImage);
  const { ships, buildShip, scrapShip } = useShipyard();

  const handleShipClick = (ship) => {
    setSelectedShip(ship);
  };

  const isOverlapping = (ship) => {
    const element = document.querySelector(`.ship-info.current-info-${ship.id}`);
    const nextElement = document.querySelector(`.ship-info.next-info-${ship.id}`);
    if (element && nextElement) {
      const rect = element.getBoundingClientRect();
      const nextRect = nextElement.getBoundingClientRect();
      return !(rect.bottom < nextRect.top || rect.top > nextRect.bottom || rect.right < nextRect.left || rect.left > nextRect.right);
    }
    return false;
  };

  const handleBuild = async () => {
    const shipId = selectedShip.id;
    const cost = selectedShip.cost;

    const success = spendResources(cost);
    if (success) {
      console.log('Resources spent successfully:', cost);
      await handleBuildShip(shipId);
      buildShip(shipId);
    } else {
      console.log('Not enough resources:', cost);
    }
  };

  const handleScrap = async () => {
    const shipId = selectedShip.id;
    scrapShip(shipId);
  };

  useEffect(() => {
    if (selectedShip.id !== 0) {
      const updatedShip = ships.find(s => s.id === selectedShip.id);
      if (updatedShip) {
        setSelectedShip(updatedShip);
      }
    }
  }, [ships, selectedShip.id]);

  const canBuild = (cost) => {
    const hasEnoughResources = Object.entries(cost).every(([resource, amount]) => resources[resource] >= amount);
    return hasEnoughResources;
  };

  const renderResourceCost = (cost, highlight = false) => {
    return Object.entries(cost).map(([resource, amount], index, array) => {
      const hasEnough = resources[resource] >= amount;
      const style = highlight ? {
        color: hasEnough ? 'green' : 'red',
        fontWeight: hasEnough ? 'normal' : 'bold'
      } : {};
      return (
        <span
          key={resource}
          style={style}
        >
          {amount} {resource}{index < array.length - 1 ? ', ' : ''}
        </span>
      );
    });
  };

  return (
    <div className='main-content'>
      <div className="shipyard">
        <div className="blue-rectangle">
          <img src={selectedShip.image} alt={selectedShip.name} className="blue-image" />

          {selectedShip.id !== 0 && (
            <div className={`ship-info current-info current-info-${selectedShip.id} ${isOverlapping(selectedShip) ? 'overlapping' : ''}`}>
              <h2>{selectedShip.name}</h2>
              <h3>Ship Information:</h3>
              <p>Cost: {renderResourceCost(selectedShip.cost)}</p>
              <p>Attack: {selectedShip.attack}</p>
              <p>Defense: {selectedShip.defense}</p>
              <p>{selectedShip.description}</p>
            </div>
          )}

          {selectedShip.id !== 0 && (
            <div className={`ship-info next-info next-info-${selectedShip.id}`}>
              <button onClick={handleBuild} disabled={!canBuild(selectedShip.cost) || selectedShip.isBuilding}>
                {selectedShip.isBuilding ? `Building... ${selectedShip.buildProgress}/${selectedShip.buildTime}` : `Build Ship`}
              </button>
              <button onClick={handleScrap} disabled={selectedShip.isBuilding}>
                Scrap Ship
              </button>
            </div>
          )}

          <div className="tooltip">
            <button>?</button>
            <span className="tooltiptext">
              {selectedShip.id !== 0 && (
                <>
                  <h2>{selectedShip.name}</h2>
                  <h3>Ship Information:</h3>
                  <p>Cost: {renderResourceCost(selectedShip.cost)}</p>
                  <p>Attack: {selectedShip.attack}</p>
                  <p>Defense: {selectedShip.defense}</p>
                  <p>{selectedShip.description}</p>
                </>
              )}
            </span>
          </div>
        </div>
        <div className="circular-images">
          {ships.map((ship) => (
            <div key={ship.id} className="circular-image-wrapper" onClick={() => handleShipClick(ship)}>
              <img src={ship.image} alt={ship.name} className="circular-image" />
              <div className="level">{ship.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shipyard;
