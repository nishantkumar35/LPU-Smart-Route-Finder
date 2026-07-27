const express        = require('express');
const router         = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getAllEdges,
  createEdge,
  updateEdge,
  deleteEdge,
} = require('../controllers/edgeController');

// Public
router.get('/', getAllEdges);

// Admin-only
router.post('/',    authMiddleware, createEdge);
router.put('/:id',  authMiddleware, updateEdge);
router.delete('/:id', authMiddleware, deleteEdge);

module.exports = router;
