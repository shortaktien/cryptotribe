import { Link } from 'react-router-dom';
import React, { useState } from 'react';

import allianceImage from "../assets/allianceImage.webp";
import buildingsImage from "../assets/buildingsImage.webp";
import defenceImage from "../assets/defenceImage.webp";
import merchantImage from "../assets/merchantImage.webp";
import militaryImage from "../assets/militaryImage.webp";
import overviewImage from "../assets/overviewImage.webp";
import researchImage from "../assets/researchImage.webp";
import shipyardImage from "../assets/shipyardImage.webp";
import shopImage from "../assets/shopImage.webp";
import worldImage from "../assets/worldImage.webp";

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
            <li>
              <Link to="/overview" className="sidebar-link">
                <img src={overviewImage} alt="Overview" className="sidebar-icon" /> Overview
              </Link>
            </li>
            <li>
              <Link to="/buildings" className="sidebar-link">
                <img src={buildingsImage} alt="Buildings" className="sidebar-icon" /> Buildings
              </Link>
            </li>
            <li>
              <Link to="/merchant" className="sidebar-link">
                <img src={merchantImage} alt="Merchant" className="sidebar-icon" /> Merchant
              </Link>
            </li>
            <li>
              <Link to="/research" className="sidebar-link">
                <img src={researchImage} alt="Research" className="sidebar-icon" /> Research
              </Link>
            </li>
            <li>
              <Link to="/shipyard" className="sidebar-link">
                <img src={shipyardImage} alt="Shipyard" className="sidebar-icon" /> Shipyard
              </Link>
            </li>
            <li>
              <Link to="/defence" className="sidebar-link">
                <img src={defenceImage} alt="Defence" className="sidebar-icon" /> Defence
              </Link>
            </li>
            <li>
              <Link to="/military" className="sidebar-link">
                <img src={militaryImage} alt="Military" className="sidebar-icon" /> Military
              </Link>
            </li>
            <li>
              <Link to="/world" className="sidebar-link">
                <img src={worldImage} alt="World" className="sidebar-icon" /> World
              </Link>
            </li>
            <li>
              <Link to="/alliance" className="sidebar-link">
                <img src={allianceImage} alt="Alliance" className="sidebar-icon" /> Alliance
              </Link>
            </li>
            <li>
              <Link to="/shop" className="sidebar-link">
                <img src={shopImage} alt="Shop" className="sidebar-icon" /> Shop
              </Link>
            </li>
          </ul>
        </div>
        <div className="dropdown-menu">
          <button className="dropdown-toggle" onClick={toggleDropdown}>
            Menu
          </button>
          {dropdownVisible && (
            <div className="dropdown-content">
              <ul className="icon-only">
                <li>
                  <Link to="/overview" className="sidebar-link">
                    <img src={overviewImage} alt="Overview" className="sidebar-icon" />
                  </Link>
                </li>
                <li>
                  <Link to="/buildings" className="sidebar-link">
                    <img src={buildingsImage} alt="Buildings" className="sidebar-icon" />
                  </Link>
                </li>
                <li>
                  <Link to="/merchant" className="sidebar-link">
                    <img src={merchantImage} alt="Merchant" className="sidebar-icon" />
                  </Link>
                </li>
                <li>
                  <Link to="/research" className="sidebar-link">
                    <img src={researchImage} alt="Research" className="sidebar-icon" />
                  </Link>
                </li>
                <li>
                  <Link to="/shipyard" className="sidebar-link">
                    <img src={shipyardImage} alt="Shipyard" className="sidebar-icon" />
                  </Link>
                </li>
                <li>
                  <Link to="/defence" className="sidebar-link">
                    <img src={defenceImage} alt="Defence" className="sidebar-icon" />
                  </Link>
                </li>
                <li>
                  <Link to="/military" className="sidebar-link">
                    <img src={militaryImage} alt="Military" className="sidebar-icon" />
                  </Link>
                </li>
                <li>
                  <Link to="/world" className="sidebar-link">
                    <img src={worldImage} alt="World" className="sidebar-icon" />
                  </Link>
                </li>
                <li>
                  <Link to="/alliance" className="sidebar-link">
                    <img src={allianceImage} alt="Alliance" className="sidebar-icon" />
                  </Link>
                </li>
                <li>
                  <Link to="/shop" className="sidebar-link">
                    <img src={shopImage} alt="Shop" className="sidebar-icon" />
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  export default Sidebar;
