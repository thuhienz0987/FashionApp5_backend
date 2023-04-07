const {Router}= require('express');
const collectionController= require('../controllers/collectionController');
const uploads = require('../middlewares/image');

const router=  Router();

router.get('/get-all-collection',collectionController.getAllCollection);
router.get('/get-random-collection',collectionController.getRandomCollection);
router.get('/get-collection-by-id/:_id',collectionController.getCollectionById);
router.post('/post-create-collection',uploads.array('imageCollection',2), collectionController.postCreateCollection);
router.put('/put-update-collection/:_id',uploads.array('imageCollection',2),collectionController.updateCollection);
router.delete('/delete-collection/:_id',collectionController.deleteCollection);
router.get('/get-all-deleted-collection',collectionController.getDeletedCollection);


module.exports= router;
