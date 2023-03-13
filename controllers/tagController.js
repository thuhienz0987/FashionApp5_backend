const Tag = require('../models/Tag');

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

        const tag= await Tag.findById(_id);
        tag.name= name;

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
        const tag= await Tag.findByIdAndUpdate({_id},{isDeleted: true},);

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
        if(tag){
            res.status(200).json(tag);
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
    Tag.find()
    .then((result)=>{
        res.send(result);
    })
    .catch((err)=>{
        throw err;
    })
};