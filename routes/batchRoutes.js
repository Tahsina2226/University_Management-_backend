const express = require('express');
const { getBatches, createBatch } = require('../controllers/batchController');
const router = express.Router();

router.get('/', getBatches);
router.post('/', createBatch);

module.exports = router;
