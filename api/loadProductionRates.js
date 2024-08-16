const { connectToDatabase } = require('./services/database');

const loadProductionRates = async (client, userName) => {
  const productionRatesQuery = 'SELECT water_production, food_production, wood_production, stone_production, knowledge_production, population_production, coal_production, gold_production, military_production FROM production_rates_summary WHERE user_name = $1';
  const productionRatesValues = [userName];
  const productionRatesResult = await client.query(productionRatesQuery, productionRatesValues);

  if (productionRatesResult.rows.length === 0) {
    throw new Error('User not found in production_rates_summary');
  }

  return {
    productionRates: {
      water: productionRatesResult.rows[0].water_production,
      food: productionRatesResult.rows[0].food_production,
      wood: productionRatesResult.rows[0].wood_production,
      stone: productionRatesResult.rows[0].stone_production,
      knowledge: productionRatesResult.rows[0].knowledge_production,
      population: productionRatesResult.rows[0].population_production,
      coal: productionRatesResult.rows[0].coal_production,
      gold: productionRatesResult.rows[0].gold_production,
      military: productionRatesResult.rows[0].military_production
    }
  };
};

module.exports = loadProductionRates;
