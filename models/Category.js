const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'category name must not be empty!'],
        unique: true,
        trim: true,
        minLength: [2, 'category name must have 2 or more characters'],
        maxLength: [32, 'category name must have 32 or less character']
    },
    parentId: {
        type: mongoose.Types.ObjectId,
    },
    description: {
        type: String,
        required: true
    },
    isDeleted: {
        type: Boolean,
        require: true,
        default: false
    }
},
{ timestamps: true }
);

const Category = mongoose.model('category', categorySchema);

module.exports = Category;  