const { connectToDatabase } = require('./services/database');
const calculateWarehouseCapacities = require('../src/utils/calculateWarehouseCapacities'); // Pfad überprüfen

async function getCurrentWarehouseLevel(client, user_name) {
  // Tabelle `buildings_level` verwenden
  const query = `SELECT warehouse_level FROM buildings_level WHERE user_name = $1`;
  const result = await client.query(query, [user_name]);

  if (result.rows.length === 0) {
    throw new Error('Warehouse level not found for the user');
  }

  return result.rows[0].warehouse_level;
}

module.exports = async function loadCapacities(client, user_name) {
  console.log("loadCapacities function called");
  const query = `SELECT * FROM capacities_summary WHERE user_name = $1`;
  const result = await client.query(query, [user_name]);

  if (result.rows.length === 0) {
    throw new Error('User not found');
  }

  const loadedCapacities = result.rows[0];
  console.log("Loaded Capacities from DB:", loadedCapacities);

  // Abfrage des aktuellen Warehouse-Levels und Berechnung der Kapazitäten
  let currentWarehouseLevel;
  try {
    currentWarehouseLevel = await getCurrentWarehouseLevel(client, user_name);
  } catch (error) {
    console.error('Error fetching warehouse level:', error.message);
    throw error;
  }

  const calculatedCapacities = calculateWarehouseCapacities(currentWarehouseLevel);
  console.log("Warehouse Level:", currentWarehouseLevel);
  console.log("Calculated Capacities:", calculatedCapacities);

  // Vergleichen der geladenen und berechneten Kapazitäten
  const capacitiesAreDifferent = Object.keys(calculatedCapacities).some(key => {
    return Math.round(loadedCapacities[`${key}_capacity`]) !== Math.round(calculatedCapacities[key]);
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
