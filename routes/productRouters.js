const {Router} =require('express');
const productController = require('../controllers/productController');
const isAuth= require('../middlewares/is-auth');


//initial product controller
const router = Router();

// product controller 
router.get('/product/:productId',isAuth, productController.getProduct);
router.post('/post-product-create', isAuth, productController.postCreateProduct);
router.put('/put-product-update/:productId', isAuth,  productController.updateProduct);
router.delete('/delete-product/:productId',isAuth, productController.deleteProduct);

module.exports = router;