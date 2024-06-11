import React from 'react';
import './App.css';

const ResourceCard = ({ title, production, energy }) => {
  return (
    <div className="resource-card">
      <h3>{title}</h3>
      <p>{production}</p>
      <p>{energy}</p>
    </div>
  );
};

export default ResourceCard;
