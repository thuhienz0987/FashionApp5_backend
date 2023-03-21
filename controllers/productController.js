const Product = require('../models/Product');
const Category = require('../models/Category');
const Tag= require('../models/Tag');
const cloudinary = require('../helper/imageUpload');

const cloudinaryImageUploadMethod = async file => {
    return new Promise(resolve => {
        cloudinary.uploader.upload( file , (err, res) => {
          if (err) return res.status(500).send("upload image error")
            resolve({
              res: res.secure_url,
              public_id: res.public_id
            }) 
          }
        ) 
    })
  }

exports.postCreateProduct = async (req,res)=>{
    
    try{
    const {name,price,material,care,quantity,description,tag,categoryId}= req.body;

        let image = [];
        const files = req.files;
        for (const file of files) {
          const { path } = file;
          const newPath = await cloudinaryImageUploadMethod(path);
          image.push({url: newPath.res, public_id: newPath.public_id});
        }

        const product= await Product.create({

            name,price,material,care,quantity,description,tag,categoryId,
            image:image,
            posterImage:image[0],
        })
        res.status(200).json({
            message: 'Product created',
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
        const {name,price,material,care,description,tag,categoryId}= req.body;

        let imageUpdate = [];
        const files = req.files;
        for (const file of files) {
          const { path } = file;
          const newPath = await cloudinaryImageUploadMethod(path);
          imageUpdate.push({url: newPath.res, public_id: newPath.public_id});
        }

        const product = await Product.findById(_id);
        let image =[]
        for(let i=0;i< product.image.length;i++){
            image.push(product.image[i].public_id);
        }

        cloudinary.api.delete_resources(image,function(err,result){
            console.log(result);
        });

        product.name =name;
        product.price=price;
        product.material=material;
        product.care= care;
        product.image=imageUpdate,
        product.posterImage=imageUpdate[0],
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

exports.getRandomProduct = async(req,res)=>{
    Product.find().limit(10)
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

