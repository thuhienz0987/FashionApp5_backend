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
    detail:{
        type: String,
        required: [true,'A product must have a detail'],
    },
    // images: [
    //     {
    //       ref: {
    //         type: String,
    //         required: [true,'A product must have a image'],
    //       },
    //       url: {
    //         type: String,
    //         required: [true,'A image must have a url'],
    //       },
    //     },
    // ],
    // posterImage: {
    //     ref: {
    //       type: String,
    //       required: [true,'A product must have a poster image'],
    //     },
    //     url: {
    //       type: String,
    //       required: [true,'A poster image must have a url'],
    //     },
    // },
    quantity:{
        type: Number,
        default: 0,
    },
    description:{
        type: String,
        required: [true,'A product must have a description'],
    },
    categoryId:{
        type: mongoose.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    tag:[
        {
            id:{
                type: mongoose.Schema.ObjectId,
                ref: 'Tag',
                required: true,
            },
            name:{
                type: String,
                required: false,
            },
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