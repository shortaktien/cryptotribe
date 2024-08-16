const saveBuildings = async (client, userName, buildings) => {

  const saveBuildingsValues = [
    userName,
    buildings.find(b => b.name.toLowerCase() === 'lumberjack')?.currentLevel || 0,
    buildings.find(b => b.name.toLowerCase() === 'stonemason')?.currentLevel || 0,
    buildings.find(b => b.name.toLowerCase() === 'warehouse')?.currentLevel || 0,
    buildings.find(b => b.name.toLowerCase() === 'house')?.currentLevel || 0,
    buildings.find(b => b.name.toLowerCase() === 'farm')?.currentLevel || 0,
    buildings.find(b => b.name.toLowerCase() === 'drawing well')?.currentLevel || 0,
    buildings.find(b => b.name.toLowerCase() === 'science')?.currentLevel || 0,
    buildings.find(b => b.name.toLowerCase() === 'kohlemine')?.currentLevel || 0,
    buildings.find(b => b.name.toLowerCase() === 'goldmine')?.currentLevel || 0,
    buildings.find(b => b.name.toLowerCase() === 'barracks')?.currentLevel || 0,
    buildings.find(b => b.name.toLowerCase() === 'fortifications')?.currentLevel || 0,
    buildings.find(b => b.name.toLowerCase() === 'harbor')?.currentLevel || 0,
    buildings.find(b => b.name.toLowerCase() === 'merchant')?.currentLevel || 0
  ];

  const saveBuildingsQuery = `
    INSERT INTO buildings_level (
      user_name, 
      lumberjack_level, 
      stonemason_level, 
      warehouse_level, 
      house_level, 
      farm_level, 
      drawing_well_level, 
      science_level, 
      kohlemine_level, 
      goldmine_level, 
      barracks_level, 
      fortifications_level, 
      harbor_level, 
      merchant_level
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    ON CONFLICT (user_name)
    DO UPDATE SET
      lumberjack_level = EXCLUDED.lumberjack_level,
      stonemason_level = EXCLUDED.stonemason_level,
      warehouse_level = EXCLUDED.warehouse_level,
      house_level = EXCLUDED.house_level,
      farm_level = EXCLUDED.farm_level,
      drawing_well_level = EXCLUDED.drawing_well_level,
      science_level = EXCLUDED.science_level,
      kohlemine_level = EXCLUDED.kohlemine_level,
      goldmine_level = EXCLUDED.goldmine_level,
      barracks_level = EXCLUDED.barracks_level,
      fortifications_level = EXCLUDED.fortifications_level,
      harbor_level = EXCLUDED.harbor_level,
      merchant_level = EXCLUDED.merchant_level`;

  await client.query(saveBuildingsQuery, saveBuildingsValues);
};

module.exports = saveBuildings;
