const saveBuildings = async (client, userName, buildings) => {
  const query = `
    INSERT INTO buildings_summary (
      user_name,
      lumberjack_level, lumberjack_is_building, lumberjack_build_start_time, lumberjack_build_time_remaining,
      stonemason_level, stonemason_is_building, stonemason_build_start_time, stonemason_build_time_remaining,
      warehouse_level, warehouse_is_building, warehouse_build_start_time, warehouse_build_time_remaining,
      house_level, house_is_building, house_build_start_time, house_build_time_remaining,
      farm_level, farm_is_building, farm_build_start_time, farm_build_time_remaining,
      drawing_well_level, drawing_well_is_building, drawing_well_build_start_time, drawing_well_build_time_remaining,
      science_level, science_is_building, science_build_start_time, science_build_time_remaining,
      kohlemine_level, kohlemine_is_building, kohlemine_build_start_time, kohlemine_build_time_remaining,
      goldmine_level, goldmine_is_building, goldmine_build_start_time, goldmine_build_time_remaining,
      barracks_level, barracks_is_building, barracks_build_start_time, barracks_build_time_remaining,
      fortifications_level, fortifications_is_building, fortifications_build_start_time, fortifications_build_time_remaining,
      harbor_level, harbor_is_building, harbor_build_start_time, harbor_build_time_remaining,
      merchant_level, merchant_is_building, merchant_build_start_time, merchant_build_time_remaining,
      updated_at
    )
    VALUES (
      $1, $2, $3, $4, $5,
      $6, $7, $8, $9,
      $10, $11, $12, $13,
      $14, $15, $16, $17,
      $18, $19, $20, $21,
      $22, $23, $24, $25,
      $26, $27, $28, $29,
      $30, $31, $32, $33,
      $34, $35, $36, $37,
      $38, $39, $40, $41,
      $42, $43, $44, $45,
      $46, $47, $48, $49, $50, $51, $52, $53, $54
    )
    ON CONFLICT (user_name) DO UPDATE SET
      lumberjack_level = EXCLUDED.lumberjack_level,
      lumberjack_is_building = EXCLUDED.lumberjack_is_building,
      lumberjack_build_start_time = EXCLUDED.lumberjack_build_start_time,
      lumberjack_build_time_remaining = EXCLUDED.lumberjack_build_time_remaining,
      stonemason_level = EXCLUDED.stonemason_level,
      stonemason_is_building = EXCLUDED.stonemason_is_building,
      stonemason_build_start_time = EXCLUDED.stonemason_build_start_time,
      stonemason_build_time_remaining = EXCLUDED.stonemason_build_time_remaining,
      warehouse_level = EXCLUDED.warehouse_level,
      warehouse_is_building = EXCLUDED.warehouse_is_building,
      warehouse_build_start_time = EXCLUDED.warehouse_build_start_time,
      warehouse_build_time_remaining = EXCLUDED.warehouse_build_time_remaining,
      house_level = EXCLUDED.house_level,
      house_is_building = EXCLUDED.house_is_building,
      house_build_start_time = EXCLUDED.house_build_start_time,
      house_build_time_remaining = EXCLUDED.house_build_time_remaining,
      farm_level = EXCLUDED.farm_level,
      farm_is_building = EXCLUDED.farm_is_building,
      farm_build_start_time = EXCLUDED.farm_build_start_time,
      farm_build_time_remaining = EXCLUDED.farm_build_time_remaining,
      drawing_well_level = EXCLUDED.drawing_well_level,
      drawing_well_is_building = EXCLUDED.drawing_well_is_building,
      drawing_well_build_start_time = EXCLUDED.drawing_well_build_start_time,
      drawing_well_build_time_remaining = EXCLUDED.drawing_well_build_time_remaining,
      science_level = EXCLUDED.science_level,
      science_is_building = EXCLUDED.science_is_building,
      science_build_start_time = EXCLUDED.science_build_start_time,
      science_build_time_remaining = EXCLUDED.science_build_time_remaining,
      kohlemine_level = EXCLUDED.kohlemine_level,
      kohlemine_is_building = EXCLUDED.kohlemine_is_building,
      kohlemine_build_start_time = EXCLUDED.kohlemine_build_start_time,
      kohlemine_build_time_remaining = EXCLUDED.kohlemine_build_time_remaining,
      goldmine_level = EXCLUDED.goldmine_level,
      goldmine_is_building = EXCLUDED.goldmine_is_building,
      goldmine_build_start_time = EXCLUDED.goldmine_build_start_time,
      goldmine_build_time_remaining = EXCLUDED.goldmine_build_time_remaining,
      barracks_level = EXCLUDED.barracks_level,
      barracks_is_building = EXCLUDED.barracks_is_building,
      barracks_build_start_time = EXCLUDED.barracks_build_start_time,
      barracks_build_time_remaining = EXCLUDED.barracks_build_time_remaining,
      fortifications_level = EXCLUDED.fortifications_level,
      fortifications_is_building = EXCLUDED.fortifications_is_building,
      fortifications_build_start_time = EXCLUDED.fortifications_build_start_time,
      fortifications_build_time_remaining = EXCLUDED.fortifications_build_time_remaining,
      harbor_level = EXCLUDED.harbor_level,
      harbor_is_building = EXCLUDED.harbor_is_building,
      harbor_build_start_time = EXCLUDED.harbor_build_start_time,
      harbor_build_time_remaining = EXCLUDED.harbor_build_time_remaining,
      merchant_level = EXCLUDED.merchant_level,
      merchant_is_building = EXCLUDED.merchant_is_building,
      merchant_build_start_time = EXCLUDED.merchant_build_start_time,
      merchant_build_time_remaining = EXCLUDED.merchant_build_time_remaining,
      updated_at = EXCLUDED.updated_at
  `;
  const currentTime = new Date().toISOString();
  const values = [
    userName,
    buildings.lumberjack_level || 0, buildings.lumberjack_is_building || false, buildings.lumberjack_build_start_time || currentTime, buildings.lumberjack_build_time_remaining || 0,
    buildings.stonemason_level || 0, buildings.stonemason_is_building || false, buildings.stonemason_build_start_time || currentTime, buildings.stonemason_build_time_remaining || 0,
    buildings.warehouse_level || 0, buildings.warehouse_is_building || false, buildings.warehouse_build_start_time || currentTime, buildings.warehouse_build_time_remaining || 0,
    buildings.house_level || 0, buildings.house_is_building || false, buildings.house_build_start_time || currentTime, buildings.house_build_time_remaining || 0,
    buildings.farm_level || 0, buildings.farm_is_building || false, buildings.farm_build_start_time || currentTime, buildings.farm_build_time_remaining || 0,
    buildings.drawing_well_level || 0, buildings.drawing_well_is_building || false, buildings.drawing_well_build_start_time || currentTime, buildings.drawing_well_build_time_remaining || 0,
    buildings.science_level || 0, buildings.science_is_building || false, buildings.science_build_start_time || currentTime, buildings.science_build_time_remaining || 0,
    buildings.kohlemine_level || 0, buildings.kohlemine_is_building || false, buildings.kohlemine_build_start_time || currentTime, buildings.kohlemine_build_time_remaining || 0,
    buildings.goldmine_level || 0, buildings.goldmine_is_building || false, buildings.goldmine_build_start_time || currentTime, buildings.goldmine_build_time_remaining || 0,
    buildings.barracks_level || 0, buildings.barracks_is_building || false, buildings.barracks_build_start_time || currentTime, buildings.barracks_build_time_remaining || 0,
    buildings.fortifications_level || 0, buildings.fortifications_is_building || false, buildings.fortifications_build_start_time || currentTime, buildings.fortifications_build_time_remaining || 0,
    buildings.harbor_level || 0, buildings.harbor_is_building || false, buildings.harbor_build_start_time || currentTime, buildings.harbor_build_time_remaining || 0,
    buildings.merchant_level || 0, buildings.merchant_is_building || false, buildings.merchant_build_start_time || currentTime, buildings.merchant_build_time_remaining || 0,
    currentTime
  ];

  // Ausgabe der Spalten und Werte zur Überprüfung
  /*console.log("Query:\n", query);
  console.log("Values length:", values.length);
  console.log("Values:", values);

  await client.query(query, values);*/
};

module.exports = saveBuildings;
