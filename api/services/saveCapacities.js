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
    updated_at = EXCLUDED.updated_at;
  `;

  const values = [
    userName,
    Math.round(capacities.water || 0),               // Runden auf ganze Zahl
    Math.round(capacities.food || 0),                // Runden auf ganze Zahl
    Math.round(capacities.wood || 0),                // Runden auf ganze Zahl
    Math.round(capacities.stone || 0),               // Runden auf ganze Zahl
    Math.round(capacities.knowledge || 0),           // Runden auf ganze Zahl
    Math.round(capacities.population || 0),          // Runden auf ganze Zahl
    Math.round(capacities.coal || 0),                // Runden auf ganze Zahl
    Math.round(capacities.gold || 0),                // Runden auf ganze Zahl
    Math.round(capacities.military || 0),            // Runden auf ganze Zahl
    Math.round(capacities.maxMilitaryCapacity || 0), // Runden auf ganze Zahl
    new Date().toISOString()
  ];

  await client.query(query, values);
};

module.exports = saveCapacities;
