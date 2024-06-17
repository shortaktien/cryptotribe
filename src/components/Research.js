import React, { useState, useEffect } from 'react';
import { useResearch } from './ResearchContext';
import researchMainPage from "../assets/researchLaborImage.webp";
import './Research.css';

const defaultImage = {
  id: 0,
  name: 'Welcome to Research',
  image: researchMainPage,
  info: 'Select a research topic to see details.'
};

const Research = ({ resources, spendResources, updateResearchEffects, handleUpgradeResearch }) => {
  const [selectedResearch, setSelectedResearch] = useState(defaultImage);
  const { researches, upgradeResearch } = useResearch();

  const handleResearchClick = (research) => {
    setSelectedResearch(research);
  };

  const isOverlapping = (research) => {
    const element = document.querySelector(`.research-info.current-info-${research.id}`);
    const nextElement = document.querySelector(`.research-info.next-info-${research.id}`);
    if (element && nextElement) {
      const rect = element.getBoundingClientRect();
      const nextRect = nextElement.getBoundingClientRect();
      return !(rect.bottom < nextRect.top || rect.top > nextRect.bottom || rect.right < nextRect.left || rect.left > nextRect.right);
    }
    return false;
  };

  const handleUpgrade = async () => {
    const researchId = selectedResearch.id;
    const nextLevelData = selectedResearch.levels[selectedResearch.currentLevel + 1];
    const cost = nextLevelData.cost;

    const success = spendResources(cost);
    if (success) {
      console.log('Resources spent successfully:', cost);
      await handleUpgradeResearch(researchId, cost);
      upgradeResearch(researchId, spendResources, updateResearchEffects);
    } else {
      console.log('Not enough resources:', cost);
    }
  };

  useEffect(() => {
    if (selectedResearch.id !== 0) {
      const updatedResearch = researches.find(r => r.id === selectedResearch.id);
      if (updatedResearch) {
        setSelectedResearch(updatedResearch);
      }
    }
  }, [researches, selectedResearch.id]);

  const getCurrentLevelData = (research) => {
    return research.levels[research.currentLevel];
  };

  const getNextLevelData = (research) => {
    if (!research.levels) {
      return null;
    }
    const nextLevel = research.currentLevel + 1;
    if (nextLevel < research.levels.length) {
      return research.levels[nextLevel];
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
      <div className="researches">
        <div className="blue-rectangle">
          <img src={selectedResearch.image} alt={selectedResearch.name} className="blue-image" />

          {selectedResearch.id !== 0 && (
            <div className={`research-info current-info current-info-${selectedResearch.id} ${isOverlapping(selectedResearch) ? 'overlapping' : ''}`}>
              <h2>{selectedResearch.name} - Current Level: {selectedResearch.currentLevel}</h2>
              <h3>Current Level Information:</h3>
              <p>Cost: {renderResourceCost(getCurrentLevelData(selectedResearch).cost)}</p>
              <p>Effect: {getCurrentLevelData(selectedResearch).effect}</p>
              <p>{getCurrentLevelData(selectedResearch).description}</p>
            </div>
          )}

          {selectedResearch.id !== 0 && (
            <div className={`research-info next-info next-info-${selectedResearch.id}`}>
              {getNextLevelData(selectedResearch) && (
                <>
                  <h3>Next Level Information:</h3>
                  <p>Cost: {renderResourceCost(getNextLevelData(selectedResearch).cost, true)}</p>
                  <p>Effect: {getNextLevelData(selectedResearch).effect}</p>
                  <p>{getNextLevelData(selectedResearch).description}</p>
                  <button onClick={handleUpgrade} disabled={!canUpgrade(getNextLevelData(selectedResearch).cost) || selectedResearch.isBuilding}>
                    {selectedResearch.isBuilding ? `Researching... ${selectedResearch.buildProgress}/${getNextLevelData(selectedResearch).buildTime}` : `Upgrade to Level ${selectedResearch.currentLevel + 1}`}
                  </button>
                </>
              )}
            </div>
          )}

          <div className="tooltip">
            <button>?</button>
            <span className="tooltiptext">
              {selectedResearch.id !== 0 && (
                <>
                  <h2>{selectedResearch.name} - Current Level: {selectedResearch.currentLevel}</h2>
                  <h3>Current Level Information:</h3>
                  <p>Cost: {renderResourceCost(getCurrentLevelData(selectedResearch).cost)}</p>
                  <p>Effect: {getCurrentLevelData(selectedResearch).effect}</p>
                  <p>{getCurrentLevelData(selectedResearch).description}</p>
                </>
              )}
            </span>
          </div>
        </div>
        <div className="circular-images">
          {researches.map((research) => (
            <div key={research.id} className="circular-image-wrapper" onClick={() => handleResearchClick(research)}>
              <img src={research.image} alt={research.name} className="circular-image" />
              <div className="level">{research.currentLevel}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Research;
