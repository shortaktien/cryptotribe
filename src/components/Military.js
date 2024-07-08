import React, { useState, useEffect } from 'react';
import { useMilitary } from './MilitaryContext';
import militaryMainPage from "../assets/barracksBuildingImage.webp";
import './Military.css'; // Separate CSS-Datei für Military

const defaultImage = {
  id: 0,
  name: 'Welcome to Military',
  image: militaryMainPage,
  info: 'Select a unit to see details.'
};

const Military = ({ resources, capacityRates, spendResources, handleTrainUnit, handleDisbandUnit }) => {
  const [selectedUnit, setSelectedUnit] = useState(defaultImage);
  const [cooldownProgress, setCooldownProgress] = useState(0);
  const [isCooldownActive, setIsCooldownActive] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const { units, trainUnit, disbandUnit } = useMilitary();

  const handleUnitClick = (unit) => {
    setSelectedUnit(unit);
  };

  const isOverlapping = (unit) => {
    const element = document.querySelector(`.unit-info.current-info-${unit.id}`);
    const nextElement = document.querySelector(`.unit-info.next-info-${unit.id}`);
    if (element && nextElement) {
      const rect = element.getBoundingClientRect();
      const nextRect = nextElement.getBoundingClientRect();
      return !(rect.bottom < nextRect.top || rect.top > nextRect.bottom || rect.right < nextRect.left || rect.left > nextRect.right);
    }
    return false;
  };

  const handleTrain = async () => {
    const unitId = selectedUnit.id;
    const cost = selectedUnit.cost;

    const success = spendResources(cost);
    if (success) {
      console.log('Resources spent successfully:', cost);
      await handleTrainUnit(unitId);
      trainUnit(unitId);
      startCooldown(selectedUnit.buildTime);
    } else {
      console.log('Not enough resources:', cost);
    }
  };

  const handleDisband = async () => {
    const unitId = selectedUnit.id;
    disbandUnit(unitId);
  };

  const startCooldown = (duration) => {
    setIsCooldownActive(true);
    setCooldownProgress(0);
    setRemainingTime(duration);

    const interval = setInterval(() => {
      setCooldownProgress(prev => {
        const newProgress = prev + 100 / duration;
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsCooldownActive(false);
          setCooldownProgress(0); // Reset cooldown progress
          setRemainingTime(0);
          return 0; // Ensure the progress is reset
        }
        return newProgress;
      });
      setRemainingTime(prevTime => prevTime - 1);
    }, 1000);
  };

  useEffect(() => {
    if (selectedUnit.id !== 0) {
      const updatedUnit = units.find(u => u.id === selectedUnit.id);
      if (updatedUnit) {
        setSelectedUnit(updatedUnit);
      }
    }
  }, [units, selectedUnit.id]);

  const canTrain = (cost) => {
    const hasEnoughResources = Object.entries(cost).every(([resource, amount]) => resources[resource] >= amount);
    return hasEnoughResources;
  };

  const renderResourceCost = (cost, highlight = false) => {
    return Object.entries(cost)
      .filter(([resource, amount]) => amount > 0)
      .map(([resource, amount], index, array) => {
        const hasEnough = resources[resource] >= amount;
        const style = highlight ? {
          color: hasEnough ? 'green' : 'red',
          fontWeight: hasEnough ? 'normal' : 'bold'
        } : {};
        return (
          <span
            key={resource}
            style={style}
          >
            {amount} {resource}{index < array.length - 1 ? ', ' : ''}
          </span>
        );
      });
  };

  return (
    <div className='main-content'>
      <div className="military">
        <div className="blue-rectangle">
          <div className="image-container">
            <img src={selectedUnit.image} alt={selectedUnit.name} className="blue-image" />
            
            {selectedUnit.id !== 0 && (
              <div className={`unit-info current-info current-info-${selectedUnit.id} ${isOverlapping(selectedUnit) ? 'overlapping' : ''}`}>
                <h2>{selectedUnit.name}</h2>
                <p>Cost: {renderResourceCost(selectedUnit.cost)}</p>
                <p>Attack: {selectedUnit.attack}</p>
                <p>Defense: {selectedUnit.defense}</p>
                <p>{selectedUnit.description}</p>
              </div>
            )}

            {selectedUnit.id !== 0 && (
              <div className={`unit-info next-info next-info-${selectedUnit.id}`}>
                <button onClick={handleTrain} disabled={!canTrain(selectedUnit.cost) || isCooldownActive}>
                  {isCooldownActive && <div className="button-progress" style={{ width: `${cooldownProgress}%` }}></div>}
                  {isCooldownActive ? `Training... ${remainingTime}s` : `Train Unit`}
                </button>
                <button onClick={handleDisband} disabled={selectedUnit.isTraining}>
                  Disband Unit
                </button>
              </div>
            )}
          </div>

          <div className="tooltip">
            <button>?</button>
            <span className="tooltiptext">
              {selectedUnit.id !== 0 && (
                <>
                  <h2>{selectedUnit.name}</h2>
                  <p>Cost: {renderResourceCost(selectedUnit.cost)}</p>
                  <p>Attack: {selectedUnit.attack}</p>
                  <p>Defense: {selectedUnit.defense}</p>
                  <p>{selectedUnit.description}</p>
                </>
              )}
            </span>
          </div>
        </div>
        <div className="circular-images">
          {units.map((unit) => (
            <div key={unit.id} className={`circular-image-wrapper`} onClick={() => handleUnitClick(unit)}>
              <img src={unit.image} alt={unit.name} className="circular-image" />
              <div className="level">{unit.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Military;
