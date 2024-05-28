import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';

import foodImage from '../assets/foodImage.webp';
import populationImage from '../assets/populationImage.webp';
import stoneImage from '../assets/stoneImage.webp';
import waterImage from '../assets/waterImage.webp';
import woodImage from '../assets/woodImage.webp';
import cryptotribeImage from "../assets/cryptotribeImage.webp";

import "./App.css"; // Stelle sicher, dass du den korrekten Pfad verwendest

const Header = ({ userAddress, userAvatar, userName, userBalance, resources }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <div className="header">
      <div className="logo"></div>
      <img src={cryptotribeImage} alt="Cryptotribe Logo" className="logo-icon" />
      <div className="resources">
        <div className="resource">
          <img src={waterImage} alt="Water" className="resource-icon" />
          <span>Water: {resources.water}</span>
        </div>
        <div className="resource">
          <img src={foodImage} alt="Food" className="resource-icon" />
          <span>Food: {resources.food}</span>
        </div>
        <div className="resource">
          <img src={woodImage} alt="Wood" className="resource-icon" />
          <span>Wood: {resources.wood}</span>
        </div>
        <div className="resource">
          <img src={stoneImage} alt="Stone" className="resource-icon" />
          <span>Stone: {resources.stone}</span>
        </div>
        <div className="resource">
          <img src={populationImage} alt="Population" className="resource-icon" />
          <span>Population: {resources.population}</span>
        </div>
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
