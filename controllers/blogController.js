const  Blog = require('../models/Blog');
const Category = require('../models/Category');
const Tag= require('../models/Tag');

exports.postCreateProduct =async(req,res)=>{
    try{
        const title = req.body .title;
        const detail =req.body.detail;
        const description = req.body.description;
        const tag= req.body.tag;

        const blog = new Blog({
            title,
            detail,
            description,
            tag,
        });
        await blog.save();
        res.status(201).json({
            message:'Blog created successfully',
            blog: blog,
        });
    }
    catch(err){
        throw err;
    }
};

exports.getBlogById= async(req,res)=>{
    try{
        const _id= req.params._id;
        const blog= await Blog.findById(_id);
        if(blog){
            res.status(200).json(blog);
        }
        else{
            throw new NotFoundError('Blog not found');
        }

    }catch(err){
        throw err;
    }
};

exports.getAllBlog = async(req,res)=>{
    Blog.find()
    .then((result)=>{
        res.send(result);
    })
    .catch((err)=>{
        throw err;
    })
};

exports.updateBlog= async(req,res)=>{
    try{
        const _id= req.params._id;
        const title = req.body .title;
        const detail =req.body.detail;
        const description = req.body.description;
        const tag= req.body.tag;

        const blog = await Blog.findById(_id);
        blog.title= title;
        blog.detail=detail;
        blog.description=description;
        blog.tag=tag;

        const updateBlog = await blog.save();
        res.status(200).json({
            message: 'Blog updated',
            blog: updateBlog,
        });
    }
    catch(err){
        throw err;
    }
};

exports.deleteBlog= async(req,res)=>{
    try{
        const _id= req.params._id;
        const blog = await Blog.findByIdAndUpdate({_id},{isDeleted: true},);
        res.status(200).json({
            message: 'Delete blog successfully',
            blog: blog,
        });    
    }catch(err){
        throw err;
    }
}