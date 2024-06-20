// CollisionHandler.js
export const checkCollisions = (myUnits, enemyUnits) => {
    let updatedMyUnits = [...myUnits];
    let updatedEnemyUnits = [...enemyUnits];
  
    updatedMyUnits = updatedMyUnits.map(myUnit => {
      const collision = updatedEnemyUnits.find(enemyUnit => Math.abs(enemyUnit.position - myUnit.position) < 1); // Beispielhafter Kollisionsradius
      if (collision) {
        console.log(`Collision detected between MyUnit ${myUnit.id} and EnemyUnit ${collision.id}`);
        return { ...myUnit, speed: 0 }; // Stoppt die Einheit bei einer Kollision
      }
      return myUnit;
    });
  
    updatedEnemyUnits = updatedEnemyUnits.map(enemyUnit => {
      const collision = updatedMyUnits.find(myUnit => Math.abs(myUnit.position - enemyUnit.position) < 1); // Beispielhafter Kollisionsradius
      if (collision) {
        console.log(`Collision detected between EnemyUnit ${enemyUnit.id} and MyUnit ${collision.id}`);
        return { ...enemyUnit, speed: 0 }; // Stoppt die Einheit bei einer Kollision
      }
      return enemyUnit;
    });
  
    return { updatedMyUnits, updatedEnemyUnits };
  };
  