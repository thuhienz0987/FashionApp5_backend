const mongoose= require('mongoose');

const sizeSchema = mongoose.Schema({
    name:{
        type: String,
        required: [true,'A size must have a name'],
        unique: [true,'A name of size with the same name has already exists'],
        trim: true,
        maxLength: [10,'A name of size have maximum of 10 character'],
        minLength: [1,'A name of size must have minimum of 1 character'],
    },
    isDeleted:{
        type: Boolean,
        required: true,
        default: false,
    },
},{timestamps: true});

const Size= mongoose.model('Size',sizeSchema);
module.exports= Size;