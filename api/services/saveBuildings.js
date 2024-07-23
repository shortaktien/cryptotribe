const saveBuildings = async (client, userAddress, buildings, capacities) => {
    const buildingProgressQuery = `
      INSERT INTO building_progress (user_name, buildings, capacities)
      VALUES ($1, $2::json, $3::json)
      ON CONFLICT (user_name) 
      DO UPDATE SET 
        buildings = EXCLUDED.buildings,
        capacities = EXCLUDED.capacities
    `;
  
    const currentTime = new Date();
    const updatedBuildings = buildings.map(building => {
      if (building.isBuilding) {
        building.buildStartTime = building.buildStartTime || currentTime.toISOString();
        building.buildTimeRemaining = building.buildTimeRemaining || building.baseBuildTime;
      }
      return building;
    });
  
    const buildingProgressValues = [
      userAddress,
      JSON.stringify(updatedBuildings),
      JSON.stringify(capacities)
    ];
  
    await client.query(buildingProgressQuery, buildingProgressValues);
  };
  
  module.exports = {
    saveBuildings,
  };
  