const { connectToDatabase } = require('./services/database');

const loadBuildings = async (client, userName) => {
  const buildingsQuery = 'SELECT * FROM buildings_level WHERE user_name = $1';
  const buildingsValues = [userName];
  const buildingsResult = await client.query(buildingsQuery, buildingsValues);

  if (buildingsResult.rows.length === 0) {
    throw new Error('User not found in buildings');
  }

  const row = buildingsResult.rows[0];

  const buildings = {
    lumberjack: { level: row.lumberjack_level || 0 },
    stonemason: { level: row.stonemason_level || 0 },
    warehouse: { level: row.warehouse_level || 0 },
    house: { level: row.house_level || 0 },
    farm: { level: row.farm_level || 0 },
    drawing_well: { level: row.drawing_well_level || 0 },
    science: { level: row.science_level || 0 },
    kohlemine: { level: row.kohlemine_level || 0 },
    goldmine: { level: row.goldmine_level || 0 },
    barracks: { level: row.barracks_level || 0 },
    fortifications: { level: row.fortifications_level || 0 },
    harbor: { level: row.harbor_level || 0 },
    merchant: { level: row.merchant_level || 0 }
  };

  return { buildings };
};

module.exports = loadBuildings;
