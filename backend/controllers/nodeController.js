const Node = require('../models/Node');
const Edge = require('../models/Edge');

// ── GET /api/nodes ────────────────────────────────────────────────────────────
const getAllNodes = async (req, res) => {
  try {
    const nodes = await Node.find().sort({ name: 1 });
    return res.json(nodes);
  } catch (err) {
    console.error('[GET /api/nodes]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// ── POST /api/nodes ───────────────────────────────────────────────────────────
const createNode = async (req, res) => {
  try {
    const { name, type, lat, lng } = req.body;

    if (!name || lat === undefined || lng === undefined) {
      return res.status(400).json({ error: 'name, lat, and lng are required' });
    }

    const node = await Node.create({ name, type, lat, lng });
    return res.status(201).json(node);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    console.error('[POST /api/nodes]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// ── PUT /api/nodes/:id ────────────────────────────────────────────────────────
const updateNode = async (req, res) => {
  try {
    const { name, type, lat, lng } = req.body;

    const node = await Node.findByIdAndUpdate(
      req.params.id,
      { name, type, lat, lng },
      { new: true, runValidators: true }
    );

    if (!node) {
      return res.status(404).json({ error: 'Node not found' });
    }

    return res.json(node);
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return res.status(400).json({ error: err.message });
    }
    console.error('[PUT /api/nodes/:id]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// ── DELETE /api/nodes/:id ─────────────────────────────────────────────────────
// Also deletes all edges connected to this node to keep the graph consistent.
const deleteNode = async (req, res) => {
  try {
    const node = await Node.findByIdAndDelete(req.params.id);

    if (!node) {
      return res.status(404).json({ error: 'Node not found' });
    }

    // Remove all edges that referenced this node
    const { deletedCount } = await Edge.deleteMany({
      $or: [{ from: req.params.id }, { to: req.params.id }],
    });

    return res.json({
      message: 'Node and its connected edges deleted',
      deletedEdges: deletedCount,
    });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid node ID' });
    }
    console.error('[DELETE /api/nodes/:id]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getAllNodes, createNode, updateNode, deleteNode };
