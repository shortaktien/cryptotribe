// src/components/MainContent.js
import React from 'react';
import ResourceCard from './ResourceCard';
import './App.css';

const MainContent = () => {
  return (
    <div className="main-content">
      <ResourceCard 
        title="Your Tribe" 
        production="Production duration: 6s" 
        energy="Energy needed: 13" 
      />
    </div>
  );
};

export default MainContent;
