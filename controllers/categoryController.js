const Category = require('../models/Category');
const mongoose = require('mongoose');
const NotFoundError = require('../errors/internalServerError');
const InternalServerError = require('../errors/internalServerError');

module.exports.get_all_category = async (req, res) => {
    Category.find({isDeleted: false})
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
        if (category.parentId == '' || category.parentId == null) {
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
        const { _id } = req.params;
        const category = req.body;

        // find by id then update 
        const result = await Category.findByIdAndUpdate(_id, category, {new: true});
        
        res.status(200).json(result);

    }
    catch (err) {
        throw err;
    }
};

module.exports.delete_category = async (req, res) => {
    try {
        const { _id } = req.params;

        // find by id then update 
        const result = await Category.findByIdAndUpdate(_id, {isDeleted: true}, {new: true});
        
        res.status(200).json(result);

    }
    catch (err) {
        throw err;
    }
};

module.exports.get_child_category = async (req, res) => {
    try {
        const result = await Category.find({ parentId: { $ne: undefined } });
        if ( !result ) throw new NotFoundError('Not found any category');
        let categoryWithParentName = []
        await Promise.all(result.map(async(item) => {
            const parent = await Category.findById(item.parentId);
            if ( !parent ) throw new InternalServerError('Something went wrong when access parentId');
            categoryWithParentName.push({...item._doc, parentName: parent.name});
        }))
        res.status(200).json({category: categoryWithParentName})
    }
    catch (err) {
        throw err
    }
}