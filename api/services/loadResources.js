const { connectToDatabase } = require('./database');

const loadResources = async (client, userName) => {
  const resourcesQuery = 'SELECT water, food, wood, stone, knowledge, population, coal, gold, military, updated_at FROM resources WHERE user_name = $1';
  const resourcesValues = [userName];
  const resourcesResult = await client.query(resourcesQuery, resourcesValues);

  if (resourcesResult.rows.length === 0) {
    throw new Error('User not found in resources');
  }

  return {
    resources: {
      water: resourcesResult.rows[0].water,
      food: resourcesResult.rows[0].food,
      wood: resourcesResult.rows[0].wood,
      stone: resourcesResult.rows[0].stone,
      knowledge: resourcesResult.rows[0].knowledge,
      population: resourcesResult.rows[0].population,
      coal: resourcesResult.rows[0].coal,
      gold: resourcesResult.rows[0].gold,
      military: resourcesResult.rows[0].military
    },
    updated_at: resourcesResult.rows[0].updated_at,
    
  };
};

module.exports = loadResources;
