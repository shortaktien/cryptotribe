import { useMilitary } from '../components/MilitaryContext';

const useSaveGame = () => {
  const { getMilitaryData } = useMilitary();

  const saveGameProgress = async (userAddress, resources, buildings, updatedCapacityRates, economicPoints) => {
    const military = getMilitaryData();
  
    const buildingsWithBuildTimes = buildings.map(building => ({
      ...building,
      buildStartTime: building.buildStartTime || null,
      buildTimeRemaining: building.buildTimeRemaining || null,
    }));
  
    const dataToSend = {
      userAddress,
      resources,
      buildings: buildingsWithBuildTimes,
      capacities: updatedCapacityRates, // Verwende die Kapazitäten aus MainContent.js
      economic_points: economicPoints,
      military,
    };
  
    console.log('Final data to be sent to the API:', dataToSend);
  
    try {
      const response = await fetch('/api/saveGame', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });
  
      if (!response.ok) {
        const errorResponse = await response.text();
        throw new Error(`Failed to save game progress: ${errorResponse}`);
      }
  
      const data = await response.json();
      console.log('Game progress saved:', data.message);
    } catch (error) {
      console.error('Error saving game progress:', error);
    }
  };
  

  return saveGameProgress;
};

export default useSaveGame;
