import React, { useState, useEffect } from 'react';
import { useDefense } from './DefenseContext';
import defenseMainPage from "../assets/fortBuildingImage.webp"; // Füge das entsprechende Bild hinzu
import './Defense.css';

const defaultImage = {
  id: 0,
  name: 'Welcome to Defense',
  image: defenseMainPage,
  info: 'Select a defense structure to see details.'
};

const Defense = ({ resources, capacityRates, spendResources, handleBuildDefense, handleDemolishDefense }) => {
  const [selectedStructure, setSelectedStructure] = useState(defaultImage);
  const { structures, buildStructure, demolishStructure } = useDefense();

  const handleStructureClick = (structure) => {
    setSelectedStructure(structure);
  };

  const isOverlapping = (structure) => {
    const element = document.querySelector(`.structure-info.current-info-${structure.id}`);
    const nextElement = document.querySelector(`.structure-info.next-info-${structure.id}`);
    if (element && nextElement) {
      const rect = element.getBoundingClientRect();
      const nextRect = nextElement.getBoundingClientRect();
      return !(rect.bottom < nextRect.top || rect.top > nextRect.bottom || rect.right < nextRect.left || rect.left > nextRect.right);
    }
    return false;
  };

  const handleBuild = async () => {
    const structureId = selectedStructure.id;
    const cost = selectedStructure.cost;

    const success = spendResources(cost);
    if (success) {
      console.log('Resources spent successfully:', cost);
      await handleBuildDefense(structureId);
      buildStructure(structureId);
    } else {
      console.log('Not enough resources:', cost);
    }
  };

  const handleDemolish = async () => {
    const structureId = selectedStructure.id;
    demolishStructure(structureId);
  };

  useEffect(() => {
    if (selectedStructure.id !== 0) {
      const updatedStructure = structures.find(s => s.id === selectedStructure.id);
      if (updatedStructure) {
        setSelectedStructure(updatedStructure);
      }
    }
  }, [structures, selectedStructure.id]);

  const canBuild = (cost) => {
    const hasEnoughResources = Object.entries(cost).every(([resource, amount]) => resources[resource] >= amount);
    return hasEnoughResources;
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
      <div className="defense">
        <div className="blue-rectangle">
          <img src={selectedStructure.image} alt={selectedStructure.name} className="blue-image" />

          {selectedStructure.id !== 0 && (
            <div className={`structure-info current-info current-info-${selectedStructure.id} ${isOverlapping(selectedStructure) ? 'overlapping' : ''}`}>
              <h2>{selectedStructure.name}</h2>
              <h3>Structure Information:</h3>
              <p>Cost: {renderResourceCost(selectedStructure.cost)}</p>
              <p>Defense: {selectedStructure.defense}</p>
              <p>{selectedStructure.description}</p>
            </div>
          )}

          {selectedStructure.id !== 0 && (
            <div className={`structure-info next-info next-info-${selectedStructure.id}`}>
              <button onClick={handleBuild} disabled={!canBuild(selectedStructure.cost) || selectedStructure.isBuilding}>
                {selectedStructure.isBuilding ? `Building... ${selectedStructure.buildProgress}/${selectedStructure.buildTime}` : `Build Structure`}
              </button>
              <button onClick={handleDemolish} disabled={selectedStructure.isBuilding}>
                Demolish Structure
              </button>
            </div>
          )}

          <div className="tooltip">
            <button>?</button>
            <span className="tooltiptext">
              {selectedStructure.id !== 0 && (
                <>
                  <h2>{selectedStructure.name}</h2>
                  <h3>Structure Information:</h3>
                  <p>Cost: {renderResourceCost(selectedStructure.cost)}</p>
                  <p>Defense: {selectedStructure.defense}</p>
                  <p>{selectedStructure.description}</p>
                </>
              )}
            </span>
          </div>
        </div>
        <div className="circular-images">
          {structures.map((structure) => (
            <div key={structure.id} className="circular-image-wrapper" onClick={() => handleStructureClick(structure)}>
              <img src={structure.image} alt={structure.name} className="circular-image" />
              <div className="level">{structure.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Defense;
