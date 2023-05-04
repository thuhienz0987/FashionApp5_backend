const mongoose = require('mongoose');

const productDetail = mongoose.Schema({
    sizeId:{
        type: mongoose.Types.ObjectId,
        ref: 'Size',
        required: true,
    },
    colorId:{
        type: mongoose.Types.ObjectId,
        ref: 'Color',
        required: true,
    },
    quantity:{
        type: Number,
        default: 0,
        required: true,

    },
    productId:{
        type: mongoose.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    isDeleted:{
        type: Boolean,
        required: true,
        default: false,
    },
});

const ProductDetail = mongoose.model('ProductDetail',productDetail);

module.exports= ProductDetail;

