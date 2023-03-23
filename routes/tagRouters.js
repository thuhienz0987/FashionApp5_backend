const {Router} = require('express');
const tagController = require('../controllers/tagController');

const router = Router();

router.get('/get-all-tag',tagController.getAllTag);
router.get('/get-tag-by-id/:_id',tagController.getTagById);
router.post('/post-create-tag',tagController.postCreateTag);
router.put('/put-update-tag/:_id',tagController.updateTag);
router.delete('/delete-tag/:_id',tagController.deleteTag);
router.get('/get-all-deleted-tag', tagController.getDeletedTag);

module.exports= router;