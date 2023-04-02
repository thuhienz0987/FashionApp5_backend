const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,'A tag must have a name'],
        unique: [true,'A name of tag with the same name has already exists'],
        trim: true,
        maxLength: [100,'A name of tag have maximum of 100 character'],
        minLength: [1,'A name of tag must have minimum of 1 character'],
    },
    isDeleted:{
        type: Boolean,
        required: true,
        default: false,
    },
},{timestamps: true});

const Tag= mongoose.model('Tag',tagSchema);

module.exports = Tag;
