const ProductDetail = require("../models/ProductDetail");
const Product = require("../models/Product");
const NotFoundError = require("../errors/notFoundError");
const Color = require("../models/Color");
const Size = require("../models/Size");
const { default: mongoose } = require("mongoose");

exports.postCreateDetail = async (req, res) => {
  try {
    const { sizeId, colorId, quantity, productId } = req.body;

    const product = await Product.findById(productId);
    const productDetail = new ProductDetail({
      sizeId,
      colorId,
      quantity,
      productId,
    });
    console.log(productDetail);
    await productDetail.save();
    product.quantity = product.quantity + quantity;
    await product.save();
    res.status(201).json({
      message: "Detail product created successfully",
      productDetail: productDetail,
    });
  } catch (err) {
    throw err;
  }
};

exports.getAllDetail = async (req, res) => {
  ProductDetail.find({ isDeleted: false })
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      throw err;
    });
};

exports.getDetailById = async (req, res) => {
  try {
    const _id = req.params._id;
    const productDetail = await ProductDetail.findById(_id);

    if (productDetail && productDetail.isDeleted === false) {
      res.status(200).json(productDetail);
    } else if (productDetail && productDetail.isDeleted === true) {
      res.status(410).send("Detail product is deleted");
    } else {
      throw new NotFoundError("Detail product not found");
    }
  } catch (err) {
    throw err;
  }
};

exports.putUpdateDetail = async (req, res) => {
  try {
    const _id = req.params._id;
    const { sizeId, colorId, quantity, productId } = req.body;

    const product = await Product.findById(productId);

    const productDetail = await ProductDetail.findById(_id);
    product.quantity = product.quantity - productDetail.quantity + quantity;

    productDetail.sizeId = sizeId;
    productDetail.colorId = colorId;
    productDetail.quantity = quantity;
    productDetail.productId = productId;

    const updateProductDetail = await productDetail.save();
    await product.save();

    res.status(200).json({
      message: "Detail product updated",
      productDetail: updateProductDetail,
    });
  } catch (err) {
    throw err;
  }
};

exports.deleteDetail = async (req, res) => {
  try {
    const _id = req.params._id;
    // const productId= req.params.productId;

    const detail = await ProductDetail.findById(_id);
    const product = await Product.findById(detail.productId);
    product.quantity -= detail.quantity;
    await product.save();
    const productDetail = await ProductDetail.findByIdAndUpdate(
      { _id },
      { isDeleted: true },
      { new: true }
    );

    res.status(200).json({
      message: "Detail product deleted",
      productDetail: productDetail,
    });
  } catch (err) {
    throw err;
  }
};

exports.getDeletedDetailProduct = async (req, res) => {
  ProductDetail.find({ isDeleted: true })
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      throw err;
    });
};

exports.getDetailProductByProductId = async (req, res) => {
  try {
    const _id = req.params._id;
    const product = await Product.findById(_id);
    if (!product)
      throw new NotFoundError(
        `The Detail product with product _id ${_id} does not exists`
      );
    else if (product.isDeleted === true) {
      res.status(410).send("product is deleted");
    } else {
      const detail = await ProductDetail.find({ productId: _id });
      let detailWithName =[];
      if (detail.length === 0)
        throw new NotFoundError(
          `Not found detail product in product id ${_id}`
        );
        await Promise.all(detail.map(async (item) =>{
          const size = await Size.findById(item.sizeId);
          const color = await Color.findById(item.colorId);
          detailWithName.push({...item._doc, colorName: color.name, sizeName: size.name});
        }))
      

      res.status(200).json(detailWithName);
    }
  } catch (err) {
    throw err;
  }
};

exports.postCreateMultipleDetail = async (req, res) => {
  try {
    let lc=0;
    const { colorId, productId, sizeQuantity } = req.body;
    const product = await Product.findById(productId);
    const color = await Color.findById(colorId);
    if (!product) throw new NotFoundError("ProductId not found");
    if (!color) throw new NotFoundError("ColorId not found");
    if (product.isDeleted) throw new NotFoundError("Product has been deleted");
    // if(sizeQuantity.length===0)
    

    const productDetails = await Promise.all(
      sizeQuantity.map(async ({ sizeId, quantity }) => {
        const p = await ProductDetail.findOne({
          productId: productId,
          colorId: colorId,
          sizeId: sizeId,        });

        console.log(sizeId);
        const size = await Size.findById(sizeId);
        if (!size) throw new NotFoundError("sizeId not found");
        if(quantity!==0) {
          lc=1;
        }
        if(typeof quantity==='string'){
          quantity=+quantity;
        }
        return new ProductDetail({
          colorId,
          sizeId: sizeId,
          quantity: quantity,

          productId,
        });
      })
    );

    if(lc===1){
      await ProductDetail.insertMany(productDetails);

      product.quantity += sizeQuantity.reduce(
        (total, { quantity }) => total + quantity,
        0
      );
      await product.save();
  
      res.status(201).json({
        message: "Multiple detail product created successfully",
      });
    }
    else { throw new NotFoundError ("No detail with quantity found")}
    
  } catch (err) {
    throw err;
  }
};
