const mongoose = require('mongoose');

const productDetail = mongoose.Schema({
    sizeId:{
        type: mongoose.Types.ObjectId,
        ref: 'Size',
        required: true,
    },
    colorId:{
        type: mongoose.Types.ObjectId,
        ref: 'Color',
        required: true,
    },
    quantity:{
        type: Number,
        default: 0,
        required: true,

    },
    productId:{
        type: mongoose.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    isDeleted:{
        type: Boolean,
        required: true,
        default: false,
    },
});

const ProductDetail = mongoose.model('ProductDetail',productDetail);

// // pre-hook to update product quantity before saving a product detail
// productDetailSchema.pre("save", async function (next) {
//     try {
//       const detail = this;
//       const product = await Product.findById(detail.productId);
//       const details = await ProductDetail.find({ productId: detail.productId });
  
//       // calculate total quantity of details
//       const totalQuantity = details.reduce(
//         (total, detail) => total + detail.quantity,
//         0
//       );
  
//       // update product quantity to match total quantity of details
//       product.quantity = totalQuantity;
//       await product.save();
  
//       next();
//     } catch (err) {
//       next(err);
//     }
//   });
  
//   // post-hook to update product quantity after deleting a product detail
//   productDetailSchema.post("findOneAndDelete", async function (doc, next) {
//     try {
//       const detail = doc;
//       const product = await Product.findById(detail.productId);
//       const details = await ProductDetail.find({ productId: detail.productId });
  
//       // calculate total quantity of details
//       const totalQuantity = details.reduce(
//         (total, detail) => total + detail.quantity,
//         0
//       );
  
//       // update product quantity to match total quantity of details
//       product.quantity = totalQuantity;
//       await product.save();
  
//       next();
//     } catch (err) {
//       next(err);
//     }
//   });

module.exports= ProductDetail;

