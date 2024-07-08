import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBuildings } from './BuildingsContext';
import useResources from './SetResources';
import useSaveGame from '../utils/saveGameButton';
import { useMilitary } from './MilitaryContext';
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
import './sidebar.css';

const Sidebar = ({ userAddress, resources, economicPoints }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { buildings } = useBuildings();
  const { capacityRates } = useResources();
  const saveGameProgress = useSaveGame();
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleMenuClick = (path) => {
    setDropdownVisible(false);
    navigate(path);
  };

  const handleSaveGame = async () => {
    setSaving(true);
    setSaveSuccess(false);
    const currentCapacities = capacityRates;
    console.log('Current capacities:', currentCapacities);
    console.log('Saving game with:', { userAddress, resources, buildings, capacities: currentCapacities, economic_points: economicPoints });
    await saveGameProgress(userAddress, resources, buildings, currentCapacities, economicPoints);
    setSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const isScienceBuilt = buildings.some(building => building.name === 'Science' && building.currentLevel > 0);
  const isBarracksBuilt = buildings.some(building => building.name === 'Barracks' && building.currentLevel > 0);
  const isFortresBuilt = buildings.some(building => building.name === "Fortifications" && building.currentLevel > 0);
  const isShipyardBuilt = buildings.some(building => building.name === "Harbor" && building.currentLevel > 0);
  const isMerchantBuilt = buildings.some(building => building.name === "Merchant" && building.currentLevel > 0);

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
          <li className={isScienceBuilt ? '' : 'disabled'}>
            <Link to="/research" className={`sidebar-link ${isScienceBuilt ? '' : 'disabled-link'}`}>
              <img src={researchImage} alt="Research" className="sidebar-icon" /> Research
            </Link>
          </li>
          <li className={isMerchantBuilt ? '' : 'disabled'}>
            <Link to="/merchant" className={`sidebar-link ${isMerchantBuilt ? '' : 'disabled-link'}`}>
              <img src={merchantImage} alt="Merchant" className="sidebar-icon" /> Merchant
            </Link>
          </li>
          <li className={isShipyardBuilt ? '' : 'disabled'}>
            <Link to="/shipyard" className={`sidebar-link ${isShipyardBuilt ? '' : 'disabled-link'}`}>
              <img src={shipyardImage} alt="Shipyard" className="sidebar-icon" /> Shipyard
            </Link>
          </li>
          <li className={isFortresBuilt ? '' : 'disabled'}>
            <Link to="/defence" className={`sidebar-link ${isFortresBuilt ? '' : 'disabled-link'}`}>
              <img src={defenceImage} alt="Defence" className="sidebar-icon" /> Defence
            </Link>
          </li>
          <li className={isBarracksBuilt ? '' : 'disabled'}>
            <Link to="/military" className={`sidebar-link ${isBarracksBuilt ? '' : 'disabled-link'}`}>
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
        <button 
          className={`save-game-button ${saving ? 'saving' : ''} ${saveSuccess ? 'success' : ''}`} 
          onClick={handleSaveGame}
          disabled={saving}
        >
          {saving ? 'Saving...' : saveSuccess ? 'Game Saved' : 'Save Game'}
          {saving && <div className="progress-bar"></div>}
        </button>
      </div>
      <div className="dropdown-menu">
        <button className="dropdown-toggle" onClick={toggleDropdown}>
          Menu
        </button>
        {dropdownVisible && (
          <div className="dropdown-content">
            <ul className="icon-only">
              <li>
                <button className="sidebar-link" onClick={() => handleMenuClick('/overview')}>
                  <img src={overviewImage} alt="Overview" className="sidebar-icon" />
                </button>
              </li>
              <li>
                <button className="sidebar-link" onClick={() => handleMenuClick('/buildings')}>
                  <img src={buildingsImage} alt="Buildings" className="sidebar-icon" />
                </button>
              </li>
              <li className={isScienceBuilt ? '' : 'disabled'}>
                <button className={`sidebar-link ${isScienceBuilt ? '' : 'disabled-link'}`} onClick={() => handleMenuClick('/research')}>
                  <img src={researchImage} alt="Research" className="sidebar-icon" />
                </button>
              </li>
              <li className={isMerchantBuilt ? '' : 'disabled'}>
                <button className={`sidebar-link ${isMerchantBuilt ? '' : 'disabled-link'}`} onClick={() => handleMenuClick('/merchant')}>
                  <img src={merchantImage} alt="Merchant" className="sidebar-icon" />
                </button>
              </li>
              <li className={isShipyardBuilt ? '' : 'disabled'}>
                <button className={`sidebar-link ${isShipyardBuilt ? '' : 'disabled-link'}`} onClick={() => handleMenuClick('/shipyard')}>
                  <img src={shipyardImage} alt="Shipyard" className="sidebar-icon" />
                </button>
              </li>
              <li className={isFortresBuilt ? '' : 'disabled'}>
                <button className={`sidebar-link ${isFortresBuilt ? '' : 'disabled-link'}`} onClick={() => handleMenuClick('/defence')}>
                  <img src={defenceImage} alt="Defence" className="sidebar-icon" />
                </button>
              </li>
              <li className={isBarracksBuilt ? '' : 'disabled'}>
                <button className={`sidebar-link ${isBarracksBuilt ? '' : 'disabled-link'}`} onClick={() => handleMenuClick('/military')}>
                  <img src={militaryImage} alt="Military" className="sidebar-icon" />
                </button>
              </li>
              <li>
                <button className="sidebar-link" onClick={() => handleMenuClick('/world')}>
                  <img src={worldImage} alt="World" className="sidebar-icon" />
                </button>
              </li>
              <li>
                <button className="sidebar-link" onClick={() => handleMenuClick('/alliance')}>
                  <img src={allianceImage} alt="Alliance" className="sidebar-icon" />
                </button>
              </li>
              <li>
                <button className="sidebar-link" onClick={() => handleMenuClick('/shop')}>
                  <img src={shopImage} alt="Shop" className="sidebar-icon" />
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
