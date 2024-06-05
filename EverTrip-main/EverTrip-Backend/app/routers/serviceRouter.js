const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

router.get('/search', serviceController.searchServices);
router.get('/user/:id', serviceController.getServicesByUserId);
router.post('/', serviceController.createService);
router.put('/:id', serviceController.updateService);
router.delete('/:id', serviceController.deleteService);
router.get('/:id', serviceController.getServiceById);
router.get('/', serviceController.getAllServices);

module.exports = router;
