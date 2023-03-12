const Product = require('../models/Product');
const Category = require('../models/Category');
const { query } = require('express');


// handle errors
const handleErrors =(err)=>{
    console.log(err.message, err.code);
    let errors ={name:'',price:'',detail:'',image:'',description:'',tag:''};

    return errors;
}

exports.postCreateProduct = async (req,res,next)=>{
    try{
        const name = req.body.name;
        const price = req.body.price;
        const detail = req.body.detail;
        const images=req.body.images;
        const posterImage = images[0];
        const quantity = req.body.quantity;
        const description= req.body.description;
        const tag= req.body.tag;
        const categoryId = req.body.categoryId;

        const product = new Product({
            name,
            price,
            detail,
            images,
            posterImage,
            quantity,
            description,
            tag,
            categoryId,
        });

        await product.save();
        const category = await Category.findById(categoryId);
        category.products = [...category.products,product._id];
        await category.save();
        res.status(201).json({
            message: 'Product created successfully',
            product: product,
        });
    }
    catch(err){
        const errors=handleErrors(err);
        res.status(500).json({errors});
    }
};

exports.updateProduct = async(req,res,next)=>{
    try{
        const productId = req.params.productId;
        const name = req.body.name;
        const price = req.body.price;
        const detail = req.body.detail;
        const images=req.body.images;
        const posterImage = images[0];
        const quantity = req.body.quantity;
        const description= req.body.description;
        const tag= req.body.tag;
        const categoryId = req.body.categoryId;
        const product = await Product.findById(productId);
        product.name =name;
        product.price=price;
        product.detail=detail;
        product.images=images;
        product.posterImage=posterImage;
        product.quantity=quantity;
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
        const errors=handleErrors(err);
        res.status(500).json({errors});
    }
};

exports.deleteProduct =async(req,res,next)=>{
    try{
        const productId = req.params.id;
        const product= await Product.findByIdAndRemove(productId);
        const category =await Category.findOne({_id:product.categoryId});
        const newProducts = category.products.filter(
            (item) =>item._id.toString() !== product._id.toString()
        );

        await Category.findByIdAndUpdate(
            {_id : product.categoryId},
            {products: newProducts}
        );
        res.status(200).json({
            message: 'Delete product successfully',
            product: product,
        });    }
    catch(err){
        const errors=handleErrors(err);
        res.status(500).json({errors});
    }
}

exports.getProduct = async(req,res,next)=>{
    try{
        
        const productId = req.params.productId;
        const product = await Product.findById(productId);
        res.status(200).json({
            message: 'fetched product successfully',
            product: product
        });
    }
    catch(err){
        const errors=handleErrors(err);
        res.status(500).json({errors});
    }
};