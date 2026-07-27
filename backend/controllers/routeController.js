const Node     = require('../models/Node');
const Edge     = require('../models/Edge');
const dijkstra = require('../algorithms/dijkstra');
const aStar    = require('../algorithms/aStar');

/**
 * POST /api/route
 * Body: { sourceId, destId, algorithm }
 * algorithm: "dijkstra" | "astar"  (default: "dijkstra")
 *
 * Returns: { path, distance, steps, algorithm }
 */
const findRoute = async (req, res) => {
  try {
    const { sourceId, destId, algorithm = 'dijkstra' } = req.body;

    if (!sourceId || !destId) {
      return res.status(400).json({ error: 'sourceId and destId are required' });
    }

    if (sourceId === destId) {
      return res.status(400).json({ error: 'sourceId and destId must be different' });
    }

    const supportedAlgorithms = ['dijkstra', 'astar'];
    if (!supportedAlgorithms.includes(algorithm.toLowerCase())) {
      return res.status(400).json({
        error: `Unsupported algorithm. Choose one of: ${supportedAlgorithms.join(', ')}`,
      });
    }

    // Load the full graph from DB
    const [nodes, edges] = await Promise.all([Node.find(), Edge.find()]);

    if (nodes.length === 0) {
      return res.status(404).json({ error: 'No nodes in the graph' });
    }

    // Verify source and destination exist
    const nodeIds = new Set(nodes.map((n) => n._id.toString()));
    if (!nodeIds.has(sourceId)) {
      return res.status(404).json({ error: 'Source node not found' });
    }
    if (!nodeIds.has(destId)) {
      return res.status(404).json({ error: 'Destination node not found' });
    }

    // Run the chosen algorithm
    let result;
    if (algorithm.toLowerCase() === 'astar') {
      result = aStar(nodes, edges, sourceId, destId);
    } else {
      result = dijkstra(nodes, edges, sourceId, destId);
    }

    if (result.distance === Infinity) {
      return res.status(200).json({
        reachable: false,
        message: 'No path exists between the selected nodes',
        path: [],
        distance: null,
        steps: result.steps,
        algorithm,
      });
    }

    // Estimate travel time: assume average walking speed 1.2 m/s (~72 m/min)
    const estimatedTimeMinutes = Math.round(result.distance / 72);

    return res.json({
      reachable: true,
      path: result.path,
      distance: result.distance,          // in metres (as stored in Edge.weight)
      estimatedTimeMinutes,
      stops: result.path.length,
      steps: result.steps,
      algorithm,
    });
  } catch (err) {
    console.error('[POST /api/route]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { findRoute };
