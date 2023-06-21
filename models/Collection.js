const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,'A collection must have name'],
        unique: [true,'A collection name with the same name has already exists'],
        maxLength: [200,'A name of collection have maximum of 200 character'],
        minLength: [1,'A name of collection must have minimum of 1 character'],
        trim: true,

    },
    productId:[
        {
            type: mongoose.Types.ObjectId,
            ref: 'Product',
            required: true,
        }
    ],
  
    image: [
        {
            public_id:{
                type: String,
                required: true,
            },
            url:{
                type: String,
                required: true,
            }
        }
    ],
    posterImage: {
        public_id:{
            type: String,
            required: true,
        },
        url:{
            type: String,
            required: true,
        }
    },

    isDeleted: {
        type: Boolean,
        required: true,
        default: false
    },
});

const Collection = mongoose.model('Collection', collectionSchema);
module.exports= Collection;