const Edge = require('../models/Edge');
const Node = require('../models/Node');

// ── GET /api/edges ────────────────────────────────────────────────────────────
const getAllEdges = async (req, res) => {
  try {
    const edges = await Edge.find()
      .populate('from', 'name lat lng type')
      .populate('to',   'name lat lng type');
    return res.json(edges);
  } catch (err) {
    console.error('[GET /api/edges]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// ── POST /api/edges ───────────────────────────────────────────────────────────
const createEdge = async (req, res) => {
  try {
    const { from, to, weight, directed } = req.body;

    if (!from || !to || weight === undefined) {
      return res.status(400).json({ error: 'from, to, and weight are required' });
    }

    if (from === to) {
      return res.status(400).json({ error: 'from and to cannot be the same node' });
    }

    // Verify both nodes exist
    const [fromNode, toNode] = await Promise.all([
      Node.findById(from),
      Node.findById(to),
    ]);

    if (!fromNode) return res.status(404).json({ error: 'From node not found' });
    if (!toNode)   return res.status(404).json({ error: 'To node not found' });

    const edge = await Edge.create({ from, to, weight, directed: directed ?? false });
    const populated = await edge.populate([
      { path: 'from', select: 'name lat lng type' },
      { path: 'to',   select: 'name lat lng type' },
    ]);

    return res.status(201).json(populated);
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return res.status(400).json({ error: err.message });
    }
    console.error('[POST /api/edges]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// ── PUT /api/edges/:id ────────────────────────────────────────────────────────
const updateEdge = async (req, res) => {
  try {
    const { from, to, weight, directed } = req.body;

    const edge = await Edge.findByIdAndUpdate(
      req.params.id,
      { from, to, weight, directed },
      { new: true, runValidators: true }
    )
      .populate('from', 'name lat lng type')
      .populate('to',   'name lat lng type');

    if (!edge) {
      return res.status(404).json({ error: 'Edge not found' });
    }

    return res.json(edge);
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return res.status(400).json({ error: err.message });
    }
    console.error('[PUT /api/edges/:id]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// ── DELETE /api/edges/:id ─────────────────────────────────────────────────────
const deleteEdge = async (req, res) => {
  try {
    const edge = await Edge.findByIdAndDelete(req.params.id);

    if (!edge) {
      return res.status(404).json({ error: 'Edge not found' });
    }

    return res.json({ message: 'Edge deleted successfully' });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid edge ID' });
    }
    console.error('[DELETE /api/edges/:id]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getAllEdges, createEdge, updateEdge, deleteEdge };
