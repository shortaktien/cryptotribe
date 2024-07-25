import React from 'react';
import { calculateGainedResources } from './calculateResources'; // Import the new function
import '../components/App.css';

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
    console.log('Time difference in seconds:', timeDifferenceInSeconds); // Debugging log

    const gainedResources = calculateGainedResources(productionRates, timeDifferenceInSeconds);
    console.log('Gained resources:', gainedResources); // Log the gained resources

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

    console.log(`User was away for ${formattedTime} and produced ${formattedResources}`); // Log the formatted time and resources

    return `You were away for ${formattedTime} and produced ${formattedResources}.`;
  }
  return null;
};

export const fetchNotificationData = async (userAddress) => {
  try {
    const response = await fetch(`/api/services/loadNotificationData?user_name=${userAddress}`);
    if (response.ok) {
      const data = await response.json();
      console.log('Fetched notification data:', data);
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
