import React, { createContext, useState, useContext } from 'react';

const ResearchContext = createContext();

const initialResearchData = [
  {
    id: 1,
    name: 'Agriculture',
    description: 'Increase food production efficiency.',
    levels: [
      {
        level: 0,
        cost: { science: 0 },
        effect: 'No bonus.',
        multiplier: { food: 0 }
      },
      {
        level: 1,
        cost: { science: 50 },
        effect: 'Increase food production by 10%.',
        multiplier: { food: 0.1 }
      },
      {
        level: 2,
        cost: { science: 150 },
        effect: 'Increase food production by 20%.',
        multiplier: { food: 0.2 }
      },
      {
        level: 3,
        cost: { science: 300 },
        effect: 'Increase food production by 30%.',
        multiplier: { food: 0.3 }
      }
    ],
    currentLevel: 0
  },
  // Weitere Forschungseinträge ...
];

export const ResearchProvider = ({ children }) => {
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
              return {
                ...research,
                currentLevel: nextLevel
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
