const mongoose = require('mongoose');

const RatingBar = ['unSatisfy','normal','satisfy'];

const ratingSchema = new mongoose.Schema({
    rate:{
        type: String,
        required: [true, "Rating must include rating bar"],
        enum: RatingBar,
    },
    comment:{
        type: String,
    },
    productId:{
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Product'
    },
    userId:{
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
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
    isDeleted: {
        type: Boolean,
        required: true,
        default: false
    }
});


const Rating = mongoose.model('Rating', ratingSchema);
module.exports= Rating;