async function getCurrentWarehouseLevel(client, user_name) {
    const query = `SELECT level FROM buildings WHERE user_name = $1 AND building_type = 'warehouse'`;
    const result = await client.query(query, [user_name]);
  
    if (result.rows.length === 0) {
      throw new Error('Warehouse not found');
    }
  
    return result.rows[0].level;
  }
  