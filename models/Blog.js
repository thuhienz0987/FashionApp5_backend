const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        unique: true,
    },
    detail:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
        maxLength : 255,
    },
    tag:[
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Tag',
            required: true,

        },
    ],
    isDeleted: {
        type: Boolean,
        required: true,
        default: false
    },
});

const Blog = mongoose.model('Blog', blogSchema);
module.exports= Blog;