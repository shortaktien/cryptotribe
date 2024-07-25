const { connectToDatabase } = require('../api/services/database');

module.exports = async (req, res) => {
  const { user_name } = req.query;

  if (!user_name) {
    return res.status(400).json({ error: 'User name is required' });
  }

  let client;
  try {
    client = await connectToDatabase();
    const productionRatesQuery = `
      SELECT water_production, food_production, wood_production, stone_production, knowledge_production, 
             population_production, coal_production, gold_production, military_production 
      FROM production_rates_summary 
      WHERE user_name = $1
    `;
    const result = await client.query(productionRatesQuery, [user_name]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Production rates not found for user' });
    }

    const productionRates = result.rows[0];
    res.status(200).json({ productionRates });
  } catch (error) {
    console.error('Error loading production rates:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  } finally {
    if (client) {
      await client.end();
    }
  }
};
