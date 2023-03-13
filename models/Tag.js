const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    name:{
        type: String,
        require: [true,'A tag must have a name'],
        // unique: true,
    },
    isDeleted:{
        type: Boolean,
        require: true,
        default: false,
    },
},{timestamps: true});

const Tag= mongoose.model('Tag',tagSchema);

module.exports = Tag;
