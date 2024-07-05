export default async function saveGameProgress(userAddress, resources, buildings, capacities, economicPoints) {
  try {
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
}
