import React from 'react';
import { calculateGainedResources } from './calculateResources'; // Importiere die Berechnungsfunktion
import '../components/App.css';

let offlineResources = null; // Definiere offlineResources außerhalb der Funktion

const Notification = ({ message, show }) => {
  if (!show) return null;

  return (
    <div className="notification-container">
      <div className="notification">
        {message}
      </div>
    </div>
  );
};

export const calculateNotificationMessage = (lastSaveTime, currentTime, productionRates) => {
  console.log('Last save game time:', lastSaveTime);
  console.log('Current time:', currentTime);

  if (lastSaveTime && currentTime) {
    const timeDifferenceInSeconds = (new Date(currentTime) - new Date(lastSaveTime)) / 1000;
    
    const gainedResources = calculateGainedResources(productionRates, timeDifferenceInSeconds);

    const formatTimeDifference = (seconds) => {
      if (seconds < 60) return `${seconds} seconds`;
      if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes`;
      if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours`;
      return `${Math.floor(seconds / 86400)} days`;
    };

    const formattedTime = formatTimeDifference(timeDifferenceInSeconds);
    const formattedResources = Object.entries(gainedResources)
      .map(([resource, amount]) => `${Math.ceil(amount)} ${resource}`)
      .join(', ');

    console.log(`User was away for ${formattedTime} and produced ${formattedResources}`);

    // Aktualisiere offlineResources statt sie zu exportieren
    offlineResources = {
      timeAway: formattedTime,
      resources: gainedResources
    };

    console.log('Offline resources:', offlineResources);

    return `You were away for ${formattedTime} and produced ${formattedResources}.`;
  }
  return null;
};

// Funktion, um auf offlineResources zuzugreifen
export const getOfflineResources = () => {
  return offlineResources;
};

export const fetchNotificationData = async (userAddress) => {
  try {
    const response = await fetch(`/api/services/loadNotificationData?user_name=${userAddress}`);
    if (response.ok) {
      const data = await response.json();
      console.log('Fetched notification data:', data);

      // Mappe 'last_savegame' auf 'lastSaveTime', wenn es in der API-Antwort enthalten ist
      if (data.last_savegame) {
        data.lastSaveTime = data.last_savegame;
      }

      return data;
    } else {
      console.error('Failed to load notification data:', response.statusText);
      return null;
    }
  } catch (error) {
    console.error('Error fetching notification data:', error);
    return null;
  }
};


export default Notification;
