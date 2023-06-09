const {Router} = require('express');
const ratingController = require("../controllers/ratingController");
const uploads = require('../middlewares/image');

const router = Router();

router.post('/post-create-rating',uploads.array('imageRating',5),ratingController.postCreateRating);
router.get('/get-rating-by-productId/:_id', ratingController.getRatingByProductId);
module.exports= router;