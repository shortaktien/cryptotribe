import { useMilitary } from '../components/MilitaryContext';

const useSaveGame = () => {
  const { getMilitaryData } = useMilitary();

  const saveGameProgress = async (userAddress, resources, buildings, capacities, economicPoints) => {
    const military = getMilitaryData();

    try {
      console.log('Military data before saving:', military);
      console.log('Buildings data before saving:', buildings);
      console.log('Capacities data before saving:', capacities);

      const response = await fetch('/api/saveGame', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userAddress,
          resources,
          buildings,
          capacities,
          economic_points: economicPoints,
          military,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save game progress');
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