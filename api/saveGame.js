const { Client } = require('pg');

module.exports = async (req, res) => {
  const { userAddress, resources, buildings, capacities, economic_points, military } = req.body;

  if (!userAddress || !resources || !buildings || !capacities || economic_points === undefined || !military) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const client = new Client({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    await client.connect();

    const playerProgressQuery = `
      INSERT INTO player_progress (user_name, resources, economic_points, updated_at, military)
      VALUES ($1, $2::json, $3, $4, $5::json)
      ON CONFLICT (user_name) 
      DO UPDATE SET 
        resources = EXCLUDED.resources,
        economic_points = EXCLUDED.economic_points,
        updated_at = EXCLUDED.updated_at,
        military = EXCLUDED.military
    `;

    const buildingProgressQuery = `
      INSERT INTO building_progress (user_name, buildings, capacities)
      VALUES ($1, $2::json, $3::json)
      ON CONFLICT (user_name) 
      DO UPDATE SET 
        buildings = EXCLUDED.buildings,
        capacities = EXCLUDED.capacities
    `;

    const currentTime = new Date();
    const playerProgressValues = [
      userAddress,
      JSON.stringify(resources),
      economic_points,
      currentTime,
      JSON.stringify(military),
    ];

    const buildingProgressValues = [
      userAddress,
      JSON.stringify(buildings) || '{}',
      JSON.stringify(capacities),
    ];

    await client.query(playerProgressQuery, playerProgressValues);
    await client.query(buildingProgressQuery, buildingProgressValues);

    res.status(200).json({ message: 'Game progress saved successfully' });
  } catch (error) {
    console.error('Error updating game progress:', error);
    res.status(500).json({ error: 'Failed to save game progress' });
  } finally {
    await client.end();
  }
};
