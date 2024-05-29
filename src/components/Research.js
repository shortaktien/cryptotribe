import React, { useState, useEffect } from 'react';
import { useResearch } from './ResearchContext';
import researchLaborImage from "../assets/researchLaborImage.webp"; // Aktualisiere den Pfad

import './App.css';

const defaultImage = {
  id: 0,
  name: 'Welcome to Research',
  image: researchLaborImage, // Aktualisierter Pfad zum Standardbild
  info: 'Select a research to see details.'
};

const Research = ({ resources, spendResources, updateResearchEffects, handleUpgradeResearch }) => {
  const [selectedResearch, setSelectedResearch] = useState(defaultImage);
  const { researches, upgradeResearch } = useResearch();

  const handleResearchClick = (research) => {
    setSelectedResearch(research);
  };

  const handleUpgrade = async () => {
    const researchId = selectedResearch.id;
    const nextLevelData = selectedResearch.levels[selectedResearch.currentLevel + 1];
    const resourceNames = Object.keys(nextLevelData.cost);
    const resourceCosts = Object.values(nextLevelData.cost);

    const success = spendResources(nextLevelData.cost);
    if (success) {
      console.log('Resources spent successfully:', nextLevelData.cost);
      await handleUpgradeResearch(researchId, resourceNames, resourceCosts);
      upgradeResearch(researchId, spendResources, updateResearchEffects);
    } else {
      console.log('Not enough resources:', nextLevelData.cost);
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
    const nextLevel = research.currentLevel + 1;
    if (nextLevel < research.levels.length) {
      return research.levels[nextLevel];
    }
    return null;
  };

  const canUpgrade = (cost) => {
    return Object.entries(cost).every(([resource, amount]) => resources[resource] >= amount);
  };

  const renderResourceCost = (cost) => {
    return Object.entries(cost).map(([resource, amount], index, array) => {
      const hasEnough = resources[resource] >= amount;
      return (
        <span
          key={resource}
          style={{
            color: hasEnough ? 'green' : 'red',
            fontWeight: hasEnough ? 'normal' : 'bold'
          }}
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
          <div className="research-info">
            {selectedResearch.id !== 0 ? (
              <>
                <h2>{selectedResearch.name} - Current Level: {selectedResearch.currentLevel}</h2>
                <h3>Current Level Information:</h3>
                <p>Cost: {renderResourceCost(getCurrentLevelData(selectedResearch).cost)}</p>
                <p>Effect: {getCurrentLevelData(selectedResearch).effect}</p>
                <p>{getCurrentLevelData(selectedResearch).description}</p>

                {getNextLevelData(selectedResearch) && (
                  <>
                    <h3>Next Level Information:</h3>
                    <p>Cost: {renderResourceCost(getNextLevelData(selectedResearch).cost)}</p>
                    <p>Effect: {getNextLevelData(selectedResearch).effect}</p>
                    <p>{getNextLevelData(selectedResearch).description}</p>
                    <button onClick={handleUpgrade} disabled={!canUpgrade(getNextLevelData(selectedResearch).cost)}>
                      Upgrade to Level {selectedResearch.currentLevel + 1}
                    </button>
                  </>
                )}
              </>
            ) : (
              <div className="research-info">
                <h2>{selectedResearch.name}</h2>
                <p>{selectedResearch.info}</p>
              </div>
            )}
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
