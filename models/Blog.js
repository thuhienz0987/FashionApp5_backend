const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title:{
        type: String,
        required: [true,'A blog must have title'],
        unique: [true,'A blog title with the same name has already exists'],
    },
    detail:{
        type: String,
        required: [true,'A blog must have a detail'],
    },
    description:{
        type: String,
        required: [true,'A blog have a description'],
        maxLength: [255,'A description must have maximum of 255 character'],
        minLength: [10,'A description must have minimum of 10 character'],
    },
    tag:[
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Tag',
            required: [true,'A blog must have a tag'],

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