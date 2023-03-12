const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name:{
        type: String,
        require: true,
        unique: true,
    },
    parent:{
        type: mongoose.Types.ObjectId,
        ref: 'Category',        
    },

},{timestamps: true})

categorySchema.index({name:1},{unique: true});
const Category= mongoose.model('Category', categorySchema);