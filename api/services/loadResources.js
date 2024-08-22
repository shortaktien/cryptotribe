const { connectToDatabase } = require('./database');

const loadResources = async (client, userName) => {
  const resourcesQuery = 'SELECT water, food, wood, stone, knowledge, population, coal, gold, military, updated_at FROM resources WHERE user_name = $1';
  const resourcesValues = [userName];
  const resourcesResult = await client.query(resourcesQuery, resourcesValues);

  if (resourcesResult.rows.length === 0) {
    throw new Error('User not found in resources');
  }

  const { water, food, wood, stone, knowledge, population, coal, gold, military, updated_at } = resourcesResult.rows[0];

  return {
    water, food, wood, stone, knowledge, population, coal, gold, military, updated_at,
  };
};

module.exports = loadResources;

