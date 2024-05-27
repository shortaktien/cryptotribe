import React, { useState, useEffect } from 'react';
import { useBuildings } from './BuildingsContext';
import './App.css';

const defaultImage = {
  id: 0,
  name: 'Welcome to Buildings',
  image: 'default_building.jpg', // Pfad zum Standardbild
  info: 'Select a building to see details.'
};

const Buildings = ({ resources, spendResources, updateProductionRate }) => {
  const [selectedBuilding, setSelectedBuilding] = useState(defaultImage);
  const { buildings, upgradeBuilding } = useBuildings();

  const handleBuildingClick = (building) => {
    setSelectedBuilding(building);
  };

  const handleUpgrade = () => {
    upgradeBuilding(selectedBuilding.id, spendResources, updateProductionRate);
  };

  useEffect(() => {
    if (selectedBuilding.id !== 0) {
      const updatedBuilding = buildings.find(b => b.id === selectedBuilding.id);
      if (updatedBuilding) {
        setSelectedBuilding(updatedBuilding);
      }
    }
  }, [buildings]);

  const getCurrentLevelData = (building) => {
    return building.levels[building.currentLevel - 1];
  };

  return (
    <div className='main-content'>
      <div className="buildings">
        <div className="blue-rectangle">
          {selectedBuilding.id !== 0 ? (
            <>
              <img src={selectedBuilding.image} alt={selectedBuilding.name} className="blue-image" />
              <div className="building-info">
                <h2>{selectedBuilding.name} - Level {getCurrentLevelData(selectedBuilding).level}</h2>
                <p>Cost: {Object.entries(getCurrentLevelData(selectedBuilding).cost).map(([resource, amount]) => `${amount} ${resource}`).join(', ')}</p>
                <p>Production: {Object.entries(getCurrentLevelData(selectedBuilding).production).map(([resource, rate]) => `${rate} ${resource}/s`).join(', ')}</p>
                <p>{getCurrentLevelData(selectedBuilding).description}</p>
                {selectedBuilding.currentLevel < selectedBuilding.levels.length && (
                  <button onClick={handleUpgrade}>Upgrade to Level {getCurrentLevelData(selectedBuilding).level + 1}</button>
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