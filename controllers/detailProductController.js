const DetailProduct= require('../models/DetailProduct');
const Product = require('../models/Product');

exports.postCreateDetail = async (req,res)=>{
    try{
        const {sizeId,colorId,quantity,productId}= req.body;

        const product= await Product.findById(productId);
        const detailProduct= new DetailProduct({
            sizeId,
            colorId,
            quantity,
            productId,
        });
        console.log(detailProduct);
        await detailProduct.save();
        product.quantity= product.quantity+quantity;
        await product.save();
        res.status(201).json({
            message: 'Detail product created successfully',
            detailProduct: detailProduct,
        });
    }
    catch(err){
        throw err;
    }
};

exports.getAllDetail = async(req,res)=>{
    DetailProduct.find({isDeleted: false})
    .then((result)=>{
        res.send(result);
    })
    .catch((err)=>{
        throw err;
    })
};

exports.getDetailById = async(req,res)=>{
    try{
        const _id= req.params._id;
        const detailProduct= await DetailProduct.findById(_id);

        if(detailProduct&&detailProduct.isDeleted===false){
            res.status(200).json(detailProduct);
        }
        else if(detailProduct&&detailProduct.isDeleted===true){
            res.status(410).send('Detail product is deleted');
        }
        else{
            throw new NotFoundError('Detail product not found');
        }
    }
    catch(err){
        throw err;
    }
};

exports.putUpdateDetail= async(req,res)=>{
    try{
        const _id= req.params._id;
        const {sizeId,colorId,quantity,productId}= req.body;
    
        const product = await Product.findById(productId);

        const detailProduct= await DetailProduct.findById(_id);
        product.quantity= product.quantity-detailProduct.quantity +quantity;

        detailProduct.sizeId= sizeId;
        detailProduct.colorId=colorId;
        detailProduct.quantity= quantity;
        detailProduct.productId=productId;
    
        const updateDetailProduct= await detailProduct.save();
        await product.save();

        res.status(200).json({
            message:'Detail product updated',
            detailProduct: updateDetailProduct,
        })
    }
    catch(err){
        throw err;
    }

};

exports.deleteDetail= async(req,res)=>{
    try{
        const _id= req.params._id;
        // const productId= req.params.productId;
        
        const detail = await DetailProduct.findById(_id);
        const product = await Product.findById(detail.productId);
        product.quantity -=detail.quantity;
        await product.save();
        const detailProduct = await DetailProduct.findByIdAndUpdate({_id},{isDeleted: true},{new: true});

        

        
        res.status(200).json({
        message: 'Detail product deleted',
        detailProduct: detailProduct,
    });
    }
    catch(err){
        throw err;
    }

};

exports.getDeletedDetailProduct = async(req,res)=>{
    DetailProduct.find({isDeleted: true})
    .then((result)=>{
        res.send(result);
    })
    .catch((err)=>{
        throw err;
    })
};


exports.getDetailProductByProductId = async(req,res)=>{
    try{
        const _id = req.params._id;
        const product = await Product.findById(_id);
        if (!product) throw new NotFoundError(`The Detail product with product _id ${_id} does not exists`);
        else  if(product.isDeleted===true) {
            res.status(410).send('product is deleted');
        }
        else { 
        const detail = await DetailProduct.find({productId: _id});
        if (detail.length === 0) throw new NotFoundError(`Not found detail product in product id ${_id}`);
        res.status(200).json(detail);
        }

    }
    catch(err){
        throw err;
    }
};
