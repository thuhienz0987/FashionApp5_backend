const {Router} = require('express');
const colorController = require('../controllers/colorController');

const router = Router();

router.get('/get-all-color',colorController.getAllColor);
router.get('/get-color-by-id/:_id',colorController.getColorById);
router.post('/post-create-color',colorController.postCreateColor);
router.put('/put-update-color/:_id',colorController.updateColor);
router.delete('/delete-color/:_id',colorController.deleteColor);

module.exports= router;