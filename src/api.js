import axios from 'axios';

const API_URL = 'https://cryptotribe.vercel.app'; // Ersetze <your-vercel-project> mit deinem Vercel-Projektnamen

export const registerPlayer = async (address) => {
  try {
    const response = await axios.post(`${API_URL}/register`, { address });
    return response.data.playerId;
  } catch (error) {
    console.error('Error registering player:', error);
    throw error;
  }
};

export const saveBuilding = async (playerId, type, level, position) => {
  try {
    await axios.post(`${API_URL}/buildings`, { playerId, type, level, position });
  } catch (error) {
    console.error('Error saving building:', error);
    throw error;
  }
};

export const saveUnits = async (playerId, type, count) => {
  try {
    await axios.post(`${API_URL}/units`, { playerId, type, count });
  } catch (error) {
    console.error('Error saving units:', error);
    throw error;
  }
};

export const getGameState = async (address) => {
  try {
    const response = await axios.get(`${API_URL}/state/${address}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching game state:', error);
    throw error;
  }
};
