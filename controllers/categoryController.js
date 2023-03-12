const Category = require('../models/Category');
const mongoose = require('mongoose');
const NotFoundError = require('../errors/internalServerError');
const InternalServerError = require('../errors/internalServerError');

module.exports.get_all_category = async (req, res) => {
    Category.find()
    .then((result) => {
        res.send(result);
    })
    .catch((err) => {
        throw err;
    })
};

module.exports.get_category_by_id = async (req, res) => {
    try {
        const _id = req.params._id;
        const category = await Category.findById({_id});

        if (category) {
            res.status(200).json(category);
        }
        else {
            throw new NotFoundError('Category not found');
        }
    }
    catch (err) {
        throw err;
    }
};

module.exports.post_category = async (req, res) => {
    try {
        let category = req.body;

        // check if parentId is empty
        if(category.parentId == '' || category.parentId == null) {
            delete category.parentId;
        }

        // save to db
        const handledCategory = new Category(req.body);
        result = await handledCategory.save();

        // send back result
        res.status(201).json({ 'success': `New category ${result} created!` });
    } 
    catch (err) {
        throw err;
    }
};

module.exports.put_category = async (req, res) => {
    try {
        
    }
    catch (err) {

    }
};