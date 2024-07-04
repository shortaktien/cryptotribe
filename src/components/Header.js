import React, { useState, useEffect, useMemo } from 'react';
import { FaUserCircle } from 'react-icons/fa';

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

import "./App.css";

const Header = ({ userAddress, userAvatar, userName, userBalance, resources, capacityRates, resourceChanges = {} }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [highlightedResources, setHighlightedResources] = useState({});

  useEffect(() => {
    // Konsolenausgabe, um die geladenen Ressourcen zu überprüfen
    //console.log('Loaded resources in Header:', resources);
  }, [resources]);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const closeDropdown = () => {
    setDropdownVisible(false);
  };

  const resourcesData = useMemo(() => [
    { name: 'Water', value: Math.floor(resources.water), capacity: capacityRates.water, image: waterImage },
    { name: 'Food', value: Math.floor(resources.food), capacity: capacityRates.food, image: foodImage },
    { name: 'Wood', value: Math.floor(resources.wood), capacity: capacityRates.wood, image: woodImage },
    { name: 'Stone', value: Math.floor(resources.stone), capacity: capacityRates.stone, image: stoneImage },
    { name: 'Coal', value: Math.floor(resources.coal), capacity: capacityRates.coal, image: coalImage },
    { name: 'Gold', value: Math.floor(resources.gold), capacity: capacityRates.gold, image: goldImage },
    { name: 'Knowledge', value: Math.floor(resources.knowledge), capacity: capacityRates.knowledge, image: knowledgeImage },
    { name: 'Population', value: Math.floor(resources.population), capacity: capacityRates.population, image: populationImage },
    { name: 'Military', value: Math.floor(resources.military), capacity: capacityRates.maxMilitaryCapacity, image: militaryImage }
  ], [resources, capacityRates]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newHighlightedResources = {};
      Object.keys(resourceChanges).forEach(key => {
        if (resourceChanges[key] !== undefined && resourceChanges[key] !== 0) {
          newHighlightedResources[key] = resourceChanges[key] > 0 ? 'highlight-green' : 'highlight-red';
        }
      });

      setHighlightedResources(newHighlightedResources);

      const timer = setTimeout(() => {
        setHighlightedResources({});
      }, 1000);

      return () => clearTimeout(timer);
    }, 1000);

    return () => clearInterval(interval);
  }, [resourceChanges]);

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
              {resource.value}
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
            <p>Name: {userName}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
