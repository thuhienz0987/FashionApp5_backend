const {Router} = require('express');
const sizeController = require('../controllers/sizeController');

const router = Router();

router.get('/get-all-size',sizeController.getAllSize);
router.get('/get-size-by-id/:_id',sizeController.getSizeById);
router.post('/post-create-size',sizeController.postCreateSize);
router.put('/put-update-size/:_id',sizeController.updateSize);
router.delete('/delete-size/:_id',sizeController.deleteSize);
router.get('/get-all-deleted-size', sizeController.getDeletedSize);

module.exports= router;