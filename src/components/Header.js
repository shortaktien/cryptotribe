import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';

import foodImage from '../assets/foodImage.webp';
import populationImage from '../assets/populationImage.webp';
import stoneImage from '../assets/stoneImage.webp';
import waterImage from '../assets/waterImage.webp';
import woodImage from '../assets/woodImage.webp';
import cryptotribeImage from "../assets/cryptotribeImage.webp";
import knowledgeImage from "../assets/knowledgeImage.webp";

import "./App.css"; // Stellen Sie sicher, dass der korrekte Pfad verwendet wird

const Header = ({ userAddress, userAvatar, userName, userBalance, resources }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const resourcesData = [
    { name: 'Water', value: resources.water, image: waterImage },
    { name: 'Food', value: resources.food, image: foodImage },
    { name: 'Wood', value: resources.wood, image: woodImage },
    { name: 'Stone', value: resources.stone, image: stoneImage },
    { name: 'Population', value: resources.population, image: populationImage },
    { name: 'Science', value: resources.knowledge, image: knowledgeImage }
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
              <div className="resource-tooltip">{resource.name}</div>
            </div>
            <span className="resource-amount">{resource.value}</span>
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
          <div className="dropdown">
            <p>Address: {userAddress}</p>
            <p>Balance: {userName}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
