const {Router} =require('express');
const productController = require('../controllers/productController');
const isAuth= require('../middlewares/is-auth');
const uploads = require('../middlewares/image');



const router = Router();

// product 
router.get('/get-all-product',productController.getAllProduct);
router.get('/get-random-product',productController.getRandomProduct);
router.get('/get-product-by-id/:_id', productController.getProductById);
router.post('/post-create-product',uploads.array('imageProduct',4), productController.postCreateProduct);
router.put('/put-update-product/:_id',uploads.array('imageProduct',4),  productController.updateProduct);
router.delete('/delete-product/:_id', productController.deleteProduct);
router.get('/get-product-by-category-id/:_id',productController.getProductByCategoryId);
router.get('/get-product-by-tag-id/:_id',productController.getProductByTagId);
router.get('/get-all-deleted-product',productController.getDeletedProduct);


module.exports = router;