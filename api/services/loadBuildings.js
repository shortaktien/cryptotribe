const { connectToDatabase } = require('./database');

const loadBuildings = async (userName) => {
  const client = await connectToDatabase();
  const buildingsQuery = 'SELECT buildings, capacities FROM building_progress WHERE user_name = $1';
  const buildingsValues = [userName];
  const buildingsResult = await client.query(buildingsQuery, buildingsValues);
  await client.end();
  
  if (buildingsResult.rows.length === 0) {
    throw new Error('User not found in building_progress');
  }

  return buildingsResult.rows[0];
};

module.exports = {
  loadBuildings,
};
