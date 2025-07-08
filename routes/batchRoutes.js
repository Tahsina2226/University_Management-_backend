const express = require('express');
const {
    getBatches,
    createBatch,
    updateBatch,
    deleteBatch
} = require('../controllers/batchController');

const router = express.Router();

router.get('/', getBatches);
router.post('/', createBatch);
router.put('/:id', updateBatch);
router.delete('/:id', deleteBatch);

module.exports = router;