import React, { useEffect, useState } from 'react';
import './MainContent.css';
import { useMilitary } from './MilitaryContext'; // Importiere den MilitaryContext

const MainContent = ({ getNetProductionRates }) => {
  const [netProduction, setNetProduction] = useState({});
  const { units } = useMilitary(); // Hole die Einheiten aus dem MilitaryContext

  useEffect(() => {
    const updateNetProduction = () => {
      const rates = getNetProductionRates();
      setNetProduction(rates);
    };

    const intervalId = setInterval(updateNetProduction, 1000);

    return () => clearInterval(intervalId);
  }, [getNetProductionRates]);

  return (
    <div className="main-content">
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
        <h2 className="title">Units</h2>
        <ul className="unit-list">
          {units.map(unit => (
            <li key={unit.id} className="unit-item">
              <span className="unit-name">{unit.name}</span>: <span className="unit-count">{unit.count || 0}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MainContent;
