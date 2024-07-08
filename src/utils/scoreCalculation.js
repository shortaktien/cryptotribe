let leftoverResources = 0;
let totalPoints = 0;

/**
 * Aktualisiert den Punktestand basierend auf den ausgegebenen Ressourcen.
 * @param {Object} spentResources - Die ausgegebenen Ressourcen.
 */
export const updatePoints = (spentResources) => {
  const totalSpent = Object.values(spentResources).reduce((total, amount) => total + amount, 0);
  const pointsFromSpent = Math.floor((totalSpent + leftoverResources) / 10);
  leftoverResources = (totalSpent + leftoverResources) % 10;
  totalPoints += pointsFromSpent;
  console.log(`Current Points: ${totalPoints}`);
  return totalPoints;
};

export const getTotalPoints = () => totalPoints;
export const getLeftoverResources = () => leftoverResources;
