const Rating = require("../models/Rating");

const cloudinary = require("../helper/imageUpload");
const { url } = require("../helper/imageUpload");
const NotFoundError = require("../errors/notFoundError");
const Product = require("../models/Product");

//upload array image use cloudinary

const cloudinaryImageUploadMethod = async (file) => {
  return new Promise((resolve) => {
    cloudinary.uploader.upload(file, (err, res) => {
      if (err) return res.status(500).send("upload image error");
      resolve({
        res: res.secure_url,
        public_id: res.public_id,
      });
    });
  });
};

exports.postCreateRating = async (req, res) => {
    try {
      const { rate, comment, productId, userId } = req.body;
      let image = [];
      const files = req.files;
      for (const file of files) {
        const { path } = file;
        const newPath = await cloudinaryImageUploadMethod(path);
        image.push({ url: newPath.res, public_id: newPath.public_id });
      }

      const rating = new Rating({
        rate, comment, productId, userId, image: image
      });
      await rating.save();
      res.status(201).json({
        message: "Rating created",
        rating: rating
      });

      
    } catch (err) {
      throw err;
    }
  };

  exports.getRatingByProductId = async (req,res) =>{
    try{
        const _id = req.params._id;
        const rating = await Rating.find({productId: _id, isDeleted: false})
        console.log(rating);

        res.status(200).json(rating)
    }
    catch(err){
        throw err;
    }
  }
  