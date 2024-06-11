// src/components/MainContent.js
import React, { useEffect, useState } from 'react';
import './App.css';

const MainContent = ({ getNetProductionRates }) => {
  const [netProduction, setNetProduction] = useState({});

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
      <h2>Net Production Rates per Second</h2>
      <ul>
        {Object.entries(netProduction).map(([resource, rate]) => (
          <li key={resource}>
            {resource}: {rate.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MainContent;
