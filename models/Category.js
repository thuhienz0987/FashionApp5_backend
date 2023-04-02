const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'category name must not be empty!'],
        unique: [true,'A name of category with the same name has already exists'],
        trim: true,
        minLength: [1, 'category name must have 1 or more characters'],
        maxLength: [100, 'category name must have 100 or less character']
    },
    parentId: {
        type: mongoose.Types.ObjectId,
    },
    description: {
        type: String,
        required: true,
        minLength: [1, 'description of category must have 1 or more characters'],
        maxLength: [500, 'description of category must have 500 or less character']
    },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false
    }
},
{ timestamps: true }
);

const Category = mongoose.model('category', categorySchema);

module.exports = Category;  