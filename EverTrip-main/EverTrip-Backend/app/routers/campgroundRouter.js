const express = require('express');
const router = express.Router();
const campgroundController = require('../controllers/campgroundController');

router.get('/searchByUser', campgroundController.searchCampgroundsByUser);
router.get('/search/advanced', campgroundController.searchCampgroundsAdvanced);
router.get('/category/:category_id', campgroundController.getCampgroundsByCategoryId);
router.get('/search', campgroundController.searchCampgrounds);

router.get('/', campgroundController.getAllCampgrounds);
router.get('/:id', campgroundController.getCampgroundById);
router.post('/', campgroundController.createCampground);
router.put('/:id', campgroundController.updateCampground);
router.delete('/:id', campgroundController.deleteCampground);
router.put('/deny/:id', campgroundController.denyCampground);
router.put('/approve/:id', campgroundController.approveCampground);
router.get('/user/:user_id', campgroundController.getCampgroundsByUserId);

module.exports = router;
