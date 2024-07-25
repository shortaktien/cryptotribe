const { connectToDatabase } = require('../api/services/database');
const saveResources = require('../api/services/saveResources');
const saveBuildings = require('../api/services/saveBuildings');
const saveMilitary = require('../api/services/saveMilitary');

const checkUserExists = async (client, userName) => {
  const result = await client.query('SELECT 1 FROM users WHERE user_name = $1', [userName]);
  return result.rows.length > 0;
};

module.exports = async (req, res) => {
  const { userAddress, resources, buildings, capacities, economic_points, military } = req.body;

  if (!userAddress || !resources || !buildings || !capacities || economic_points === undefined || !military) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const client = await connectToDatabase();

  try {
    // Überprüfen, ob der Benutzer bereits existiert
    const userExists = await checkUserExists(client, userAddress);
    
    if (!userExists) {
      // Wenn der Benutzer nicht existiert, füge ihn in die users-Tabelle ein
      await client.query(
        `INSERT INTO users (user_name, login_time, last_saveGame) 
         VALUES ($1, $2, $3)
         ON CONFLICT (user_name) 
         DO UPDATE SET login_time = EXCLUDED.login_time`,
        [userAddress, new Date(), new Date()]
      );
      console.log('New player added:', userAddress);
    } else {
      console.log('Existing player found:', userAddress);
    }

    const currentTime = new Date();
    const updatedBuildings = buildings.map(building => {
      if (building.isBuilding) {
        building.buildStartTime = building.buildStartTime || currentTime.toISOString();
        building.buildTimeRemaining = building.buildTimeRemaining || building.baseBuildTime;
      }
      return {
        ...building,
        currentLevel: typeof building.currentLevel === 'object' ? building.currentLevel.level : building.currentLevel || 0
      };
    });

    console.log('Saving game for user:', userAddress);
    console.log('Resources:', resources);
    console.log('Buildings:', updatedBuildings);
    console.log('Capacities:', capacities);
    console.log('Economic points:', economic_points);
    console.log('Military:', military);

    await saveResources(client, userAddress, resources, economic_points);
    await saveBuildings(client, userAddress, updatedBuildings);
    await saveMilitary(client, userAddress, military);

    // Speichere die Aktualisierungszeit in player_progress
    const updateQuery = `UPDATE player_progress SET updated_at = $1, economic_points = $2 WHERE user_name = $3`;
    await client.query(updateQuery, [currentTime, economic_points, userAddress]);

    // Speichere last_saveGame in der users Tabelle
    const saveGameTimeQuery = `UPDATE users SET last_saveGame = $1 WHERE user_name = $2`;
    await client.query(saveGameTimeQuery, [currentTime, userAddress]);

    res.status(200).json({ message: 'Game progress saved successfully' });
  } catch (error) {
    console.error('Error updating game progress:', error);
    res.status(500).json({ error: 'Failed to save game progress' });
  } finally {
    await client.end();
  }
};
