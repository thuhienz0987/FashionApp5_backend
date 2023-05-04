const mongoose = require('mongoose');

const productSchema= new mongoose.Schema({
    name:{
        type: String,
        required: [true,'A product must have a name'],
        maxLength: [100,'A product name have maximum of 100 character'],
        minLength: [1,'A product name must have minimum of 1 character'],
        unique: [true,'A name of product with the same name has already exists'],
        trim: true,
    },
    price:{
        type: Number,
        required: [true,'A product must have a price'],
    },
    material:{
        type: String,
        required: [true,'A product must have a material'],
        maxLength: [500,'A material must have maximum of 500 character'],
        minLength: [5,'A material must have minimum of 5 character'],
    },
    care:{
        type: String,
        required: [true,'A product must have a care'],
        maxLength: [500,'A care must have maximum of 500 character'],
        minLength: [5,'A care must have minimum of 5 character'],
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
        maxLength: [500,'A description must have maximum of 500 character'],
        minLength: [5,'A description must have minimum of 5 character'],
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

productSchema.path('tag').validate(function (value) {
    console.log(value.length)
    if (value.length > 3) {
      throw new Error("tag size can't be greater than 3!");
    }
  });
  

// productSchema.index({name: 'text', categoryId: 'text',tag: 'text'})

const Product = mongoose.model('Product', productSchema);

module.exports = Product;