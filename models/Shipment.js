const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
    orderId:{
        type: mongoose.Types.ObjectId,
        required: [true,'An order must have a user Id'],
    },
    startShippingDate:{
        type: Date,
        required: [true,'A shipment must have start date'],
        default: Date.now(),
    },
    endShippingDate:{
        type: Date,
    },
    phoneNumber: {
        type: String,
        required: [true,'An shipment must have finish date'],
    },
    userAddress: {   
        city: {
            type: String,
            required: [true, "city must be include"],
        },
        district: {
            type: String,
            required: [true, "district must be include"],
        },
        ward: {
            type: String,
            required: [true, "ward must be include"],
        },
        streetAndNumber: {
            type: String,
            required: [true, "address must be include"],
        }
    },
    userName: {
        type: String,
        required: [true, 'user name is missing'],
    }
});

const Shipment = mongoose.model('Shipment', shipmentSchema);
module.exports= Shipment;