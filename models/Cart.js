const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Types.ObjectId,
        required: [true,'An order must have a user Id'],
    },
    productDetails: [{
        productDetailId: {
            type: mongoose.Types.ObjectId,
            required: [true,'A product detail must have Id'],
        },
        quantity: {
            type: Number,
            required: [true,'A product detail must have quantity'],
        }
    }],
    isDeleted: {
        type: Boolean,
        required: true,
        default: false
    },
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports= Cart;