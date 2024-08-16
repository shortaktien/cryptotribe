import React, { useState, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import foodImage from '../assets/foodImage.webp';
import populationImage from '../assets/populationImage.webp';
import stoneImage from '../assets/stoneImage.webp';
import waterImage from '../assets/waterImage.webp';
import woodImage from '../assets/woodImage.webp';
import cryptotribeImage from "../assets/cryptotribeImage.webp";
import knowledgeImage from "../assets/knowledgeImage.webp";
import coalImage from '../assets/coalRessourceImage.webp';
import goldImage from '../assets/goldRessourceImage.webp';
import militaryImage from "../assets/militaryRessourceImage.webp"; 

import "./header.css";

const Header = ({ userAddress, userAvatar, userName, userBalance, resources = {}, updatedCapacityRates = {}, nickname }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [highlightedResources, setHighlightedResources] = useState({});

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const closeDropdown = () => {
    setDropdownVisible(false);
  };

  useEffect(() => {
    console.log("Header Resources:", resources);
    console.log("Header Capacities:", updatedCapacityRates);

    const interval = setInterval(() => {
      const newHighlightedResources = {};
      Object.keys(resources).forEach(key => {
        if (resources[key] !== undefined && resources[key] !== 0) {
          newHighlightedResources[key] = resources[key] > 0 ? 'highlight-green' : 'highlight-red';
        }
      });
  
      setHighlightedResources(newHighlightedResources);
  
      const timer = setTimeout(() => {
        setHighlightedResources(prev => ({ ...prev }));
      }, 1000);

      clearTimeout(timer);
    }, 1000);

    return () => clearInterval(interval);
  }, [resources]);

  const resourcesData = resources && updatedCapacityRates ? [
    { name: 'Water', value: Math.floor(resources.water), capacity: updatedCapacityRates.water, image: waterImage },
    { name: 'Food', value: Math.floor(resources.food), capacity: updatedCapacityRates.food, image: foodImage },
    { name: 'Wood', value: Math.floor(resources.wood), capacity: updatedCapacityRates.wood, image: woodImage },
    { name: 'Stone', value: Math.floor(resources.stone), capacity: updatedCapacityRates.stone, image: stoneImage },
    { name: 'Coal', value: Math.floor(resources.coal), capacity: updatedCapacityRates.coal, image: coalImage },
    { name: 'Gold', value: Math.floor(resources.gold), capacity: updatedCapacityRates.gold, image: goldImage },
    { name: 'Knowledge', value: Math.floor(resources.knowledge), capacity: updatedCapacityRates.knowledge, image: knowledgeImage },
    { name: 'Population', value: Math.floor(resources.population), capacity: updatedCapacityRates.population, image: populationImage },
    { name: 'Military', value: Math.floor(resources.military), capacity: updatedCapacityRates.maxMilitaryCapacity, image: militaryImage }
  ] : []; // Fallback to an empty array if resources or capacityRates are undefined

  return (
    <div className="header">
      <div className="logo"></div>
      <img src={cryptotribeImage} alt="Cryptotribe Logo" className="logo-icon" />
      <div className="resources">
        {resourcesData.map((resource, index) => (
          <div key={index} className={`resource ${highlightedResources[resource.name.toLowerCase()] || ''}`}>
            <div className="resource-container">
              <img src={resource.image} alt={resource.name} className="resource-icon" />
              <div className="resource-tooltip">{resource.name}</div>
            </div>
            <span className={`resource-amount ${resource.value >= resource.capacity ? 'full' : ''}`}>
              {resource.value} / {resource.capacity}
            </span>
          </div>
        ))}
      </div>
      <div className="profile">
        {userAvatar ? (
          <img src={userAvatar} alt="Profile" className="profile-icon" onClick={toggleDropdown} />
        ) : (
          <FaUserCircle size={40} onClick={toggleDropdown} />
        )}
        {dropdownVisible && (
          <div className="dropdown" onClick={closeDropdown}>
            <p>Address: {userAddress}</p>
            <p>Balance: {userBalance}</p>
            <p>Name: {nickname || userName}</p>
            <Link to="/settings">
              <button onClick={closeDropdown}>Settings</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;

