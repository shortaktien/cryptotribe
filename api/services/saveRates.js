const saveProductionRates = async (client, userName, productionRates) => {
    const query = `
      INSERT INTO production_rates (user_name, water, food, wood, stone, knowledge, population, coal, gold)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (user_name) DO UPDATE SET
      water = EXCLUDED.water,
      food = EXCLUDED.food,
      wood = EXCLUDED.wood,
      stone = EXCLUDED.stone,
      knowledge = EXCLUDED.knowledge,
      population = EXCLUDED.population,
      coal = EXCLUDED.coal,
      gold = EXCLUDED.gold
    `;
    const values = [
      userName,
      productionRates.water, productionRates.food, productionRates.wood, productionRates.stone,
      productionRates.knowledge, productionRates.population, productionRates.coal, productionRates.gold
    ];
    await client.query(query, values);
  };
  
  module.exports = saveProductionRates;
  