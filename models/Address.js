const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: [true, "Address must have a user Id"],
    },
    addresses: [{   
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
        },
        isDefault: {
            type: Boolean,
            required: true,
            default: false,
        },
    }],
    isDeleted: {
        type: Boolean,
        required: true,
        default: false
    },
});

addressSchema.path('addresses').validate(function (value) {
    console.log(value.length)
    if (value.length > 4) {
        throw new Error("A user can only have the most 4 addresses");
    }
});

const Address = mongoose.model('Address', addressSchema);
module.exports= Address;