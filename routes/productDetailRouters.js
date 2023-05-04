const {Router} = require('express');
const productDetailController = require('../controllers/productDetailController');

const router= Router();

router.get('/get-all-detail',productDetailController.getAllDetail);
router.get('/get-detail-by-id/:_id',productDetailController.getDetailById);
router.post('/post-create-detail',productDetailController.postCreateDetail);
router.put('/put-update-detail/:_id',productDetailController.putUpdateDetail);
router.delete('/delete-detail/:_id',productDetailController.deleteDetail);
router.get('/get-all-deleted-detail',productDetailController.getDeletedDetailProduct);
router.get('/get-detail-by-productId/:_id',productDetailController.getDetailProductByProductId);
router.post('/post-create-multiple-detail',productDetailController.postCreateMultipleDetail);

module.exports= router;