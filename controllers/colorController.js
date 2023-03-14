const Color = require('../models/color');

exports.postCreateColor = async (req,res)=>{
    try{
        const name = req.body.name;
        const color = new Color({
            name,
        });

        await color.save();
        res.status(201).json({
            message: 'Color created successfully',
            color: color,
        });
    }
    catch(err){
        throw err;
    }
};

exports.updateColor = async (req,res) =>{
    try{
        const _id= req.params._id;
        const name= req.body.name;

        const color= await Color.findById(_id);
        color.name= name;
       
        // if(name){
        //     color.name= name;
        // }
        const updateColor= await color.save();
        res.status(200).json({
            message: 'Color updated',
            color: updateColor
        });
    }
    catch(err){
        throw err;
    }
};

exports.deleteColor= async(req,res)=>{
    try{
        const _id= req.params._id;
        const color= await Color.findByIdAndUpdate({_id},{isDeleted: true},);

        res.status(200).json({
            message: 'Deleted Color successfully',
            color: color,
        });
    }
    catch(err){
        throw err;
    }
};

exports.getColorById = async(req,res)=>{
    try{
        const _id= req.params._id;
        const color= await Color.findById(_id);
        if(color){
            res.status(200).json(color);
        }
        else{
            throw new NotFoundError('Color not found');
        }
    }
    catch(err){
        throw err;
    }
};

exports.getAllColor= async(req,res)=>{
    Color.find()
    .then((result)=>{
        res.send(result);
    })
    .catch((err)=>{
        throw err;
    })
};