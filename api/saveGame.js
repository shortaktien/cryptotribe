const { connectToDatabase } = require('./services/database');
const { saveResources } = require('./services/saveResources');
const { saveBuildings } = require('./services/saveBuildings');

module.exports = async (req, res) => {
  const { userAddress, resources, buildings, capacities, economic_points, military } = req.body;

  if (!userAddress || !resources || !buildings || !capacities || economic_points === undefined || !military) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const client = await connectToDatabase();

  try {
    await saveResources(client, userAddress, resources, economic_points, military);
    await saveBuildings(client, userAddress, buildings, capacities);

    res.status(200).json({ message: 'Game progress saved successfully' });
  } catch (error) {
    console.error('Error updating game progress:', error);
    res.status(500).json({ error: 'Failed to save game progress' });
  } finally {
    await client.end();
  }
};
