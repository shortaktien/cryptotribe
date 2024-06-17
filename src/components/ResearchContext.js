import React, { createContext, useState, useContext } from 'react';

import agricultureResearchImage from "../assets/agricultureResearchImage.webp";
import waterResearchImage from "../assets/waterResearchUpdateImage.webp";

const ResearchContext = createContext();

const initialResearchData = [
  {
    id: 1,
    name: 'Agriculture',
    image: agricultureResearchImage,
    levels: [
      {
        level: 0,
        cost: { knowledge: 0 },
        effect: 'No bonus.',
        multiplier: { food: 0 },
        buildTime: 0
      },
      {
        level: 1,
        cost: { knowledge: 50 },
        effect: 'Increase food production by 10%.',
        multiplier: { food: 0.1 },
        buildTime: 3
      },
      {
        level: 2,
        cost: { knowledge: 150 },
        effect: 'Increase food production by 20%.',
        multiplier: { food: 0.2 },
        buildTime: 5
      },
      {
        level: 3,
        cost: { knowledge: 300 },
        effect: 'Increase food production by 30%.',
        multiplier: { food: 0.3 },
        buildTime: 8
      }
    ],
    currentLevel: 0
  },
  {
    id: 2,
    name: 'Other Research',
    image: waterResearchImage,
    levels: [
      {
        level: 0,
        cost: { knowledge: 0 },
        effect: 'No bonus.',
        multiplier: { other: 0 },
        buildTime: 0
      },
      {
        level: 1,
        cost: { knowledge: 50 },
        effect: 'Increase other production by 10%.',
        multiplier: { other: 0.1 },
        buildTime: 3
      },
      {
        level: 2,
        cost: { knowledge: 150 },
        effect: 'Increase other production by 20%.',
        multiplier: { other: 0.2 },
        buildTime: 5
      },
      {
        level: 3,
        cost: { knowledge: 300 },
        effect: 'Increase other production by 30%.',
        multiplier: { other: 0.3 },
        buildTime: 8
      }
    ],
    currentLevel: 0
  }
  // Weitere Forschungseinträge ...
];

export const ResearchProvider = ({
  children,
  spendResources,
  updateResearchEffects
}) => {
  const [researches, setResearches] = useState(initialResearchData);

  const upgradeResearch = (
    researchId, 
    spendResources, 
    updateResearchEffects
  ) => {
    setResearches(prevResearches =>
      prevResearches.map(research => {
        if (research.id === researchId) {
          const nextLevel = research.currentLevel + 1;
          if (nextLevel < research.levels.length) {
            const nextLevelData = research.levels[nextLevel];
            if (spendResources(nextLevelData.cost)) {
              updateResearchEffects(nextLevelData.multiplier);
              console.log(`Research ${research.name} upgraded to level ${nextLevel}. Updated production effects:`, nextLevelData.multiplier);
              return {
                ...research,
                currentLevel: nextLevel,
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
