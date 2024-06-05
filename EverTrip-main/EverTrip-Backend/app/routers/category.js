const cateController = require("../controllers/cateController");
const router = require("express").Router();
const middleware = require('../utils/middleware');

router.post('/search', cateController.getAllCategories); 
router.get('/:id', cateController.getCategoryById); 
router.get("/searchByName", cateController.searchCategoryByName); 
router.post('/', middleware.checkLogin, cateController.createCategory); 
router.put('/:id', middleware.checkLogin, cateController.updateCategory);
router.delete("/:id", middleware.checkLogin, cateController.deleteCategory);

module.exports = router;
