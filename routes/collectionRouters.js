const {Router}= require('express');
const collectionController= require('../controllers/collectionController');
const uploads = require('../middlewares/image');
const verifyRoles = require('../middlewares/verifyRoles');
const ROLES_LIST = require('../config/roles_list');

const router=  Router();

router.get('/get-all-collection',collectionController.getAllCollection);
router.get('/get-random-collection/:number',collectionController.getRandomCollection);
router.get('/get-collection-by-id/:_id',collectionController.getCollectionById);
router.post('/post-create-collection',verifyRoles(ROLES_LIST.Admin),uploads.array('imageCollection',1), collectionController.postCreateCollection);
router.put('/put-update-collection/:_id',verifyRoles(ROLES_LIST.Admin),uploads.array('imageCollection',1),collectionController.updateCollection);
router.delete('/delete-collection/:_id',verifyRoles(ROLES_LIST.Admin),collectionController.deleteCollection);
router.get('/get-all-deleted-collection',collectionController.getDeletedCollection);


module.exports= router;
