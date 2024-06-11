import React, { useState, useEffect } from 'react';
import { useMilitary } from './MilitaryContext';
import militaryMainPage from "../assets/houseImage.webp";
import './App.css';

const defaultImage = {
  id: 0,
  name: 'Welcome to Military',
  image: militaryMainPage,
  info: 'Select a unit to see details.'
};

const Military = ({ resources, capacityRates, spendResources, handleTrainUnit, handleDisbandUnit }) => {
  const [selectedUnit, setSelectedUnit] = useState(defaultImage);
  const { units, trainUnit, disbandUnit } = useMilitary();

  const handleUnitClick = (unit) => {
    setSelectedUnit(unit);
  };

  const handleTrain = async () => {
    const unitId = selectedUnit.id;
    const cost = selectedUnit.cost;

    const success = spendResources(cost);
    if (success) {
      console.log('Resources spent successfully:', cost);
      await handleTrainUnit(unitId);
      trainUnit(unitId);
    } else {
      console.log('Not enough resources:', cost);
    }
  };

  const handleDisband = async () => {
    const unitId = selectedUnit.id;
    disbandUnit(unitId);
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
    const totalMilitaryUnits = units.reduce((total, unit) => total + (unit.isTraining ? 1 : 0), 0);
    return (
      Object.entries(cost).every(([resource, amount]) => resources[resource] >= amount) &&
      totalMilitaryUnits < capacityRates.military
    );
  };

  const renderResourceCost = (cost, highlight = false) => {
    return Object.entries(cost).map(([resource, amount], index, array) => {
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
          <img src={selectedUnit.image} alt={selectedUnit.name} className="blue-image" />

          {selectedUnit.id !== 0 && (
            <div className={`unit-info current-info current-info-${selectedUnit.id}`}>
              <h2>{selectedUnit.name}</h2>
              <h3>Unit Information:</h3>
              <p>Cost: {renderResourceCost(selectedUnit.cost)}</p>
              <p>Attack: {selectedUnit.attack}</p>
              <p>Defense: {selectedUnit.defense}</p>
              <p>{selectedUnit.description}</p>
            </div>
          )}

          {selectedUnit.id !== 0 && (
            <div className={`unit-info next-info next-info-${selectedUnit.id}`}>
              <button onClick={handleTrain} disabled={!canTrain(selectedUnit.cost) || selectedUnit.isTraining}>
                {selectedUnit.isTraining ? `Training... ${selectedUnit.buildProgress}/${selectedUnit.buildTime}` : `Train Unit`}
              </button>
              <button onClick={handleDisband} disabled={selectedUnit.isTraining}>
                Disband Unit
              </button>
            </div>
          )}

          <div className="tooltip">
            <button>?</button>
            <span className="tooltiptext">
              {selectedUnit.id !== 0 && (
                <>
                  <h2>{selectedUnit.name}</h2>
                  <h3>Unit Information:</h3>
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
            <div key={unit.id} className="circular-image-wrapper" onClick={() => handleUnitClick(unit)}>
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
