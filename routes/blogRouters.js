const {Router}= require('express');
const blogController= require('../controllers/blogController');

const router=  Router();

router.get('/get-all-blog',blogController.getAllBlog);
router.get('/get-blog-by-id/:_id',blogController.getBlogById);
router.post('/post-create-blog',blogController.postCreateProduct);
router.put('/put-update-blog/:_id',blogController.updateBlog);
router.delete('/delete-blog/:_id',blogController.deleteBlog);

module.exports= router;