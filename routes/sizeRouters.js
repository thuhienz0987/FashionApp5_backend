const {Router} = require('express');
const sizeController = require('../controllers/sizeController');
const ROLES_LIST = require('../config/roles_list');
const verifyRoles = require('../middlewares/verifyRoles');

const router = Router();

router.get('/get-all-size', sizeController.getAllSize);
router.get('/get-size-by-id/:_id', sizeController.getSizeById);
router.post('/post-create-size', verifyRoles(ROLES_LIST.Admin), sizeController.postCreateSize);
router.put('/put-update-size/:_id', verifyRoles(ROLES_LIST.Admin), sizeController.updateSize);
router.delete('/delete-size/:_id', verifyRoles(ROLES_LIST.Admin), sizeController.deleteSize);
router.get('/get-all-deleted-size', sizeController.getDeletedSize);

module.exports= router;