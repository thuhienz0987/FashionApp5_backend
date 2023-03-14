const mongoose= require('mongoose');

const colorSchema = mongoose.Schema({
    name:{
        type: String,
        required: [true,'A color must have a name'],
        unique: true
    },
    isDeleted:{
        type: Boolean,
        required: true,
        default: false,
    },
},{timestamps: true});

const Color = mongoose.model('Color',colorSchema);
module.exports= Color;
