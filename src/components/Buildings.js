import React, { useState, useEffect } from 'react';
import { useBuildings } from './BuildingsContext';
import buildingsMainPage from "../assets/buildingsMainPage.webp";
import './Buildings.css'; // Separate CSS-Datei für Buildings

const defaultImage = {
  id: 0,
  name: 'Welcome to Buildings',
  image: buildingsMainPage,
  info: 'Select a building to see details.'
};

const Buildings = ({ resources, spendResources, updateProductionRate, updateCapacityRates, handleUpgradeBuilding, handleDemolishBuilding }) => {
  const [selectedBuilding, setSelectedBuilding] = useState(defaultImage);
  const [cooldownProgress, setCooldownProgress] = useState(0);
  const [isCooldownActive, setIsCooldownActive] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const { buildings, upgradeBuilding, demolishBuilding } = useBuildings();

  const handleBuildingClick = (building) => {
    setSelectedBuilding(building);
  };

  const isOverlapping = (building) => {
    const element = document.querySelector(`.building-info.current-info-${building.id}`);
    const nextElement = document.querySelector(`.building-info.next-info-${building.id}`);
    if (element && nextElement) {
      const rect = element.getBoundingClientRect();
      const nextRect = nextElement.getBoundingClientRect();
      return !(rect.bottom < nextRect.top || rect.top > nextRect.bottom || rect.right < nextRect.left || rect.left > nextRect.right);
    }
    return false;
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
      startCooldown(nextLevelData.buildTime);
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

  const startCooldown = (duration) => {
    setIsCooldownActive(true);
    setCooldownProgress(0);
    setRemainingTime(duration);

    const interval = setInterval(() => {
      setCooldownProgress(prev => {
        const newProgress = prev + 100 / duration;
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsCooldownActive(false);
          setCooldownProgress(0); // Reset cooldown progress
          setRemainingTime(0);
          return 0; // Ensure the progress is reset
        }
        return newProgress;
      });
      setRemainingTime(prevTime => prevTime - 1);
    }, 1000);
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

  const renderBuildingSection = (sectionTitle, buildingIds) => {
    const sectionBuildings = buildings.filter(b => buildingIds.includes(b.id));
    return (
      <div className="building-section">
        <h2 className="section-title">{sectionTitle}</h2>
        <div className="circular-images">
          {sectionBuildings.map((building) => (
            <div key={building.id} className="circular-image-wrapper" onClick={() => handleBuildingClick(building)}>
              <img src={building.image} alt={building.name} className="circular-image" />
              <div className="level">{building.currentLevel}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className='main-content'>
      <div className="buildings">
        <div className="blue-rectangle">
          <div className="image-container">
            <img src={selectedBuilding.image} alt={selectedBuilding.name} className="blue-image" />
            
            {selectedBuilding.id !== 0 && (
              <div className={`building-info current-info current-info-${selectedBuilding.id} ${isOverlapping(selectedBuilding) ? 'overlapping' : ''}`}>
                <h2>{selectedBuilding.name} - Current Level: {selectedBuilding.currentLevel}</h2>
                <h3>Current Level Information:</h3>
                {getCurrentLevelData(selectedBuilding).production && (
                  <p>Production: {Object.entries(getCurrentLevelData(selectedBuilding).production).map(([resource, rate]) => `${rate.toFixed(2)} ${resource}/s`).join(', ')}</p>
                )}
                {getCurrentLevelData(selectedBuilding).capacity && (
                  <p>Capacity: {Object.entries(getCurrentLevelData(selectedBuilding).capacity).map(([resource, amount]) => `${amount} ${resource}`).join(', ')}</p>
                )}
                <p>{getCurrentLevelData(selectedBuilding).description}</p>
              </div>
            )}

            {selectedBuilding.id !== 0 && (
              <div className={`building-info next-info next-info-${selectedBuilding.id}`}>
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
                    <p>Build Time: {getNextLevelData(selectedBuilding).buildTime} seconds</p>
                    <button onClick={handleUpgrade} disabled={!canUpgrade(getNextLevelData(selectedBuilding).cost) || isCooldownActive}>
                      {isCooldownActive && <div className="button-progress" style={{ width: `${cooldownProgress}%` }}></div>}
                      {isCooldownActive ? `Building... ${remainingTime}s` : `Upgrade to Level ${selectedBuilding.currentLevel + 1}`}
                    </button>
                    <button onClick={handleDemolish} disabled={selectedBuilding.currentLevel === 0}>
                      Demolish to Level {selectedBuilding.currentLevel - 1}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="tooltip">
            <button>?</button>
            <span className="tooltiptext">
              {selectedBuilding.id !== 0 && (
                <>
                  <h2>{selectedBuilding.name} - Level: {selectedBuilding.currentLevel}</h2>
                  <p>Cost: {renderResourceCost(getCurrentLevelData(selectedBuilding).cost)}</p>
                  {getCurrentLevelData(selectedBuilding).production && (
                    <p>Production: {Object.entries(getCurrentLevelData(selectedBuilding).production).map(([resource, rate]) => `${rate.toFixed(2)} ${resource}/s`).join(', ')}</p>
                  )}
                  {getCurrentLevelData(selectedBuilding).capacity && (
                    <p>Capacity: {Object.entries(getCurrentLevelData(selectedBuilding).capacity).map(([resource, amount]) => `${amount} ${resource}`).join(', ')}</p>
                  )}
                  
                </>
              )}
            </span>
          </div>
        </div>

        {renderBuildingSection('Civil Buildings', [4, 7, 13])}
        {renderBuildingSection('Industrial Buildings', [1, 2, 3, 5, 6, 8, 9])}
        {renderBuildingSection('Military Buildings', [10,11,12])} 
      </div>
    </div>
  );
};

export default Buildings;
