import React, { useEffect, useState } from 'react';
import './MainContent.css';
import { useMilitary } from './MilitaryContext';
import { useDefense } from './DefenseContext';
import { useShipyard } from './ShipyardContext';

const MainContent = ({ getNetProductionRates, getProductionRates, capacityRates, economicPoints, military }) => {
  const [netProduction, setNetProduction] = useState({});
  const [grossProduction, setGrossProduction] = useState({});
  const { units: militaryUnits, updateUnits } = useMilitary();
  const { structures: defenseStructures } = useDefense();
  const { ships } = useShipyard();

  useEffect(() => {
    updateUnits(military);
  }, [military, updateUnits]);

  useEffect(() => {
    const updateProductionRates = () => {
      const netRates = getNetProductionRates();
      const grossRates = getProductionRates();
      setNetProduction(netRates || {});
      setGrossProduction(grossRates || {});
    };

    const intervalId = setInterval(updateProductionRates, 1000);

    return () => clearInterval(intervalId);
  }, [getNetProductionRates, getProductionRates]);

  const totalAttack = militaryUnits.reduce((total, unit) => total + (unit.attack * (unit.count || 0)), 0)
                    + ships.reduce((total, ship) => total + (ship.attack * (ship.count || 0)), 0);
  const totalDefense = militaryUnits.reduce((total, unit) => total + (unit.defense * (unit.count || 0)), 0)
                    + defenseStructures.reduce((total, structure) => total + (structure.defense * (structure.count || 0)), 0)
                    + ships.reduce((total, ship) => total + (ship.defense * (ship.count || 0)), 0);

  const renderProductionRates = (resource, netRate, grossRate) => {
    if (netRate === grossRate) {
      return <span className="resource-rate">{netRate.toFixed(3)}</span>;
    }
    return (
      <>
        <span className="resource-rate">{netRate.toFixed(3)}</span>
        <span className="resource-rate gross-rate">({grossRate.toFixed(3)})</span>
      </>
    );
  };

  return (
    <div className="main-content-statistic">
      <div className="statistic">
        <div className="box">
          <h2 className="title">Production Rates per Second</h2>
          <ul className="production-list">
            {Object.entries(netProduction).map(([resource, netRate]) => (
              <li key={resource} className="production-item">
                <span className="resource-name">{resource}</span>: {renderProductionRates(resource, netRate, grossProduction[resource])}
              </li>
            ))}
          </ul>
        </div>
        <div className="box">
          <h2 className="title">Resource Capacities</h2>
          <ul className="production-list">
            {Object.entries(capacityRates).map(([resource, capacity]) => (
              <li key={resource} className="production-item">
                <span className="resource-name">{resource}</span>: <span className="resource-rate">{capacity}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="box">
          <h2 className="title">Units</h2>
          <ul className="unit-list">
            {militaryUnits.map(unit => (
              <li key={unit.id} className="unit-item">
                <span className="unit-name">{unit.name}</span>: <span className="unit-count">{unit.count || 0}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="box">
          <h2 className="title">Defense Structures</h2>
          <ul className="unit-list">
            {defenseStructures.map(structure => (
              <li key={structure.id} className="unit-item">
                <span className="unit-name">{structure.name}</span>: <span className="unit-count">{structure.count || 0}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="box">
          <h2 className="title">Ships</h2>
          <ul className="unit-list">
            {ships.map(ship => (
              <li key={ship.id} className="unit-item">
                <span className="unit-name">{ship.name}</span>: <span className="unit-count">{ship.count || 0}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="box points-container">
          <h2 className="title">Economic Points: {economicPoints}</h2>
        </div>
        <div className="box">
          <div className="total-stats">
            <p>Total Attack: {totalAttack}</p>
            <p>Total Defense: {totalDefense}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
