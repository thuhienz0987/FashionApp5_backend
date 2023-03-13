const {Router} =require('express');
const productController = require('../controllers/productController');
const isAuth= require('../middlewares/is-auth');


//initial product controller
const router = Router();

// product controller 
router.get('/get-all-product',productController.getAllProduct);
router.get('/get-product-by-id/:_id', productController.getProductById);
router.post('/post-create-product', productController.postCreateProduct);
router.put('/put-update-product/:_id',  productController.updateProduct);
router.delete('/delete-product/:_id', productController.deleteProduct);

module.exports = router;