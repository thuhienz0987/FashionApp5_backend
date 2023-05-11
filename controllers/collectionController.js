const Collection = require('../models/Collection');
const cloudinary= require('../helper/imageUpload');
const { url} = require('../helper/imageUpload');
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

exports.postCreateCollection = async(req,res)=>{
    try{
        const {name,productId}= req.body;
        let image= [];
        const files= req.files;
        for(const file of files){
            const {path}= file;
            const newPath= await cloudinaryImageUploadMethod(path);
            image.push({url: newPath.res, public_id: newPath.public_id})
        }

        const collection = new Collection({
            name,
            productId,
            image: image,
            posterImage: image[0],
        });

        await collection.save();
        res.status(201).json({
            message:'Collection created successfully',
            collection: collection,
        });

    }
    catch(err){
        throw err;
    }
},

exports.getCollectionById= async(req,res)=>{
    try{
        const _id= req.params._id;
        const collection = await Collection.findById(_id);
        if(collection&&collection.isDeleted===false){
            res.status(200).json(collection);
        }
        else if(collection&&collection.isDeleted===true){
            res.status(410).send('Collection is deleted');
        }else {
            throw new NotFoundError ('Collection not found');
        }
    }
    catch(err){
        throw err;
    }
},

exports.getAllCollection= async(req,res)=>{
    Collection.find({isDeleted: false})
    .then((result)=>{
        res.status(200).send(result);
    })
    .catch((err)=>{
        throw err;
    })
},

exports.getRandomCollection = async(req,res)=>{
    const number= req.params.number
    Collection.find({isDeleted: false}).limit(number)
    .then((result)=>{
        res.status(200).send(result);
    })
    .catch((err)=>{
        throw err;
    })
},

exports.updateCollection= async(req,res)=>{
    try{
        const _id= req.params._id;
        const {name,productId}= req.body;
        let imageUpdate=[];
        const files= req.files;
        for(const file of files){
            const { path } = file;
          const newPath = await cloudinaryImageUploadMethod(path);
          imageUpdate.push({url: newPath.res, public_id: newPath.public_id});
        }

        const collection= await Collection.findById(_id);

        // create array image of collection => delete image in cloudinary
        let image= [];
        for(let i=0;i<collection.image.length;i++)
        {
            image.push(collection.image[i].public_id);
        }
        //delete image from cloudinary
        cloudinary.api.delete_resources(image,function(err,result){
            console.log(result);
        });

        collection.name=name;
        collection.productId=productId;
        collection.image=imageUpdate;
        collection.posterImage=imageUpdate[0];

        const updateCollection = await collection.save()
        res.status(200).json({
            message: 'Collection updated',
            collection: updateCollection,
        });


    }
    catch(err){
        throw err;
    }
},

exports.deleteCollection= async(req,res)=>{
    try{
        const _id= req.params._id;
        const collection = await Collection.findByIdAndUpdate({_id},{isDeleted: true},{new: true});
        res.status(200).json({
            message: 'Delete collection successfully',
            collection: collection,
        });    
    }catch(err){
        throw err;
    }
},

exports.getDeletedCollection= async(req,res)=>{
    Collection.find({isDeleted: true})
    .then((result)=>{
        res.send(result);
    })
    .catch((err)=>{
        throw err;
    })
}