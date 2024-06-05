const express = require('express');
const router = express.Router();
const cancellationController = require('../controllers/cancellationController');

router.get('/', cancellationController.getAllCancellations);
router.get('/:id', cancellationController.getCancellationById);
router.post('/', cancellationController.createCancellation);
router.put('/:id', cancellationController.updateCancellation);
router.delete('/:id', cancellationController.deleteCancellation);
router.get('/search', cancellationController.searchCancellations);

module.exports = router;
