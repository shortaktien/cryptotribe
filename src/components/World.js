import React, { useState } from 'react';
import './World.css';
import worldMap from '../assets/warehouseImage.webp'; // Pfad zum hochgeladenen Bild

const targets = [
  { id: 1, name: 'Target 1', enemies: 10, attack: 50, defense: 40, top: '20%', left: '30%' },
  { id: 2, name: 'Target 2', enemies: 15, attack: 70, defense: 60, top: '50%', left: '60%' },
  { id: 3, name: 'Target 3', enemies: 20, attack: 90, defense: 80, top: '70%', left: '40%' },
  { id: 4, name: 'Target 4', enemies: 5, attack: 30, defense: 20, top: '30%', left: '80%' },
  { id: 5, name: 'Target 5', enemies: 25, attack: 100, defense: 90, top: '10%', left: '50%' },
  { id: 6, name: 'Target 6', enemies: 12, attack: 60, defense: 50, top: '80%', left: '20%' },
  { id: 7, name: 'Target 7', enemies: 8, attack: 40, defense: 30, top: '60%', left: '10%' },
  { id: 8, name: 'Target 8', enemies: 18, attack: 80, defense: 70, top: '40%', left: '70%' },
];

const World = () => {
  const [selectedTarget, setSelectedTarget] = useState(null);

  const handleTargetClick = (target) => {
    setSelectedTarget(target);
  };

  const handleAttack = () => {
    if (selectedTarget) {
      console.log(`Attacking ${selectedTarget.name}`);
      // Hier könnte die Angriffsfunktion aufgerufen werden
    }
  };

  return (
    <div className="world-container">
      <div className="map-section">
        <div className="section-title">World Map</div>
        <div className="map-container" style={{ backgroundImage: `url(${worldMap})` }}>
          {targets.map((target) => (
            <button
              key={target.id}
              className="target"
              onClick={() => handleTargetClick(target)}
              style={{ top: target.top, left: target.left }}
            >
              {target.id}
            </button>
          ))}
        </div>
      </div>
      <div className="info-box">
        {selectedTarget ? (
          <>
            <h2>{selectedTarget.name}</h2>
            <p>Enemies: {selectedTarget.enemies}</p>
            <p>Attack: {selectedTarget.attack}</p>
            <p>Defense: {selectedTarget.defense}</p>
            <button className="attack-button" onClick={handleAttack}>Attack</button>
          </>
        ) : (
          <p>Select a target to see details</p>
        )}
      </div>
    </div>
  );
};

export default World;
