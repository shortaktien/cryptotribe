const { connectToDatabase } = require('./database');

const loadResources = async (userName) => {
  const client = await connectToDatabase();
  const resourcesQuery = 'SELECT resources, updated_at, economic_points, military FROM player_progress WHERE user_name = $1';
  const resourcesValues = [userName];
  const resourcesResult = await client.query(resourcesQuery, resourcesValues);
  await client.end();
  
  if (resourcesResult.rows.length === 0) {
    throw new Error('User not found in player_progress');
  }

  return resourcesResult.rows[0];
};

module.exports = {
  loadResources,
};
