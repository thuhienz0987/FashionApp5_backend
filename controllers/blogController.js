const  Blog = require('../models/Blog');
const Category = require('../models/Category');
const Tag= require('../models/Tag');
const cloudinary= require('../helper/imageUpload');
const { url } = require('../helper/imageUpload');
const NotFoundError = require('../errors/notFoundError');


//upload array image use cloudinary 

const cloudinaryImageUploadMethod = async file => {
    return new Promise(resolve => {
        cloudinary.uploader.upload( file , (err, res) => {
          if (err) return res.status(500).send("upload image error")
            resolve({
              res: res.secure_url,
              public_id: res.public_id,
            }) 
          }
        ) 
    })
  }

exports.postCreateProduct =async(req,res)=>{
    
    try{
        const {title, detail,description,tag}= req.body;
        let image = [];
        const files = req.files;
        for (const file of files) {
          const { path } = file;
          const newPath = await cloudinaryImageUploadMethod(path);
          image.push({url: newPath.res, public_id: newPath.public_id});
        }
        const blog = new Blog({
            title,
            detail,
            description,
            tag,
            image: image,
            posterImage: image[0],
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
        if(blog&&blog.isDeleted===false){
            res.status(200).json(blog);
        }
        else if(blog&&blog.isDeleted===true){
            res.status(410).send('Blog is deleted')
        }
        else{
            throw new NotFoundError('Blog not found');
        }

    }catch(err){
        throw err;
    }
};

exports.getAllBlog = async(req,res)=>{
    Blog.find({isDeleted: false})
    .then((result)=>{
        res.send(result);
    })
    .catch((err)=>{
        throw err;
    })
};

exports.getRandomBlog = async(req,res)=>{
    Blog.find({isDeleted: false}).limit(4)
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
        const {title, detail,description,tag,}= req.body;
        let imageUpdate = [];
        const files = req.files;
        for (const file of files) {
          const { path } = file;
          const newPath = await cloudinaryImageUploadMethod(path);
          imageUpdate.push({url: newPath.res, public_id: newPath.public_id});
        }
        const blog = await Blog.findById(_id);


        let image =[]
        for(let i=0;i< blog.image.length;i++){
            image.push(blog.image[i].public_id);
        }
        //delete image from cloudinary
        cloudinary.api.delete_resources(image,function(err,result){
            console.log(result);
        });

        blog.title= title;
        blog.detail=detail;
        blog.description=description;
        blog.tag=tag;
        blog.image=imageUpdate;
        blog.posterImage= imageUpdate[0];

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
        const blog = await Blog.findByIdAndUpdate({_id},{isDeleted: true},{new: true});
        res.status(200).json({
            message: 'Delete blog successfully',
            blog: blog,
        });    
    }catch(err){
        throw err;
    }
};

exports.getDeletedBlog = async(req,res)=>{
    Blog.find({isDeleted: true})
    .then((result)=>{
        res.send(result);
    })
    .catch((err)=>{
        throw err;
    })
};