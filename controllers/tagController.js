const Tag = require('../models/Tag');
const NotFoundError = require('../errors/notFoundError');

exports.postCreateTag = async (req,res)=>{
    try{
        const name = req.body.name;
        const tag = new Tag({
            name,
        });

        await tag.save();
        res.status(201).json({
            message: 'Tag created successfully',
            tag: tag,
        });
    }
    catch(err){
        throw err;
    }
};

exports.updateTag = async (req,res) =>{
    try{
        const _id= req.params._id;
        const name= req.body.name;
        const isDelete= req.body.isDelete;

        const tag= await Tag.findById(_id);
        if(name){
            tag.name= name;
        }
        
        if(tag){
            tag.isDeleted= isDelete;
        }
        

        const updateTag= await tag.save();
        res.status(200).json({
            message: 'Tag updated',
            tag: updateTag,
        });
    }
    catch(err){
        throw err;
    }
};

exports.deleteTag= async(req,res)=>{
    try{
        const _id= req.params._id;
        const tag= await Tag.findByIdAndUpdate({_id},{isDeleted: true},{new: true});

        res.status(200).json({
            message: 'Deleted Tag successfully',
            tag: tag,
        });
    }
    catch(err){
        throw err;
    }
};

exports.getTagById = async(req,res)=>{
    try{
        const _id= req.params._id;
        const tag= await Tag.findById(_id);
        if(tag&&tag.isDeleted===false){
            res.status(200).json(tag);
        }else if(tag&&tag.isDeleted===true)
        {
            res.status(410).send('Tag is deleted');
        }
        else{
            throw new NotFoundError('Tag not fond');
        }
    }
    catch(err){
        throw err;
    }
};

exports.getAllTag= async(req,res)=>{
    Tag.find({isDeleted: false})
    .then((result)=>{
        res.send(result);
    })
    .catch((err)=>{
        throw err;
    })
};
exports.getDeletedTag = async(req,res)=>{
    Tag.find({isDeleted: true})
    .then((result)=>{
        res.send(result);
    })
    .catch((err)=>{
        throw err;
    })
};

exports.getRandomTag = async(req,res)=>{
 
    const number = req.params.number
    await Tag.find({isDeleted : false}).limit(number)
    .then((result)=>{
        res.send(result);
    })
    .catch((err)=>{
        throw err;
    })
};