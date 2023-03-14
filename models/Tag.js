const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,'A tag must have a name'],
        // unique: true,
    },
    isDeleted:{
        type: Boolean,
        required: true,
        default: false,
    },
},{timestamps: true});

const Tag= mongoose.model('Tag',tagSchema);

module.exports = Tag;
