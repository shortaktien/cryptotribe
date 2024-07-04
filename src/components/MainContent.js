import React, { useEffect, useState } from 'react';
import './MainContent.css';
import { useMilitary } from './MilitaryContext';
import { useDefense } from './DefenseContext';
import { useShipyard } from './ShipyardContext';

const MainContent = ({ getNetProductionRates, capacityRates = {} }) => {
  const [netProduction, setNetProduction] = useState({});
  const { units: militaryUnits } = useMilitary();
  const { structures: defenseStructures } = useDefense();
  const { ships } = useShipyard();

  useEffect(() => {
    const updateNetProduction = () => {
      const rates = getNetProductionRates();
      setNetProduction(rates || {});
    };

    const intervalId = setInterval(updateNetProduction, 1000);

    return () => clearInterval(intervalId);
  }, [getNetProductionRates]);

  useEffect(() => {
    console.log('Military Units:', militaryUnits);
    console.log('Defense Structures:', defenseStructures);
    console.log('Ships:', ships);
  }, [militaryUnits, defenseStructures, ships]);

  const totalAttack = militaryUnits.reduce((total, unit) => total + (unit.attack * (unit.count || 0)), 0)
                    + ships.reduce((total, ship) => total + (ship.attack * (ship.count || 0)), 0);
  const totalDefense = militaryUnits.reduce((total, unit) => total + (unit.defense * (unit.count || 0)), 0)
                    + defenseStructures.reduce((total, structure) => total + (structure.defense * (structure.count || 0)), 0)
                    + ships.reduce((total, ship) => total + (ship.defense * (ship.count || 0)), 0);

                    useEffect(() => {
                      console.log('Net Production:', netProduction);
                      console.log('Capacity Rates:', capacityRates);
                    }, [netProduction, capacityRates]);

  return (
    <div className="main-content-statistic">
      <div className="statistic">
        <div className="box">
          <h2 className="title">Net Production Rates per Second</h2>
          <ul className="production-list">
            {Object.entries(netProduction).map(([resource, rate]) => (
              <li key={resource} className="production-item">
                <span className="resource-name">{resource}</span>: <span className="resource-rate">{rate.toFixed(3)}</span>
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
