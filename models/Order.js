const mongoose = require('mongoose');

const allowStatusValue = ['new', 'in progress', 'shipping', 'complete', 'cancel', 'return'];

const orderSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Types.ObjectId,
        required: [true,'An order must have a user Id'],
    },
    orderDate:{
        type: Date,
        required: [true,'An order must have date'],
        default: Date.now
    },
    orderTotalPrice: {
        type: Number,
        required: [true, 'An order must include total price']
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
    orderStatus: {
        type: String,
        required: [true, "Order must include status"],
        enum: allowStatusValue,
    }
});

const Order = mongoose.model('Order', orderSchema);
module.exports= Order;