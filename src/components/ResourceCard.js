// src/components/ResourceCard.js
import React from 'react';
import './App.css';

const ResourceCard = ({ title, production, energy, improveCost }) => {
  return (
    <div className="resource-card">
      <h2>{title}</h2>
      <p>{production}</p>
      <p>{energy}</p>
      <div className="improve">
        <p>Required to improve to level 2:</p>
      </div>
    </div>
  );
};

export default ResourceCard;
