const {Router} = require('express');
const orderController = require('../controllers/orderController');
const verifyRoles = require('../middlewares/verifyRoles');
const ROLES_LIST = require('../config/roles_list');

const router= Router();

router.get('/get-all-order', orderController.getAllOrders);
router.get('/get-order-by-userId/:_id', orderController.getOrderByUserId);
router.post('/create-order', orderController.createOrder);
router.put('/cancel-order/:_id',orderController.cancelOrder);
router.put('/change-order-status/:_id',verifyRoles(ROLES_LIST.Admin),orderController.changeOrderStatus);
router.get('/get-order-by-status', orderController.getAllOrders);


module.exports= router;