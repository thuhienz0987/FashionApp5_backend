const express = require('express');
const categoryController = require('../controllers/categoryController');
const verifyRoles = require('../middlewares/verifyRoles');
const ROLES_LIST = require('../config/roles_list');

const router = express.Router();

// get all categories
router.get('/all-categories', categoryController.get_all_category);

// get child category 
router.get('/category-child', categoryController.get_child_category);

// get category by id
router.get('/category/:_id', categoryController.get_category_by_id);

// create new category
router.post('/category',verifyRoles(ROLES_LIST.Admin), categoryController.post_category);

// edit category by id
router.put('/category/:_id',verifyRoles(ROLES_LIST.Admin), categoryController.put_category);

// delete category
router.delete('/category/:_id',verifyRoles(ROLES_LIST.Admin), categoryController.delete_category);


module.exports = router;
