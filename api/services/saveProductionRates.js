const saveProductionRates = async (client, userName, productionRates) => {
    const query = `
      INSERT INTO production_rates_summary (user_name, water_production, food_production, wood_production, stone_production, knowledge_production, population_production, coal_production, gold_production, military_production, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      ON CONFLICT (user_name) DO UPDATE SET
      water_production = EXCLUDED.water_production,
      food_production = EXCLUDED.food_production,
      wood_production = EXCLUDED.wood_production,
      stone_production = EXCLUDED.stone_production,
      knowledge_production = EXCLUDED.knowledge_production,
      population_production = EXCLUDED.population_production,
      coal_production = EXCLUDED.coal_production,
      gold_production = EXCLUDED.gold_production,
      military_production = EXCLUDED.military_production,
      updated_at = EXCLUDED.updated_at
    `;
    const values = [
      userName,
      productionRates.water, productionRates.food, productionRates.wood, productionRates.stone,
      productionRates.knowledge, productionRates.population, productionRates.coal, productionRates.gold,
      productionRates.military, new Date()
    ];
    await client.query(query, values);
  };
  
  module.exports = saveProductionRates;
  