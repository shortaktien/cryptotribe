// services/saveMilitary.js

const saveMilitary = async (client, userAddress, military) => {
    const currentTime = new Date();
  
    // Delete existing military units
    const deleteMilitaryQuery = 'DELETE FROM military WHERE user_name = $1';
    await client.query(deleteMilitaryQuery, [userAddress]);
  
    // Insert new military units
    for (const unitType in military) {
      const insertMilitaryQuery = `
        INSERT INTO military (user_name, unit_type, count, updated_at)
        VALUES ($1, $2, $3, $4)
      `;
      const militaryValues = [
        userAddress,
        unitType,
        military[unitType],
        currentTime
      ];
      await client.query(insertMilitaryQuery, militaryValues);
    }
  };
  
  module.exports = saveMilitary;
  