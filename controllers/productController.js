const Product = require('../models/Product');
const Category = require('../models/Category');
const Tag= require('../models/Tag');


exports.postCreateProduct = async (req,res)=>{
    try{

        const name = req.body.name;
        const price = req.body.price;
        const material = req.body.material;
        const care= req.body.care;
        // const images=req.body.images;
        // const posterImage = images[0];
        const quantity = req.body.quantity;
        const description= req.body.description;
        const tag= req.body.tag;
        const categoryId = req.body.categoryId;
        const detailProductId= req.body.detailProductId;

        
        const product = new Product({
            name,
            price,
            material,
            care,
            // images,
            // posterImage,
            quantity,
            description,
            tag,
            categoryId,
            detailProductId,
        });

        await product.save();
        res.status(201).json({
            message: 'Product created successfully',
            product: product,
        });
    }
    catch(err){
        throw err;
    }
};

exports.updateProduct = async(req,res)=>{
    try{
        const _id = req.params._id;
        const name = req.body.name;
        const price = req.body.price;
        const material = req.body.material;
        const care= req.body.care;
        // const images=req.body.images;
        // const posterImage = images[0];
        const quantity = req.body.quantity;
        const description= req.body.description;
        const tag= req.body.tag;
        const categoryId = req.body.categoryId;
        const detailProductId= req.body.detailProductId;
        const product = await Product.findById(_id);
        product.name =name;
        product.price=price;
        product.material=material;
        product.care= care;
        // product.images=images;
        product.quantity=quantity;
        product.description=description;
        product.tag=tag;
        product.categoryId=categoryId;
        product.detailProductId=detailProductId;
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

