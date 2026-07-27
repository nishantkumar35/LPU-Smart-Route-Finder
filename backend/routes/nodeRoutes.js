const express        = require('express');
const router         = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getAllNodes,
  createNode,
  updateNode,
  deleteNode,
} = require('../controllers/nodeController');

// Public
router.get('/', getAllNodes);

// Admin-only
router.post('/',    authMiddleware, createNode);
router.put('/:id',  authMiddleware, updateNode);
router.delete('/:id', authMiddleware, deleteNode);

module.exports = router;
