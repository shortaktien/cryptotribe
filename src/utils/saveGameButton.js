const saveGameProgress = async (userAddress, resources) => {
  try {
    console.log('Saving game progress with:', { userAddress, resources }); // Debugging-Informationen
    const response = await fetch('/api/saveGame', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_name: userAddress, resources }),
    });

    if (response.ok) {
      console.log('Game progress saved successfully');
    } else {
      console.error('Failed to save game progress:', response.statusText);
    }
  } catch (error) {
    console.error('Error saving game progress:', error);
  }
};

export default saveGameProgress;
