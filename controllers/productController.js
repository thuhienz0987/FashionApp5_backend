const Product = require("../models/Product");
const Category = require("../models/Category");
const Tag = require("../models/Tag");
const cloudinary = require("../helper/imageUpload");
const NotFoundError = require("../errors/notFoundError");
const { query } = require("express");
const ProductDetail = require("../models/ProductDetail");
const { ObjectId } = require('mongodb');

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

exports.postCreateProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      material,
      care,
      quantity,
      description,
      tag,
      categoryId,
    } = req.body;

    let image = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newPath = await cloudinaryImageUploadMethod(path);
      image.push({ url: newPath.res, public_id: newPath.public_id });
    }

    const product = await Product.create({
      name,
      price,
      material,
      care,
      quantity,
      description,
      tag,
      categoryId,
      image: image,
      posterImage: image[0],
    });
    res.status(201).json({
      message: "Product created",
      product: product,
    });
  } catch (err) {
    throw err;
  }
},
exports.updateProduct = async (req, res) => {
  try {
    const _id = req.params._id;
    const {
      name,
      price,
      material,
      care,
      description,
      tag,
      categoryId,
      oldImage,
    } = req.body;
    let oldImageArray = [];
    if (!Array.isArray(oldImage)) oldImageArray.push(oldImage);
    else oldImageArray = oldImage;
    let imageUpdate = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newPath = await cloudinaryImageUploadMethod(path);
      imageUpdate.push({ url: newPath.res, public_id: newPath.public_id });
    }

    const product = await Product.findById(_id);
    let deleteImage = [];
    for (let i = 0; i < product.image.length; i++) {
      const isNotDelete = oldImageArray.filter((element) => {
        return element === product.image[i].public_id;
      });
      console.log(isNotDelete);
      if (isNotDelete.length > 0) {
        imageUpdate.push({
          url: product.image[i].url,
          public_id: product.image[i].public_id,
        });
      }  
      else {
        console.log('is not delete', isNotDelete.length);
        deleteImage.push(product.image[i].public_id);
      }
    }
    //
      if ( deleteImage.length > 0) {
        console.log(deleteImage.length);
        console.log(deleteImage);
        await cloudinary.api.delete_resources(deleteImage, function (err, result) {
        console.log(result);
      });
    }

    product.name = name;
    product.price = price;
    product.material = material;
    product.care = care;
    (product.image = imageUpdate),
      (product.posterImage = imageUpdate[0]),
      (product.description = description);
    product.tag = tag;
    product.categoryId = categoryId;
    const updateProduct = await product.save();
    res.status(200).json({
      message: "Product updated",
      product: updateProduct,
    });
  } catch (err) {
    throw err;
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const _id = req.params._id;
    const details = await ProductDetail.find({productId: _id})
    for (const detail of details) {
      const objectId = new ObjectId(_id);
      if (detail.productId.toString() === objectId.toString()) {
        detail.quantity = 0;
        await detail.save();
      }
    }
    const product = await Product.findByIdAndUpdate(
      { _id },
      { isDeleted: true , quantity: 0},
      { new: true }
    );

    res.status(200).json({
      message: "Delete product successfully",
      product: product,
    });
  } catch (err) {
    throw err;
  }
};

// exports.getAllProduct = async (req, res) => {
//   //filtering
//   const queryObj = { ...req.query };
//   const excludeFields = ["page", "sort", "limit", "fields"];
//   excludeFields.forEach((el) => delete queryObj[el]);
//   //
//   let queryStr = JSON.stringify(queryObj);
//   //gte= getter > ; lte = letter < ;
//   queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
//   let query = Product.find(JSON.parse(queryStr), { isDeleted: false });

//   // sorting
//   if (req.query.sort) {
//     const sortBy = req.query.sort.split(",").join(" ");
//     query = query.sort(sortBy);
//   } else {
//     query = query.sort("-createdAt");
//   }

//   //field limiting
//   //   if (req.query.fields) {
//   //     const fields = req.query.fields.split(',').join(' ')
//   //     query = query.select(fields)
//   //   } else {
//   //     query = query.select('-__v')
//   //   }

//   // const page = req.query.page * 1 || 1;
//   // const limit = req.query.limit * 1 || 100;
//   // const skip = (page - 1) * limit;
//   // query = query.skip(skip).limit(limit);

//   // await Product.find(JSON.parse(queryStr),{isDeleted: false})
//   await query
//     .then((result) => {
//       console.log(result.length);
//       if (result.length === 0)
//         throw new NotFoundError("No product found, please try again !");
//       res.status(200).send(result);
//     })
//     .catch((err) => {
//       throw err;
//     });
// };

exports.getRandomProduct = async (req, res) => {
  await Product.find({ isDeleted: false })
    .limit(10)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      throw err;
    });
};

exports.getProductById = async (req, res) => {
  try {
    const _id = req.params._id;
    const product = await Product.findById(_id);
    if (product && product.isDeleted === false) {
      res.status(200).json(product);
    } else if (product && product.isDeleted === true) {
      res.status(410).send("Product is deleted");
    } else {
      throw new NotFoundError("Product not found");
    }
  } catch (err) {
    throw err;
  }
};

exports.getProductByCategoryId = async (req, res) => {
  try {
    const _id = req.params._id;
    const category = Category.findById(_id);
    if (!category)
      throw new NotFoundError(
        `The product with category _id ${_id} does not exists`
      );
    else if (category.isDeleted === true) {
      res.status(410).send("Category is deleted");
    } else {
      const product = await Product.find({ categoryId: _id , isDeleted: false});
      if (product.length === 0)
        throw new NotFoundError(`Not found product in category id ${_id}`);

      res.status(200).json(product);
    }
  } catch (err) {
    throw err;
  }
};

exports.getProductByTagId = async (req, res) => {
  try {
    const _id = req.params._id;
    const tag = await Tag.findById(_id);
    if (!tag)
      throw new NotFoundError(
        `The product with tag _id ${_id} does not exists`
      );
    else if (tag.isDeleted === true) {
      res.status(410).send("Tag is deleted");
    } else {
      const product = await Product.find({ tag: _id , isDeleted: false});
      if (product.length === 0)
        throw new NotFoundError(`Not found product in tag id ${_id}`);
      res.status(200).json(product);
    }
  } catch (err) {
    throw err;
  }
};

exports.getDeletedProduct = async (req, res) => {
  Product.find({ isDeleted: true })
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      throw err;
    });
};

exports.getProductByMultipleTagId = async (req, res) => {
  try {
    const tags = req.query.tags;
    const product = await Product.find({ tag: { $in: tags } , isDeleted: false});
    if (product.length === 0) throw new NotFoundError(`Not found product`);
    res.status(200).json(product);
  } catch (err) {
    throw err;
  }
};

exports.getNameTagByProductId = async (req, res) => {
  try {
    const _id = req.params._id;
    console.log(_id);
    const product = await Product.findById(_id);
    if (product && product.isDeleted === false) {
      const tagIds = product.tag;

      Tag.find({ _id: { $in: tagIds } })
        .select("_id name")
        .then((tags) => {
          res.status(200).json(tags);
        })
        .catch((err) => {
          throw err;
        });
    } else if (product && product.isDeleted === true) {
      res.status(410).send("Product is deleted");
    } else {
      throw new NotFoundError("Product not found");
    }
  } catch (err) {
    throw err;
  }
};

exports.getAllProduct = async (req, res) => {
  await Product.find({ isDeleted: false })
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      throw err;
    });
};