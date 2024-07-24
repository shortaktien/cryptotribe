const loadMilitary = async (client, user_name) => {
  const militaryQuery = 'SELECT unit_type, count FROM military WHERE user_name = $1';
  const militaryValues = [user_name];
  const militaryResult = await client.query(militaryQuery, militaryValues);

  const militaryUnits = {
    infantry: 0,
    cavalry: 0
  };

  militaryResult.rows.forEach(row => {
    militaryUnits[row.unit_type.toLowerCase()] = row.count;
  });

  return militaryUnits;
};

module.exports = loadMilitary;
