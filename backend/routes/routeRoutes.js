const express = require('express');
const router  = express.Router();
const { findRoute } = require('../controllers/routeController');

// POST /api/route  — public (no auth needed to query shortest path)
router.post('/', findRoute);

module.exports = router;
