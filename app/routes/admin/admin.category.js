const express = require('express');
const router = express.Router();

const categoriesController = require('../../controller/admin/category.constroller');

router.post('/create', categoriesController.createcategory);
router.put('/categories/:id', categoriesController.updatecategory);
router.delete('/categories/:id', categoriesController.deletecategory);

module.exports = router;