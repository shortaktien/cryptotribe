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
  const [gameOver, setGameOver] = useState(false);

  const gameInterval = useRef(null);

  const moveUnits = useCallback(() => {
    setMyUnits(prevUnits => {
      return prevUnits.map(unit => {
        const newPosition = unit.position + unit.speed / 10;
        console.log(`MyUnit ${unit.id} moved to position ${newPosition}`);
        return { ...unit, position: newPosition };
      }).filter(unit => unit.position < 95); // Entfernt die Einheit, wenn sie die gegnerische Basis erreicht
    });

    setEnemyUnits(prevUnits => {
      return prevUnits.map(unit => {
        const newPosition = unit.position - unit.speed / 10;
        console.log(`EnemyUnit ${unit.id} moved to position ${newPosition}`);
        return { ...unit, position: newPosition };
      }).filter(unit => unit.position > 5); // Entfernt die Einheit, wenn sie die eigene Basis erreicht
    });
  }, []);

  const checkCollisions = useCallback(() => {
    setMyUnits(prevMyUnits => {
      return prevMyUnits.map(myUnit => {
        const enemy = enemyUnits.find(enemyUnit => Math.abs(enemyUnit.position - myUnit.position) < 5);
        if (enemy) {
          console.log(`Collision detected between MyUnit ${myUnit.id} and EnemyUnit ${enemy.id}`);
          return { ...myUnit, speed: 0 }; // Stoppt die Einheit bei einer Kollision
        }
        return myUnit;
      });
    });

    setEnemyUnits(prevEnemyUnits => {
      return prevEnemyUnits.map(enemyUnit => {
        const myUnit = myUnits.find(myUnit => Math.abs(myUnit.position - enemyUnit.position) < 5);
        if (myUnit) {
          console.log(`Collision detected between EnemyUnit ${enemyUnit.id} and MyUnit ${myUnit.id}`);
          return { ...enemyUnit, speed: 0 }; // Stoppt die Einheit bei einer Kollision
        }
        return enemyUnit;
      });
    });
  }, [myUnits, enemyUnits]);

  const startGame = useCallback(() => {
    if (gameInterval.current) {
      clearInterval(gameInterval.current);
    }
    setMyUnits([]);
    setEnemyUnits([]);
    setGameOver(false);

    // Gegnerische Einheiten initialisieren
    const initialEnemyUnits = [
      { id: 1, attack: 2, defense: 1, life: 10, maxLife: 10, position: 90, speed: 10, attackCooldown: 1000, lastAttackTime: 0 }
    ];

    setEnemyUnits(initialEnemyUnits);

    gameInterval.current = setInterval(() => {
      moveUnits();
      checkCollisions(); // Kollisionserkennung hinzufügen
      checkGameOver(); // Spielende überprüfen
    }, 1000);
  }, [moveUnits, checkCollisions]);

  const checkGameOver = useCallback(() => {
    if (myUnits.length === 0 && !cooldown) {
      setGameOver(true);
      clearInterval(gameInterval.current);
    }

    if (enemyUnits.length === 0) {
      setGameOver(true);
      clearInterval(gameInterval.current);
    }
  }, [myUnits.length, enemyUnits.length, cooldown]);

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
        const speed = unitType.speed;
        const attackCooldown = unitType.attackCooldown;
        setMyUnits(prevUnits => [...prevUnits, { ...unitType, position: 10, maxLife: unitType.life, speed, attackCooldown, lastAttackTime: 0 }]);
        updateCapacityRates('military', -1); // Reduziere die Militärkapazität
        disbandUnit(unitType.id);
        setCooldown(true);
        setTimeout(() => setCooldown(false), 3000);
      }
    }
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
      {gameOver && <div className="game-over">Looser</div>}
    </div>
  );
};

export default MiniGame;
