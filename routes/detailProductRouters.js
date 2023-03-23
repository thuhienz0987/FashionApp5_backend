const {Router} = require('express');
const detailProductController = require('../controllers/detailProductController');

const router= Router();

router.get('/get-all-detail',detailProductController.getAllDetail);
router.get('/get-detail-by-id/:_id',detailProductController.getDetailById);
router.post('/post-create-detail',detailProductController.postCreateDetail);
router.put('/put-update-detail/:_id',detailProductController.putUpdateDetail);
router.delete('/delete-detail/:_id',detailProductController.deleteDetail);
router.get('/get-all-deleted-detail',detailProductController.getDeletedDetailProduct);

module.exports= router;