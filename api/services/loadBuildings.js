// services/loadBuildings.js

const { connectToDatabase } = require('./database');

const loadBuildings = async (client, userName) => {
  const buildingsQuery = `
    SELECT 
      lumberjack_level, lumberjack_is_building, lumberjack_build_start_time, lumberjack_build_time_remaining,
      stonemason_level, stonemason_is_building, stonemason_build_start_time, stonemason_build_time_remaining,
      warehouse_level, warehouse_is_building, warehouse_build_start_time, warehouse_build_time_remaining,
      house_level, house_is_building, house_build_start_time, house_build_time_remaining,
      farm_level, farm_is_building, farm_build_start_time, farm_build_time_remaining,
      drawing_well_level, drawing_well_is_building, drawing_well_build_start_time, drawing_well_build_time_remaining,
      science_level, science_is_building, science_build_start_time, science_build_time_remaining,
      kohlemine_level, kohlemine_is_building, kohlemine_build_start_time, kohlemine_build_time_remaining,
      goldmine_level, goldmine_is_building, goldmine_build_start_time, goldmine_build_time_remaining,
      barracks_level, barracks_is_building, barracks_build_start_time, barracks_build_time_remaining,
      fortifications_level, fortifications_is_building, fortifications_build_start_time, fortifications_build_time_remaining,
      harbor_level, harbor_is_building, harbor_build_start_time, harbor_build_time_remaining,
      merchant_level, merchant_is_building, merchant_build_start_time, merchant_build_time_remaining
    FROM buildings_summary 
    WHERE user_name = $1`;
  const buildingsValues = [userName];
  const buildingsResult = await client.query(buildingsQuery, buildingsValues);

  if (buildingsResult.rows.length === 0) {
    throw new Error('User not found in buildings_summary');
  }

  return buildingsResult.rows[0];
};

module.exports = loadBuildings;
