const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title:{
        type: String,
        required: [true,'A blog must have title'],
        unique: [true,'A blog title with the same name has already exists'],
        maxLength: [100,'A title of blog have maximum of 100 character'],
        minLength: [1,'A title of blog must have minimum of 1 character'],
        trim: true,

    },
    detail:{
        type: String,
        required: [true,'A blog must have a detail'],
        maxLength: [500,'A detail of blog have maximum of 500 character'],
        minLength: [1,'A detail of blog must have minimum of 1 character'],
    },
    description:{
        type: String,
        required: [true,'A blog have a description'],
        maxLength: [1000,'A description must have maximum of 10000 character'],
        minLength: [1,'A description must have minimum of 1 character'],
    },
    tag:[
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Tag',
            required: [true,'A blog must have a tag'],
        },
    ],
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
    posterImage: {
        public_id:{
            type: String,
            required: true,
        },
        url:{
            type: String,
            required: true,
        }
    },

    isDeleted: {
        type: Boolean,
        required: true,
        default: false
    },
});

blogSchema.path('tag').validate(function (value) {
    console.log(value.length)
    if (value.length > 3) {
        throw new Error("tag size can't be greater than 3!");
    }
});

const Blog = mongoose.model('Blog', blogSchema);
module.exports= Blog;