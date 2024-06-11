import React, { useState, useEffect } from 'react';
import { useBuildings } from './BuildingsContext';
import buildingsMainPage from "../assets/buildingsMainPage.webp";
import './App.css';

const defaultImage = {
  id: 0,
  name: 'Welcome to Buildings',
  image: buildingsMainPage,
  info: 'Select a building to see details.'
};

const Buildings = ({ resources, spendResources, updateProductionRate, updateCapacityRates, handleUpgradeBuilding, handleDemolishBuilding }) => {
  const [selectedBuilding, setSelectedBuilding] = useState(defaultImage);
  const { buildings, upgradeBuilding, demolishBuilding } = useBuildings();

  const handleBuildingClick = (building) => {
    setSelectedBuilding(building);
  };

  const handleUpgrade = async () => {
    const buildingId = selectedBuilding.id;
    const nextLevelData = selectedBuilding.levels[selectedBuilding.currentLevel + 1];
    const resourceNames = Object.keys(nextLevelData.cost);
    const resourceCosts = Object.values(nextLevelData.cost);

    const success = spendResources(nextLevelData.cost);
    if (success) {
      console.log('Resources spent successfully:', nextLevelData.cost);
      await handleUpgradeBuilding(buildingId, resourceNames, resourceCosts);
      upgradeBuilding(buildingId, spendResources, updateProductionRate, updateCapacityRates);
    } else {
      console.log('Not enough resources:', nextLevelData.cost);
    }
  };

  const handleDemolish = async () => {
    if (selectedBuilding.currentLevel === 0) {
      console.log('Cannot demolish a building at level 0');
      return;
    }

    const buildingId = selectedBuilding.id;
    const currentLevelData = selectedBuilding.levels[selectedBuilding.currentLevel];
    const resourceNames = Object.keys(currentLevelData.cost);
    const resourceCosts = Object.values(currentLevelData.cost).map(cost => Math.floor(cost * 0.5));

    demolishBuilding(buildingId, resourceNames, resourceCosts);
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
    if (!building.levels) {
      return null;
    }
    const nextLevel = building.currentLevel + 1;
    if (nextLevel < building.levels.length) {
      return building.levels[nextLevel];
    }
    return null;
  };

  const canUpgrade = (cost) => {
    return Object.entries(cost).every(([resource, amount]) => resources[resource] >= amount);
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
      <div className="buildings">
        <div className="blue-rectangle">
          <img src={selectedBuilding.image} alt={selectedBuilding.name} className="blue-image" />
          
          {selectedBuilding.id !== 0 && (
            <div className="building-info current-info">
              <h2>{selectedBuilding.name} - Current Level: {selectedBuilding.currentLevel}</h2>
              <h3>Current Level Information:</h3>
              <p>Cost: {renderResourceCost(getCurrentLevelData(selectedBuilding).cost)}</p>
              {getCurrentLevelData(selectedBuilding).production && (
                <p>Production: {Object.entries(getCurrentLevelData(selectedBuilding).production).map(([resource, rate]) => `${rate} ${resource}/s`).join(', ')}</p>
              )}
              {getCurrentLevelData(selectedBuilding).capacity && (
                <p>Capacity: {Object.entries(getCurrentLevelData(selectedBuilding).capacity).map(([resource, amount]) => `${amount} ${resource}`).join(', ')}</p>
              )}
              <p>{getCurrentLevelData(selectedBuilding).description}</p>
            </div>
          )}

          {selectedBuilding.id !== 0 && (
            <div className="building-info next-info">
              {getNextLevelData(selectedBuilding) && (
                <>
                  <h3>Next Level Information:</h3>
                  <p>Cost: {renderResourceCost(getNextLevelData(selectedBuilding).cost, true)}</p>
                  {getNextLevelData(selectedBuilding).production && (
                    <p>Production: {Object.entries(getNextLevelData(selectedBuilding).production).map(([resource, rate]) => `${rate} ${resource}/s`).join(', ')}</p>
                  )}
                  {getNextLevelData(selectedBuilding).capacity && (
                    <p>Capacity: {Object.entries(getNextLevelData(selectedBuilding).capacity).map(([resource, amount]) => `${amount} ${resource}`).join(', ')}</p>
                  )}
                  <p>{getNextLevelData(selectedBuilding).description}</p>
                  <button onClick={handleUpgrade} disabled={!canUpgrade(getNextLevelData(selectedBuilding).cost) || selectedBuilding.isBuilding}>
                    {selectedBuilding.isBuilding ? `Building... ${selectedBuilding.buildProgress}/${getNextLevelData(selectedBuilding).buildTime}` : `Upgrade to Level ${selectedBuilding.currentLevel + 1}`}
                  </button>
                  <button onClick={handleDemolish} disabled={selectedBuilding.currentLevel === 0}>
                    Demolish to Level {selectedBuilding.currentLevel - 1}
                  </button>
                </>
              )}
            </div>
          )}

          <div className="tooltip">
            <button>?</button>
            <span className="tooltiptext">
              {selectedBuilding.id !== 0 && (
                <>
                  <h2>{selectedBuilding.name} - Current Level: {selectedBuilding.currentLevel}</h2>
                  <h3>Current Level Information:</h3>
                  <p>Cost: {renderResourceCost(getCurrentLevelData(selectedBuilding).cost)}</p>
                  {getCurrentLevelData(selectedBuilding).production && (
                    <p>Production: {Object.entries(getCurrentLevelData(selectedBuilding).production).map(([resource, rate]) => `${rate} ${resource}/s`).join(', ')}</p>
                  )}
                  {getCurrentLevelData(selectedBuilding).capacity && (
                    <p>Capacity: {Object.entries(getCurrentLevelData(selectedBuilding).capacity).map(([resource, amount]) => `${amount} ${resource}`).join(', ')}</p>
                  )}
                  <p>{getCurrentLevelData(selectedBuilding).description}</p>
                </>
              )}
            </span>
          </div>
        </div>
        <div className="circular-images">
          {buildings.map((building) => (
            <div key={building.id} className="circular-image-wrapper" onClick={() => handleBuildingClick(building)}>
              <img src={building.image} alt={building.name} className="circular-image" />
              <div className="level">{building.currentLevel}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Buildings;
