const mongoose = require('mongoose');
const { number } = require('sharp/lib/is');

const allowStatusValue = ['new', 'in progress', 'shipping', 'complete', 'cancel', 'return'];
const OrderMethod= ["PickUp at store","Delivery"];

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
    note: {
        type: String,
        maxLength: [500,'A note must have maximum of 500 character'],
    },
    productDetails: [{
        productDetailId: {
            type: mongoose.Types.ObjectId,
            required: [true,'A product detail must have Id'],
            ref: 'ProductDetail',
        },
        quantity: {
            type: Number,
            required: [true,'A product detail must have quantity'],
        },
        rated:{
            type: Boolean,
            required: true,
            default: false,
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
    },
    shippingCost:{
        type: Number,
        required: [true, "Order must include shipping cost"],
        default: 0,
    },
    orderMethod:{
        type: String,
        required: [true, "Order must include order method"],
        enum: OrderMethod,
    },
    address: {
        city: {
            type: String,
            // required: [true, "city must be include"],
        },
        district: {
            type: String,
            // required: [true, "district must be include"],
        },
        ward: {
            type: String,
            // required: [true, "ward must be include"],
        },
        streetAndNumber: {
            type: String,
            // required: [true, "address must be include"],
        }
    }
});

const Order = mongoose.model('Order', orderSchema);
module.exports= Order;