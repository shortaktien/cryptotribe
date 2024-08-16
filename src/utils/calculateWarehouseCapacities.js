function calculateWarehouseCapacities(warehouseLevel) {
    // Beispielwerte, passen Sie diese basierend auf Ihrer Spiellogik an
    const baseCapacity = 500;
    const multiplier = warehouseLevel * 1.5;
  
    return {
      water: baseCapacity * multiplier,
      food: baseCapacity * multiplier,
      wood: baseCapacity * multiplier,
      stone: baseCapacity * multiplier,
      knowledge: baseCapacity * 0.2 * multiplier,
      population: baseCapacity * 0.03 * multiplier,
      coal: baseCapacity * multiplier,
      gold: baseCapacity * multiplier,
      military: 0,
      maxMilitaryCapacity: baseCapacity * 0.1 * multiplier,
    };
  }
  