function calculateWarehouseCapacities(warehouseLevel) {
  // Beispiel für eine einfache Berechnung der Kapazitäten basierend auf dem Level
  const baseCapacity = 1000; // Basiswert für Kapazität pro Level
  return {
    water: baseCapacity * warehouseLevel,
    food: baseCapacity * warehouseLevel,
    wood: baseCapacity * warehouseLevel,
    stone: baseCapacity * warehouseLevel,
    knowledge: baseCapacity * (warehouseLevel / 2), // Beispiel: Wissen halb so stark wie andere Kapazitäten
    population: baseCapacity * (warehouseLevel / 10), // Beispiel: Bevölkerung weniger stark
    coal: baseCapacity * warehouseLevel,
    gold: baseCapacity * (warehouseLevel / 20), // Beispiel: Gold viel weniger
    military: 0, // Beispiel: keine militärische Kapazität
    maxMilitaryCapacity: baseCapacity * warehouseLevel * 0.1 // Beispiel: Militärische Kapazität
  };
}

module.exports = calculateWarehouseCapacities;
