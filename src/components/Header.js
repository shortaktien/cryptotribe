import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
//import useResources from './SetResources';
import './App.css';

const Header = ({ userAddress, userAvatar, userName, userBalance, resources, population }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <div className="header">
      <div className="logo">Cryptotribe</div>
      <div className="resources">
        <div>Water: {resources.water}</div>
        <div>Food: {resources.food}</div>
        <div>Wood: {resources.wood}</div>
        <div>Stone: {resources.stone}</div>
        <div>Population: {resources.population}</div>
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
            <p>Profile: {userName}</p>
            <p>Adress: {userAddress}</p>
            <p>Balance: {userBalance}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;