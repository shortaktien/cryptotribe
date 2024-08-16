const saveResources = async (client, userAddress, resources, economic_points) => {
    const currentTime = new Date();
    const resourcesQuery = `
      INSERT INTO resources (user_name, water, food, wood, stone, knowledge, population, coal, gold, military, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      ON CONFLICT (user_name) 
      DO UPDATE SET 
        water = EXCLUDED.water,
        food = EXCLUDED.food,
        wood = EXCLUDED.wood,
        stone = EXCLUDED.stone,
        knowledge = EXCLUDED.knowledge,
        population = EXCLUDED.population,
        coal = EXCLUDED.coal,
        gold = EXCLUDED.gold,
        military = EXCLUDED.military,
        updated_at = EXCLUDED.updated_at
    `;
    const resourcesValues = [
      userAddress,
      resources.water,
      resources.food,
      resources.wood,
      resources.stone,
      resources.knowledge,
      resources.population,
      resources.coal,
      resources.gold,
      resources.military,
      currentTime,
    ];
  
    await client.query(resourcesQuery, resourcesValues);
  };
  
  module.exports = saveResources;
  