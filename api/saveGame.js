// api/saveGame.js

const { connectToDatabase } = require('../api/services/database');
const saveResources = require('../api/services/saveResources');
const saveBuildings = require('../api/services/saveBuildings');
const saveMilitary = require('../api/services/saveMilitary');

module.exports = async (req, res) => {
  const { userAddress, resources, buildings, capacities, economic_points, military } = req.body;

  if (!userAddress || !resources || !buildings || !capacities || economic_points === undefined || !military) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const client = await connectToDatabase();

  try {
    const currentTime = new Date();
    const updatedBuildings = buildings.map(building => {
      if (building.isBuilding) {
        building.buildStartTime = building.buildStartTime || currentTime.toISOString();
        building.buildTimeRemaining = building.buildTimeRemaining || building.baseBuildTime;
      }
      return building;
    });

    await saveResources(client, userAddress, resources, economic_points);
    await saveBuildings(client, userAddress, updatedBuildings);
    await saveMilitary(client, userAddress, military);

    // Speichere die Aktualisierungszeit in player_progress
    const updateQuery = `UPDATE player_progress SET updated_at = $1, economic_points = $2 WHERE user_name = $3`;
    await client.query(updateQuery, [currentTime, economic_points, userAddress]);

    res.status(200).json({ message: 'Game progress saved successfully' });
  } catch (error) {
    console.error('Error updating game progress:', error);
    res.status(500).json({ error: 'Failed to save game progress' });
  } finally {
    await client.end();
  }
};
