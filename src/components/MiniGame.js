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

  const moveUnits = useCallback(() => {
    setMyUnits(prevUnits => {
      const updatedUnits = prevUnits.map(unit => {
        const newPosition = unit.position + unit.speed / 10;
        console.log(`MyUnit ${unit.id} moved to position ${newPosition}`);
        return { ...unit, position: newPosition };
      }).filter(unit => unit.position < 95); // Entfernt die Einheit, wenn sie die gegnerische Basis erreicht
      return updatedUnits;
    });

    setEnemyUnits(prevUnits => {
      const updatedUnits = prevUnits.map(unit => {
        const newPosition = unit.position - unit.speed / 10;
        console.log(`EnemyUnit ${unit.id} moved to position ${newPosition}`);
        return { ...unit, position: newPosition };
      }).filter(unit => unit.position > 5); // Entfernt die Einheit, wenn sie die eigene Basis erreicht
      return updatedUnits;
    });
  }, []);

  // Kommentiere die Kollisionserkennung aus
  /*
  const checkCollisions = useCallback(() => {
    const now = Date.now();
    let newMyUnits = [...myUnits];
    let newEnemyUnits = [...enemyUnits];

    newMyUnits = newMyUnits.map(myUnit => {
      const enemy = newEnemyUnits.find(enemyUnit => Math.abs(enemyUnit.position - myUnit.position) < 5);
      if (enemy) {
        console.log('Attack! MyUnit:', myUnit, 'Enemy:', enemy);
        const myUnitAttack = Math.max(myUnit.attack - enemy.defense, 0);
        const enemyAttack = Math.max(enemy.attack - myUnit.defense, 0);

        if (now - myUnit.lastAttackTime >= myUnit.attackCooldown) {
          myUnit.life -= enemyAttack;
          myUnit.lastAttackTime = now;
        }

        if (now - enemy.lastAttackTime >= enemy.attackCooldown) {
          enemy.life -= myUnitAttack;
          enemy.lastAttackTime = now;
        }

        console.log('After Attack: MyUnit Life:', myUnit.life, 'Enemy Life:', enemy.life);

        if (enemy.life <= 0) {
          newEnemyUnits = newEnemyUnits.filter(e => e !== enemy);
        }

        if (myUnit.life <= 0) {
          return null; // Entferne die Einheit, wenn keine Leben mehr
        }
      }
      return myUnit;
    }).filter(unit => unit !== null);

    setMyUnits(newMyUnits);
    setEnemyUnits(newEnemyUnits);
  }, [myUnits, enemyUnits]);
  */

  const startGame = useCallback(() => {
    if (gameInterval.current) {
      clearInterval(gameInterval.current);
    }
    setMyUnits([]);
    setEnemyUnits([]);

    // Gegnerische Einheiten initialisieren
    const initialEnemyUnits = [
      { id: 1, attack: 2, defense: 1, life: 10, maxLife: 10, position: 90, speed: 30, attackCooldown: 1000, lastAttackTime: 0 },
      { id: 2, attack: 2, defense: 1, life: 10, maxLife: 10, position: 90, speed: 0.5, attackCooldown: 1000, lastAttackTime: 0 },
      { id: 3, attack: 2, defense: 1, life: 10, maxLife: 10, position: 90, speed: 0.5, attackCooldown: 1000, lastAttackTime: 0 },
    ];

    setEnemyUnits(initialEnemyUnits);

    gameInterval.current = setInterval(() => {
      moveUnits();
      // checkCollisions(); // Kommentiere dies vorübergehend aus
    }, 1000);
  }, [moveUnits]);

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
    </div>
  );
};

export default MiniGame;
