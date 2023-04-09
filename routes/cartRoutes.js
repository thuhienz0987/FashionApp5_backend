const { Router } = require('express');
const cartController = require('../controllers/cartController');

const router=  Router();

router.get('/get-cart-by-user-id/:userId', cartController.getCartByUserId)
router.put('/reset-cart-item/:_id', cartController.resetProductOfCart);
router.put('/edit-cart-item/:_id', cartController.editCart);


module.exports= router;
