import React, { useState } from 'react';
import './World.css';
import worldMap from '../assets/wallsUnitImage.webp'; // Pfad zum hochgeladenen Bild
import MiniGame from './MiniGame';
import useResources from './SetResources'; // Verwendet den existierenden Hook

const initialTargets = [
  { id: 1, name: 'Target 1', enemies: 10, attack: 50, defense: 40, top: '20%', left: '30%' }
];

const generateTargets = (initialTargets) => {
  const targets = [...initialTargets];
  for (let i = 1; i < 8; i++) {
    const previousTarget = targets[i - 1];
    targets.push({
      id: i + 1,
      name: `Target ${i + 1}`,
      enemies: Math.ceil(previousTarget.enemies * 1.9),
      attack: Math.ceil(previousTarget.attack * 1.9),
      defense: Math.ceil(previousTarget.defense * 1.9),
      top: `${20 + i * 10}%`,
      left: `${30 + i * 10}%`,
    });
  }
  return targets;
};

const targets = generateTargets(initialTargets);

const World = () => {
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [unlockedLevels, setUnlockedLevels] = useState([1]); // Level 1 ist initial freigeschaltet
  const { updateCapacityRates } = useResources();

  const handleTargetClick = (target) => {
    if (unlockedLevels.includes(target.id)) {
      setSelectedTarget(target);
    }
  };

  const updateMilitaryCount = (amount) => {
    updateCapacityRates('military', amount);
  };

  const handleGameEnd = (isVictory) => {
    if (isVictory) {
      const nextLevel = selectedTarget.id + 1;
      setUnlockedLevels([...unlockedLevels, nextLevel]);
    }
    setSelectedTarget(null);
  };

  return (
    <div className="main-content">
      <div className="world">
        <div className="map-section">
          <div className="section-title">World Map</div>
          <div className="map-container" style={{ backgroundImage: `url(${worldMap})` }}>
            {targets.map((target) => (
              <button
                key={target.id}
                className="target"
                onClick={() => handleTargetClick(target)}
                style={{ top: target.top, left: target.left }}
                disabled={!unlockedLevels.includes(target.id)}
              >
                {target.id}
              </button>
            ))}
          </div>
        </div>
        {selectedTarget && <MiniGame target={selectedTarget} updateMilitaryCount={updateMilitaryCount} onGameEnd={handleGameEnd} />}
      </div>
    </div>
  );
};

export default World;
