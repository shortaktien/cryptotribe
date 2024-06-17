import React, { createContext, useState, useContext } from 'react';

import agricultureResearchImage from "../assets/agricultureResearchImage.webp";
import waterResearchImage from "../assets/waterResearchUpdateImage.webp";

const ResearchContext = createContext();

const initialResearchData = [
  {
    id: 1,
    name: 'Agriculture',
    image: agricultureResearchImage,
    baseCost: { knowledge: 50 },
    baseEffect: 0.0075,
    multiplier: 1.9,
    effectResource: 'food',
    buildTime: 3,
    currentLevel: 0,
    levels: generateLevels(50, 0.0075, 1.9, 'food', 3) // Generate levels dynamically
  },
  {
    id: 2,
    name: 'Water Conservation',
    image: waterResearchImage,
    baseCost: { knowledge: 50 },
    baseEffect: 0.0075,
    multiplier: 1.9,
    effectResource: 'water',
    buildTime: 3,
    currentLevel: 0,
    levels: generateLevels(50, 0.0075, 1.9, 'water', 3) // Generate levels dynamically
  }
  // Weitere Forschungseinträge ...
];

function generateLevels(baseCost, baseEffect, multiplier, effectResource, baseBuildTime, maxLevel = 20) {
  const levels = [];
  for (let level = 0; level <= maxLevel; level++) {
    const cost = { knowledge: Math.ceil(baseCost * Math.pow(multiplier, level)) };
    const effect = `Increase ${effectResource} production by ${Math.ceil(baseEffect * (level + 1) * 100)}%.`;
    const buildTime = Math.ceil(baseBuildTime * Math.pow(multiplier, level));
    const multiplierObj = {};
    multiplierObj[effectResource] = baseEffect * (level + 1);
    
    levels.push({
      level,
      cost,
      effect,
      multiplier: multiplierObj,
      buildTime
    });
  }
  return levels;
}

export const ResearchProvider = ({
  children,
  spendResources,
  updateResearchEffects
}) => {
  const [researches, setResearches] = useState(initialResearchData);

  const upgradeResearch = (researchId, spendResources, updateResearchEffects) => {
    setResearches(prevResearches =>
      prevResearches.map(research => {
        if (research.id === researchId) {
          const nextLevel = research.currentLevel + 1;
          if (nextLevel < research.levels.length) {
            const nextLevelData = research.levels[nextLevel];
            if (spendResources(nextLevelData.cost)) {
              updateResearchEffects(nextLevelData.multiplier);
              console.log(`Research ${research.name} upgraded to level ${nextLevel}. Updated production effects:`, nextLevelData.multiplier);
              const intervalId = setInterval(() => {
                setResearches(prevResearches =>
                  prevResearches.map(r => {
                    if (r.id === researchId) {
                      if (r.researchProgress >= nextLevelData.buildTime) {
                        clearInterval(intervalId);
                        return {
                          ...r,
                          currentLevel: nextLevel,
                          isResearching: false,
                          researchProgress: 0
                        };
                      }
                      return {
                        ...r,
                        researchProgress: r.researchProgress + 1
                      };
                    }
                    return r;
                  })
                );
              }, 1000);
              return {
                ...research,
                isResearching: true,
                researchProgress: 0
              };
            }
          }
        }
        return research;
      })
    );
  };

  return (
    <ResearchContext.Provider value={{ researches, upgradeResearch }}>
      {children}
    </ResearchContext.Provider>
  );
};

export const useResearch = () => useContext(ResearchContext);
