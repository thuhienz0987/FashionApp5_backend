const Size = require('../models/Size');
const NotFoundError = require('../errors/notFoundError');

exports.postCreateSize = async(req,res)=>{
    try{
        const name = req.body.name;
        const width = req.body.width;
        const length = req.body.length;

        const size= new Size({
            name,width,length
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

exports.updateSize = async (req,res) => {
    try{
        const _id= req.params._id;
        const name= req.body.name;
        const width = req.body.width;
        const length = req.body.length;
        const size= await Size.findById(_id);
        size.name= name;
        size.width=width;
        size.length=length;

        const updateSize = await size.save();
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
        const size= await Size.findByIdAndUpdate({_id},{isDeleted: true},{new: true});

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
        if(size&& size.isDeleted===false){
            res.status(200).json(size);
        }else if(size&& size.isDeleted===true){
            res.status(410).send('Size is deleted');
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
    Size.find({isDeleted:false})
    .then((result)=>{
        res.send(result);
    })
    .catch((err)=>{
        throw err;
    })
};
exports.getDeletedSize = async(req,res)=>{
    Size.find({isDeleted: true})
    .then((result)=>{
        res.send(result);
    })
    .catch((err)=>{
        throw err;
    })
};