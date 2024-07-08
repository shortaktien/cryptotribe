export default async function saveGameProgress(userAddress, resources, buildings, capacities, economicPoints, military) {
  try {
    console.log('Military data before saving:', military);

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

    const totalUnits = Object.values(military).reduce((acc, count) => acc + count, 0); // Korrigierte Berechnung
    console.log(`Saved military units: ${totalUnits}`);
  } catch (error) {
    console.error('Error saving game progress:', error);
  }
}
