const {Router} = require('express');
const colorController = require('../controllers/colorController');
const verifyRoles = require('../middlewares/verifyRoles');

const router = Router();

router.get('/get-all-color',colorController.getAllColor);
router.get('/get-color-by-id/:_id',colorController.getColorById);
router.post('/post-create-color',verifyRoles(ROLES_LIST.Admin),colorController.postCreateColor);
router.put('/put-update-color/:_id',verifyRoles(ROLES_LIST.Admin),colorController.updateColor);
router.delete('/delete-color/:_id',verifyRoles(ROLES_LIST.Admin),colorController.deleteColor);
router.get('/get-all-deleted-color',colorController.getDeletedColor);

module.exports= router;