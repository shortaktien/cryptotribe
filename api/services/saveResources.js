const saveResources = async (client, userAddress, resources, economic_points, military) => {
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
  
    const currentTime = new Date();
    const playerProgressValues = [
      userAddress,
      JSON.stringify(resources),
      economic_points,
      currentTime,
      JSON.stringify(military),
    ];
  
    await client.query(playerProgressQuery, playerProgressValues);
  };
  
  module.exports = {
    saveResources,
  };
  