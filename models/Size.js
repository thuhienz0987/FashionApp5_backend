const mongoose= require('mongoose');

const sizeSchema = mongoose.Schema({
    name:{
        type: String,
        required: [true,'A size must have a name'],
        unique: true
    },
    isDeleted:{
        type: Boolean,
        required: true,
        default: false,
    },
},{timestamps: true});

const Size= mongoose.model('Size',sizeSchema);
module.exports= Size;