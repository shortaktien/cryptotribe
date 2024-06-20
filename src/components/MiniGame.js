import React, { useState, useEffect, useRef, useCallback } from 'react';
import './MiniGame.css';
import { useMilitary } from './MilitaryContext';
import useResources from './SetResources'; // Verwendet den existierenden Hook

const MiniGame = ({ target, onGameEnd }) => {
  const { units, disbandUnit } = useMilitary();
  const { updateCapacityRates } = useResources();
  const [myUnits, setMyUnits] = useState([]);
  const [enemyUnits, setEnemyUnits] = useState([]);
  const [cooldown, setCooldown] = useState(false);

  const gameInterval = useRef(null);

  const startGame = useCallback(() => {
    if (gameInterval.current) {
      clearInterval(gameInterval.current);
    }
    setMyUnits([]);
    setEnemyUnits([]);

    // Gegnerische Einheiten initialisieren
    const initialEnemyUnits = [
      { id: 1, attack: 2, defense: 1, life: 10, position: 90 },
      { id: 2, attack: 2, defense: 1, life: 10, position: 90 },
      { id: 3, attack: 2, defense: 1, life: 10, position: 90 },
    ];

    setEnemyUnits(initialEnemyUnits);

    gameInterval.current = setInterval(() => {
      setMyUnits(prevUnits => prevUnits.map(unit => ({ ...unit, position: unit.position + 1 })));
      setEnemyUnits(prevUnits => prevUnits.map(unit => ({ ...unit, position: unit.position - 1 })));
      checkCollisions();
    }, 100);
  }, []);

  useEffect(() => {
    if (target) {
      startGame();
    }
    return () => {
      if (gameInterval.current) {
        clearInterval(gameInterval.current);
      }
    };
  }, [target, startGame]);

  const spawnUnit = (type) => {
    if (!cooldown) {
      const unitType = units.find(unit => unit.name.toLowerCase() === type);
      if (unitType && unitType.count > 0) {
        setMyUnits([...myUnits, { ...unitType, position: 10 }]);
        updateCapacityRates('military', -1); // Reduziere die Militärkapazität
        disbandUnit(unitType.id);
        setCooldown(true);
        setTimeout(() => setCooldown(false), 3000);
      }
    }
  };

  const checkCollisions = () => {
    setMyUnits(prevMyUnits => {
      return prevMyUnits.map(myUnit => {
        const enemy = enemyUnits.find(enemyUnit => Math.abs(enemyUnit.position - myUnit.position) < 5);
        if (enemy) {
          const myUnitAttack = Math.max(myUnit.attack - enemy.defense, 0);
          const enemyAttack = Math.max(enemy.attack - myUnit.defense, 0);

          myUnit.life -= enemyAttack;
          enemy.life -= myUnitAttack;

          if (enemy.life <= 0) {
            setEnemyUnits(prevEnemies => prevEnemies.filter(e => e !== enemy));
          }

          if (myUnit.life <= 0) {
            return null; // Entferne die Einheit, wenn keine Leben mehr
          }
        }
        return myUnit;
      }).filter(unit => unit !== null);
    });
  };

  return (
    <div className="mini-game">
      <div className="map-container">
        {myUnits.map((unit, index) => (
          <div key={index} className="unit my-unit" style={{ left: `${unit.position}%` }}>
            <div className="health-bar">
              <div className="health" style={{ width: `${(unit.life / unit.maxLife) * 100}%` }}></div>
            </div>
          </div>
        ))}
        {enemyUnits.map((unit, index) => (
          <div key={index} className="unit enemy-unit" style={{ left: `${unit.position}%` }}>
            <div className="health-bar">
              <div className="health" style={{ width: `${(unit.life / unit.maxLife) * 100}%` }}></div>
            </div>
          </div>
        ))}
      </div>
      <div className="info-box">
        <div className="info-content">
          <h2>{target.name}</h2>
          <p>Enemies: {target.enemies}</p>
          <p>Attack: {target.attack}</p>
          <p>Defense: {target.defense}</p>
          <button
            className="attack-button"
            onClick={() => spawnUnit('infantry')}
            disabled={cooldown || !units.find(unit => unit.name.toLowerCase() === 'infantry' && unit.count > 0)}
          >
            Infantry
          </button>
          <button
            className="attack-button"
            onClick={() => spawnUnit('cavalry')}
            disabled={cooldown || !units.find(unit => unit.name.toLowerCase() === 'cavalry' && unit.count > 0)}
          >
            Cavalry
          </button>
        </div>
      </div>
    </div>
  );
};

export default MiniGame;
