const Product = require('../models/Product');
const Category = require('../models/Category');
const Tag= require('../models/Tag');
const cloudinary = require('../helper/imageUpload');
// const formData = new FormData();


exports.postCreateProduct = async (req,res)=>{
    const {name,price,material,care,image,quantity,description,tag,categoryId}= req.body;
    const posterImage= image;
    try{
        const imagesInfo = await cloudinary.uploader.upload(req.file.path,{
            folder: 'products',
            width: 200,
            height: 200,
            crop: 'scale',
        });

        const product= await Product.create({

            name,price,material,care,quantity,description,tag,categoryId,
            image:{
                public_id: imagesInfo.public_id,
                url : imagesInfo.url,
            },
            posterImage:{
                public_id: imagesInfo.public_id,
                url : imagesInfo.url,
            },
        })
        res.status(200).json({
            message: 'Product updated',
            product: product,
        });
    }
    catch(err){
        throw err;
    }
       
    

},

exports.updateProduct = async(req,res)=>{
    try{
        const _id = req.params._id;
        const {name,price,material,care,image,description,tag,categoryId}= req.body;
        const posterImage= image;

        const imagesInfo = await cloudinary.uploader.upload(req.file.path,{
            folder: 'products',
            width: 200,
            height: 200,
            crop: 'scale',
        });

        const product = await Product.findById(_id);

        product.name =name;
        product.price=price;
        product.material=material;
        product.care= care;
        product.image={
            public_id: imagesInfo.public_id,
            url: imagesInfo.url,
        };
        product.posterImage=
        {
            public_id: imagesInfo.public_id,
            url: imagesInfo.url,   
        }
        // product.quantity=quantity;
        product.description=description;
        product.tag=tag;
        product.categoryId=categoryId;
        const updateProduct = await product.save();
        res.status(200).json({
            message: 'Product updated',
            product: updateProduct,
        });
    }
    catch(err){
        throw err;
    }
};

exports.deleteProduct =async(req,res)=>{
    try{
        const _id = req.params._id;
        // console.log(_id);
        const product= await Product.findByIdAndUpdate({_id},{isDeleted: true},);

        res.status(200).json({
            message: 'Delete product successfully',
            product: product,
        });    }
    catch(err){
        throw err;
    }
};

exports.getAllProduct = async(req,res)=>{
    Product.find()
    .then((result)=>{
        res.send(result);
    })
    .catch((err)=>{
        throw err;
    })
};
exports.getProductById = async(req,res)=>{
    try{
        
        const _id = req.params._id;
        const product = await Product.findById(_id);
       if(product){
        res.status(200).json(product);
       }
       else{
        throw new NotFoundError('Product not found');
       }
    }
    catch(err){
        throw err;
    }
};

exports.getProductByCategoryId= async(req,res)=>{
    try{
        const _id= req.params._id;
        const category = Category.findById(_id);
        const product = Product.find({categoryId: _id})
        .then((result)=>{
            res.send(result);
        })
        .catch((err)=>{
            throw new NotFoundError(`Not found product in category id ${_id}`);
        })
    }
    catch(err){
        throw err
    }
};

exports.getProductByTagId = async(req,res)=>{
    try{
        const _id= req.params._id;
        const tag= Tag.findById(_id);
        const product = Product.find({tag: _id})
        .then((result)=>{
            res.send(result);
        })
        .catch((err)=>{
            throw new NotFoundError(`Not found product in category id ${_id}`);
        })
    }
    catch(err){
        throw err;
    }
};

