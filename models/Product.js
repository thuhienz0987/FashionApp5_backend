const mongoose = require('mongoose');

const productSchema= new mongoose.Schema({
    name:{
        type: String,
        required: [true,'A product must have a name'],
    },
    price:{
        type: Number,
        required: [true,'A product must have a price'],
    },
    material:{
        type: String,
        required: [true,'A product must have a material'],
        maxLength: [255,'A material must have maximum of 255 character'],
        minLength: [10,'A material must have minimum of 10 character'],
    },
    care:{
        type: String,
        required: [true,'A product must have a care'],
        maxLength: [255,'A material must have maximum of 255 character'],
        minLength: [10,'A material must have minimum of 10 character'],
    },
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

    quantity:{
        type: Number,
        default: 0,
        required: true,
    },
    description:{
        type: String,
        required: [true,'A product must have a description'],
    },
    categoryId:{
        type: mongoose.Types.ObjectId,
        ref: 'Category',
        required: [true,'A product must have a category']
    },
    tag:[
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Tag',
            required: [true,'A product must have a tag']

        },
    ],
    isDeleted:{
        type: Boolean,
        required: true,
        default: false,
    }


},{timestamps: true});

// productSchema.index({name: 'text', categoryId: 'text',tag: 'text'})

const Product = mongoose.model('Product', productSchema);

module.exports = Product;