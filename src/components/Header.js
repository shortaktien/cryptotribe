import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';

import foodImage from '../assets/foodImage.webp';
import populationImage from '../assets/populationImage.webp';
import stoneImage from '../assets/stoneImage.webp';
import waterImage from '../assets/waterImage.webp';
import woodImage from '../assets/woodImage.webp';
import cryptotribeImage from "../assets/cryptotribeImage.webp";
import knowledgeImage from "../assets/knowledgeImage.webp";
import kohleImage from "../assets/knowledgeImage.webp";
import goldImage from "../assets/knowledgeImage.webp";
import militaryImage from "../assets/knowledgeImage.webp"; // BILD ÄNDERN!!! 

import "./App.css"; 

const Header = ({ userAddress, userAvatar, userName, userBalance, resources, capacityRates }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const closeDropdown = () => {
    setDropdownVisible(false);
  };

  const resourcesData = [
    { name: 'Water', value: Math.floor(resources.water), capacity: capacityRates.water, image: waterImage },
    { name: 'Food', value: Math.floor(resources.food), capacity: capacityRates.food, image: foodImage },
    { name: 'Wood', value: Math.floor(resources.wood), capacity: capacityRates.wood, image: woodImage },
    { name: 'Stone', value: Math.floor(resources.stone), capacity: capacityRates.stone, image: stoneImage },
    { name: 'Population', value: Math.floor(resources.population), capacity: capacityRates.population, image: populationImage },
    { name: 'Knowledge', value: Math.floor(resources.knowledge), capacity: capacityRates.knowledge, image: knowledgeImage },
    { name: 'Kohle', value: Math.floor(resources.kohle), capacity: capacityRates.kohle, image: kohleImage },
    { name: 'Gold', value: Math.floor(resources.gold), capacity: capacityRates.gold, image: goldImage },
    { name: 'Military', value: Math.floor(resources.military), capacity: capacityRates.military, image: militaryImage }
  ];

  return (
    <div className="header">
      <div className="logo"></div>
      <img src={cryptotribeImage} alt="Cryptotribe Logo" className="logo-icon" />
      <div className="resources">
        {resourcesData.map((resource, index) => (
          <div key={index} className="resource">
            <div className="resource-container">
              <img src={resource.image} alt={resource.name} className="resource-icon" />
              <div className="resource-tooltip">{resource.name}: {resource.value}/{resource.capacity}</div>
            </div>
            <span className="resource-amount">{resource.value}/{resource.capacity}</span>
          </div>
        ))}
        <div>Tribe [0:0:0]</div>
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
