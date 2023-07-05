const {Router} = require('express');
const tagController = require('../controllers/tagController');
const verifyRoles = require('../middlewares/verifyRoles');

const router = Router();

router.get('/get-all-tag',tagController.getAllTag);
router.get('/get-tag-by-id/:_id',tagController.getTagById);
router.post('/post-create-tag',verifyRoles(ROLES_LIST.Admin),tagController.postCreateTag);
router.put('/put-update-tag/:_id',verifyRoles(ROLES_LIST.Admin),tagController.updateTag);
router.delete('/delete-tag/:_id',verifyRoles(ROLES_LIST.Admin),tagController.deleteTag);
router.get('/get-all-deleted-tag', tagController.getDeletedTag);
router.get('/get-random-tag/:number',tagController.getRandomTag);

module.exports= router;