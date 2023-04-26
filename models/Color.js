const mongoose = require('mongoose');

const colorSchema = mongoose.Schema({
    name:{
        type: String,
        required: [true,'A color must have a name'],
        unique: [true,'A name of color with the same name has already exists'],
        maxLength: [100,'A name of color have maximum of 100 character'],
        minLength: [1,'A name of color must have minimum of 1 character'],
        trim: true,

    },
    code:{
        type: String,
        required: [true,'A color must have a code'],
        unique: [true,'A code of color with the same name has already exists'],
        maxLength: [10,'A code of color have maximum of 10 character'],
        minLength: [1,'A code of color must have minimum of 1 character'],
        trim: true,
    },
    isDeleted:{
        type: Boolean,
        required: true,
        default: false,
    },
},{timestamps: true});

const Color = mongoose.model('Color', colorSchema);
module.exports= Color;
