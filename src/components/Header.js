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

const Header = ({ userAddress, userAvatar, userName, userBalance, resources = {}, capacities = {}, nickname }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [highlightedResources, setHighlightedResources] = useState({});
  const [previousResources, setPreviousResources] = useState(resources);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const closeDropdown = () => {
    setDropdownVisible(false);
  };

  useEffect(() => {
    const newHighlightedResources = {};
  
    // Iteriere über alle Ressourcen
    Object.keys(resources).forEach(key => {
      // Kurzzeitiges Grün-Aufleuchten, wenn die Ressource zugenommen hat
      if (resources[key] > (previousResources[key] || 0)) {
        newHighlightedResources[key] = 'highlight-green';
      }
      // Wenn die Ressource die Kapazität erreicht oder überschreitet, bleibt sie rot
      else if (capacities[key] && resources[key] >= capacities[key]) {
        newHighlightedResources[key] = 'highlight-red';
      }
      // Weiß für alle anderen Fälle
      else {
        newHighlightedResources[key] = '';
      }
    });
  
    setHighlightedResources(newHighlightedResources);
    setPreviousResources(resources);
  
    // Timer zum Entfernen des Grün-Aufleuchtens nach 1 Sekunde, es bleibt rot, wenn Kapazität erreicht
    const timer = setTimeout(() => {
      const resetHighlights = { ...newHighlightedResources };
      Object.keys(resetHighlights).forEach(key => {
        if (resetHighlights[key] === 'highlight-green') {
          // Nur auf Weiß zurücksetzen, wenn nicht gleichzeitig die Kapazität erreicht ist
          if (capacities[key] && resources[key] >= capacities[key]) {
            resetHighlights[key] = 'highlight-red'; // Behalte Rot bei, wenn Kapazität erreicht
          } else {
            resetHighlights[key] = ''; // Zurücksetzen auf Weiß
          }
        }
      });
      setHighlightedResources(resetHighlights);
    }, 1000);
  
    return () => clearTimeout(timer);
  }, [resources, capacities, previousResources]);
  

  // Nur die aktuellen Ressourcen anzeigen, ohne Kapazitäten in der Anzeige
  const resourcesData = resources ? [
    { name: 'Water', value: Math.floor(resources.water), image: waterImage },
    { name: 'Food', value: Math.floor(resources.food), image: foodImage },
    { name: 'Wood', value: Math.floor(resources.wood), image: woodImage },
    { name: 'Stone', value: Math.floor(resources.stone), image: stoneImage },
    { name: 'Coal', value: Math.floor(resources.coal), image: coalImage },
    { name: 'Gold', value: Math.floor(resources.gold), image: goldImage },
    { name: 'Knowledge', value: Math.floor(resources.knowledge), image: knowledgeImage },
    { name: 'Population', value: Math.floor(resources.population), image: populationImage },
    { name: 'Military', value: Math.floor(resources.military), image: militaryImage }
  ] : [];

  
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
            <span className={`resource-amount ${highlightedResources[resource.name.toLowerCase()]}`}>
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
