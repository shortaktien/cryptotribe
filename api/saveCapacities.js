const saveCapacities = async (client, userName, capacities) => {
    const query = `
      INSERT INTO capacities_summary (user_name, water_capacity, food_capacity, wood_capacity, stone_capacity, knowledge_capacity, population_capacity, coal_capacity, gold_capacity, military_capacity, max_military_capacity, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      ON CONFLICT (user_name) DO UPDATE SET
      water_capacity = EXCLUDED.water_capacity,
      food_capacity = EXCLUDED.food_capacity,
      wood_capacity = EXCLUDED.wood_capacity,
      stone_capacity = EXCLUDED.stone_capacity,
      knowledge_capacity = EXCLUDED.knowledge_capacity,
      population_capacity = EXCLUDED.population_capacity,
      coal_capacity = EXCLUDED.coal_capacity,
      gold_capacity = EXCLUDED.gold_capacity,
      military_capacity = EXCLUDED.military_capacity,
      max_military_capacity = EXCLUDED.max_military_capacity,
      updated_at = EXCLUDED.updated_at
    `;
    const values = [
      userName,
      capacities.water, capacities.food, capacities.wood, capacities.stone,
      capacities.knowledge, capacities.population, capacities.coal, capacities.gold,
      capacities.military, capacities.maxMilitaryCapacity, new Date()
    ];
    await client.query(query, values);
  };
  
  module.exports = saveCapacities;
  