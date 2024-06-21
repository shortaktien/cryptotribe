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

  const [myBaseHealth, setMyBaseHealth] = useState(5);
  const [enemyBaseHealth, setEnemyBaseHealth] = useState(5);

  const gameInterval = useRef(null);
  const enemySpawnInterval = useRef(null);

  const moveUnits = useCallback(() => {
    setMyUnits(prevUnits => {
      return prevUnits.map(unit => {
        const newPosition = unit.position + unit.speed / 10;
        console.log(`MyUnit ${unit.id} moved to position ${newPosition}`);

        if (newPosition >= 100) {
          setEnemyBaseHealth(prevHealth => prevHealth - 1);
          return null; // Entfernt die Einheit, wenn sie die gegnerische Basis erreicht
        }

        return { ...unit, position: newPosition };
      }).filter(Boolean);
    });

    setEnemyUnits(prevUnits => {
      return prevUnits.map(unit => {
        const newPosition = unit.position - unit.speed / 10;
        console.log(`EnemyUnit ${unit.id} moved to position ${newPosition}`);

        if (newPosition <= 0) {
          setMyBaseHealth(prevHealth => prevHealth - 1);
          return null; // Entfernt die Einheit, wenn sie die eigene Basis erreicht
        }

        return { ...unit, position: newPosition };
      }).filter(Boolean);
    });
  }, []);

  const updateCooldowns = useCallback(() => {
    const currentTime = Date.now();
    setMyUnits(prevUnits => prevUnits.map(unit => {
      if (currentTime - unit.lastAttackTime >= unit.attackCooldown) {
        return { ...unit, cooldownProgress: 100 }; // Cooldown erreicht 100%
      } else {
        const cooldownProgress = (currentTime - unit.lastAttackTime) / unit.attackCooldown * 100;
        return { ...unit, cooldownProgress };
      }
    }));

    setEnemyUnits(prevUnits => prevUnits.map(unit => {
      if (currentTime - unit.lastAttackTime >= unit.attackCooldown) {
        return { ...unit, cooldownProgress: 100 }; // Cooldown erreicht 100%
      } else {
        const cooldownProgress = (currentTime - unit.lastAttackTime) / unit.attackCooldown * 100;
        return { ...unit, cooldownProgress };
      }
    }));
  }, []);

  const startGame = useCallback(() => {
    if (gameInterval.current) {
      clearInterval(gameInterval.current);
    }
    if (enemySpawnInterval.current) {
      clearInterval(enemySpawnInterval.current);
    }

    setMyUnits([]);
    setEnemyUnits([]);
    setGameOver(false);
    setMyBaseHealth(5); // Reset my base health
    setEnemyBaseHealth(5); // Reset enemy base health

    gameInterval.current = setInterval(() => {
      moveUnits();
      updateCooldowns();
    }, 1000); // Jede Sekunde die Einheiten bewegen und Cooldown aktualisieren

    enemySpawnInterval.current = setInterval(() => {
      setEnemyUnits(prevUnits => {
        if (prevUnits.length < 10) {
          const newEnemyUnit = {
            id: prevUnits.length + 1,
            attack: 2,
            defense: 1,
            life: 10,
            maxLife: 10,
            position: 90,
            speed: 10,
            attackCooldown: 3000, // Beispiel-Cooldown von 3 Sekunden
            lastAttackTime: Date.now(),
          };
          console.log(`Spawning enemy unit ${prevUnits.length + 1}/10`, newEnemyUnit);
          return [...prevUnits, newEnemyUnit];
        } else {
          clearInterval(enemySpawnInterval.current);
          return prevUnits;
        }
      });
    }, 3000); // Jede 3 Sekunden einen Gegner generieren
  }, [moveUnits, updateCooldowns]);

  useEffect(() => {
    if (target) {
      startGame();
    }
    return () => {
      if (gameInterval.current) {
        clearInterval(gameInterval.current);
      }
      if (enemySpawnInterval.current) {
        clearInterval(enemySpawnInterval.current);
      }
    };
  }, [target, startGame]);

  useEffect(() => {
    if (myBaseHealth <= 0 || enemyBaseHealth <= 0) {
      setGameOver(true);
      clearInterval(gameInterval.current);
      clearInterval(enemySpawnInterval.current);
      onGameEnd(myBaseHealth > 0); // Ruft das onGameEnd Callback mit isVictory Parameter auf
    }
  }, [myBaseHealth, enemyBaseHealth, onGameEnd]);

  const spawnUnit = (type) => {
    if (!cooldown) {
      const unitType = units.find(unit => unit.name.toLowerCase() === type);
      if (unitType && unitType.count > 0) {
        const speed = unitType.speed;
        const attackCooldown = unitType.attackCooldown;
        setMyUnits(prevUnits => [...prevUnits, { ...unitType, id: Date.now(), position: 10, maxLife: unitType.life, speed, attackCooldown, lastAttackTime: Date.now() }]);
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
        <div className="base my-base" style={{ left: '0%' }}>
          <div className="health-bar">
            <div className="health" style={{ width: `${(myBaseHealth / 5) * 100}%` }}></div>
          </div>
        </div>
        {myUnits.map((unit) => (
          <div key={unit.id} className="unit my-unit" style={{ left: `${unit.position}%` }}>
            <div className="health-bar">
              <div className="health" style={{ width: `${(unit.life / unit.maxLife) * 100}%` }}></div>
              <div className="cooldown-bar">
                <div className="cooldown" style={{ width: `${unit.cooldownProgress}%` }}></div>
              </div>
            </div>
          </div>
        ))}
        <div className="base enemy-base" style={{ left: '100%' }}>
          <div className="health-bar">
            <div className="health" style={{ width: `${(enemyBaseHealth / 5) * 100}%` }}></div>
          </div>
        </div>
        {enemyUnits.map((unit) => (
          <div key={unit.id} className="unit enemy-unit" style={{ left: `${unit.position}%` }}>
            <div className="health-bar">
              <div className="health" style={{ width: `${(unit.life / unit.maxLife) * 100}%` }}></div>
              <div className="cooldown-bar">
                <div className="cooldown" style={{ width: `${unit.cooldownProgress}%` }}></div>
              </div>
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
