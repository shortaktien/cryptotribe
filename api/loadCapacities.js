const { connectToDatabase } = require('./services/database');
const calculateWarehouseCapacities = require('../src/utils/calculateWarehouseCapacities'); // Nehmen wir an, es gibt eine Funktion zur Berechnung der Kapazitäten basierend auf dem Warehouse-Level

module.exports = async function loadCapacities(client, user_name) {
  const query = `SELECT * FROM capacities_summary WHERE user_name = $1`;
  const result = await client.query(query, [user_name]);

  if (result.rows.length === 0) {
    throw new Error('User not found');
  }

  const loadedCapacities = result.rows[0];

  // Angenommen, es gibt eine Funktion zur Berechnung der Kapazitäten basierend auf dem aktuellen Level des Warehouse
  const currentWarehouseLevel = await getCurrentWarehouseLevel(client, user_name); // Diese Funktion muss implementiert werden
  const calculatedCapacities = calculateWarehouseCapacities(currentWarehouseLevel);

  // Vergleichen der geladenen Kapazitäten mit den berechneten Kapazitäten
  const capacitiesAreDifferent = Object.keys(calculatedCapacities).some(key => {
    return loadedCapacities[`${key}_capacity`] !== calculatedCapacities[key];
  });

  if (capacitiesAreDifferent) {
    // Falls die Kapazitäten unterschiedlich sind, aktualisieren wir sie in der Datenbank
    const updateQuery = `
      UPDATE capacities_summary
      SET 
        water_capacity = $1,
        food_capacity = $2,
        wood_capacity = $3,
        stone_capacity = $4,
        knowledge_capacity = $5,
        population_capacity = $6,
        coal_capacity = $7,
        gold_capacity = $8,
        military_capacity = $9,
        max_military_capacity = $10,
        updated_at = $11
      WHERE user_name = $12
    `;
    const updateValues = [
      calculatedCapacities.water,
      calculatedCapacities.food,
      calculatedCapacities.wood,
      calculatedCapacities.stone,
      calculatedCapacities.knowledge,
      calculatedCapacities.population,
      calculatedCapacities.coal,
      calculatedCapacities.gold,
      calculatedCapacities.military,
      calculatedCapacities.maxMilitaryCapacity,
      new Date(),
      user_name
    ];
    await client.query(updateQuery, updateValues);

    return calculatedCapacities;
  }

  return loadedCapacities;
};
