import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import './App.css';

const Sidebar = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <div>
      <div className="sidebar">
        <ul>
          <li><Link to="/overview" className="sidebar-link">Overview</Link></li>
          <li><Link to="/buildings" className="sidebar-link">Buildings</Link></li>
          <li><Link to="/merchant" className="sidebar-link">Merchant</Link></li>
          <li><Link to="/research" className="sidebar-link">Research</Link></li>
          <li><Link to="/shipyard" className="sidebar-link">Shipyard</Link></li>
          <li><Link to="/defence" className="sidebar-link">Defence</Link></li>
          <li><Link to="/military" className="sidebar-link">Military</Link></li>
          <li><Link to="/world" className="sidebar-link">World</Link></li>
          <li><Link to="/alliance" className="sidebar-link">Alliance</Link></li>
          <li><Link to="/shop" className="sidebar-link">Shop</Link></li>
        </ul>
      </div>
      <div className="dropdown-menu">
        <button className="dropdown-toggle" onClick={toggleDropdown}>
          Menu
        </button>
        {dropdownVisible && (
          <div className="dropdown-content">
            <ul>
              <li><Link to="/overview" className="sidebar-link">Overview</Link></li>
              <li><Link to="/buildings" className="sidebar-link">Buildings</Link></li>
              <li><Link to="/merchant" className="sidebar-link">Merchant</Link></li>
              <li><Link to="/research" className="sidebar-link">Research</Link></li>
              <li><Link to="/shipyard" className="sidebar-link">Shipyard</Link></li>
              <li><Link to="/defence" className="sidebar-link">Defence</Link></li>
              <li><Link to="/military" className="sidebar-link">Military</Link></li>
              <li><Link to="/world" className="sidebar-link">World</Link></li>
              <li><Link to="/alliance" className="sidebar-link">Alliance</Link></li>
              <li><Link to="/shop" className="sidebar-link">Shop</Link></li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
