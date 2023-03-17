const Size = require('../models/Size');

exports.postCreateSize = async(req,res)=>{
    try{
        const name = req.body.name;
        const size= new Size({
            name,
        });
        await size.save();
        res.status(201).json({
            message: 'size created successfully',
            size: size,
        });
    }
    catch(err){
        throw err;
    }
};

exports.updateSize = async (req,res) =>{
    try{
        const _id= req.params._id;
        const name= req.body.name;
        const size= await Size.findById(_id);
        size.name= name;

        const updateSize= await size.save();
        res.status(200).json({
            message: 'Size updated',
            size: updateSize
        });
    }
    catch(err){
        throw err;
    }
};

exports.deleteSize= async(req,res)=>{
    try{
        const _id= req.params._id;
        const size= await Size.findByIdAndUpdate({_id},{isDeleted: true},);

        res.status(200).json({
            message: 'Deleted Size successfully',
            size: size,
        });
    }
    catch(err){
        throw err;
    }
};

exports.getSizeById = async(req,res)=>{
    try{
        const _id= req.params._id;
        const size= await Size.findById(_id);
        if(size){
            res.status(200).json(size);
        }
        else{
            throw new NotFoundError('Size not fond');
        }
    }
    catch(err){
        throw err;
    }
};

exports.getAllSize= async(req,res)=>{
    Size.find()
    .then((result)=>{
        res.send(result);
    })
    .catch((err)=>{
        throw err;
    })
};