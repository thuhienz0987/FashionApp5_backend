const express = require('express');
const categoryController = require('../controllers/categoryController');

const router = express.Router();

// get all categories
router.get('/all-categories', categoryController.get_all_category);

// get category by id
router.get('/category/:_id', categoryController.get_category_by_id);

// create new category
router.post('/category', categoryController.post_category);

// edit category by id
router.put('/category/:_id', categoryController.put_category);

// delete category
router.delete('/category/:categoryId', () => {});

module.exports = router;
