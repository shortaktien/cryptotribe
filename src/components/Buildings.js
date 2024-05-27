import React, { useState, useEffect } from 'react';
import { useBuildings } from './BuildingsContext';
import './App.css';

const defaultImage = {
  id: 0,
  name: 'Welcome to Buildings',
  image: 'default_building.jpg', // Pfad zum Standardbild
  info: 'Select a building to see details.'
};

const Buildings = ({ resources, spendResources, updateProductionRate, updateCapacityRates, updatePopulation }) => {
  const [selectedBuilding, setSelectedBuilding] = useState(defaultImage);
  const { buildings, upgradeBuilding } = useBuildings();

  const handleBuildingClick = (building) => {
    setSelectedBuilding(building);
  };

  const handleUpgrade = () => {
    upgradeBuilding(selectedBuilding.id, spendResources, updateProductionRate, updateCapacityRates, updatePopulation);
  };

  useEffect(() => {
    if (selectedBuilding.id !== 0) {
      const updatedBuilding = buildings.find(b => b.id === selectedBuilding.id);
      if (updatedBuilding) {
        setSelectedBuilding(updatedBuilding);
      }
    }
  }, [buildings, selectedBuilding.id]);

  const getCurrentLevelData = (building) => {
    return building.levels[building.currentLevel];
  };

  const getNextLevelData = (building) => {
    const nextLevel = building.currentLevel + 1;
    if (nextLevel < building.levels.length) {
      return building.levels[nextLevel];
    }
    return null;
  };

  return (
    <div className='main-content'>
      <div className="buildings">
        <div className="blue-rectangle">
          {selectedBuilding.id !== 0 ? (
            <>
              <img src={selectedBuilding.image} alt={selectedBuilding.name} className="blue-image" />
              <div className="building-info">
                <h2>{selectedBuilding.name} - Current Level: {selectedBuilding.currentLevel}</h2>
                <h3>Current Level Information:</h3>
                <p>Cost: {Object.entries(getCurrentLevelData(selectedBuilding).cost).map(([resource, amount]) => `${amount} ${resource}`).join(', ')}</p>
                {getCurrentLevelData(selectedBuilding).production && (
                  <p>Production: {Object.entries(getCurrentLevelData(selectedBuilding).production).map(([resource, rate]) => `${rate} ${resource}/s`).join(', ')}</p>
                )}
                {getCurrentLevelData(selectedBuilding).capacity && (
                  <p>Capacity: {Object.entries(getCurrentLevelData(selectedBuilding).capacity).map(([resource, amount]) => `${amount} ${resource}`).join(', ')}</p>
                )}
                {getCurrentLevelData(selectedBuilding).population && (
                  <p>Population: {getCurrentLevelData(selectedBuilding).population}</p>
                )}
                <p>{getCurrentLevelData(selectedBuilding).description}</p>

                {getNextLevelData(selectedBuilding) && (
                  <>
                    <h3>Next Level Information:</h3>
                    <p>Cost: {Object.entries(getNextLevelData(selectedBuilding).cost).map(([resource, amount]) => `${amount} ${resource}`).join(', ')}</p>
                    {getNextLevelData(selectedBuilding).production && (
                      <p>Production: {Object.entries(getNextLevelData(selectedBuilding).production).map(([resource, rate]) => `${rate} ${resource}/s`).join(', ')}</p>
                    )}
                    {getNextLevelData(selectedBuilding).capacity && (
                      <p>Capacity: {Object.entries(getNextLevelData(selectedBuilding).capacity).map(([resource, amount]) => `${amount} ${resource}`).join(', ')}</p>
                    )}
                    {getNextLevelData(selectedBuilding).population && (
                      <p>Population: {getNextLevelData(selectedBuilding).population}</p>
                    )}
                    <p>{getNextLevelData(selectedBuilding).description}</p>
                    <button onClick={handleUpgrade}>Upgrade to Level {selectedBuilding.currentLevel + 1}</button>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="building-info">
              <h2>{selectedBuilding.name}</h2>
              <p>{selectedBuilding.info}</p>
            </div>
          )}
        </div>
        <div className="green-rectangles">
          {buildings.map((building) => (
            <div key={building.id} className="green-rectangle" onClick={() => handleBuildingClick(building)}>
              <img src={building.image} alt={building.name} className="green-image" />
              <div className="level">{building.currentLevel}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Buildings;
