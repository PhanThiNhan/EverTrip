const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

router.get('/', statsController.getStats);
router.get('/:id_user', statsController.getStatsByUserID);

module.exports = router;
