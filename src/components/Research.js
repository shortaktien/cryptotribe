import React, { useState, useEffect } from 'react';
import { useResearch } from './ResearchContext';
import './App.css';

const Research = ({ resources, spendResources, updateResearchEffects }) => {
  const [selectedResearch, setSelectedResearch] = useState(null);
  const { researches, upgradeResearch } = useResearch();

  const handleResearchClick = (research) => {
    setSelectedResearch(research);
  };

  const handleUpgrade = () => {
    if (selectedResearch) {
      upgradeResearch(selectedResearch.id, spendResources, updateResearchEffects);
    }
  };

  useEffect(() => {
    if (selectedResearch) {
      const updatedResearch = researches.find(r => r.id === selectedResearch.id);
      if (updatedResearch) {
        setSelectedResearch(updatedResearch);
      }
    }
  }, [researches, selectedResearch]);

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
    <div className="main-content">
      <h2>Research</h2>
      <div className="researches">
        <div className="blue-rectangle">
          {selectedResearch ? (
            <>
              <div className="research-info">
                <h2>{selectedResearch.name} - Current Level: {selectedResearch.currentLevel}</h2>
                <h3>Current Level Information:</h3>
                <p>Cost: {renderResourceCost(getCurrentLevelData(selectedResearch).cost)}</p>
                <p>Effect: {getCurrentLevelData(selectedResearch).effect}</p>
                <p>{selectedResearch.description}</p>

                {getNextLevelData(selectedResearch) && (
                  <>
                    <h3>Next Level Information:</h3>
                    <p>Cost: {renderResourceCost(getNextLevelData(selectedResearch).cost)}</p>
                    <p>Effect: {getNextLevelData(selectedResearch).effect}</p>
                    <button onClick={handleUpgrade} disabled={!canUpgrade(getNextLevelData(selectedResearch).cost)}>
                      Upgrade to Level {selectedResearch.currentLevel + 1}
                    </button>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="research-info">
              <h2>Select a Research</h2>
              <p>Click on a research item to see details and upgrade options.</p>
            </div>
          )}
        </div>
        <div className="green-rectangles">
          {researches.map((research) => (
            <div key={research.id} className="green-rectangle" onClick={() => handleResearchClick(research)}>
              <div className="level">{research.currentLevel}</div>
              <h3>{research.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Research;
