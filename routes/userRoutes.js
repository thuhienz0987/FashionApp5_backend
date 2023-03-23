const { Router } = require('express');
const userController = require('../controllers/userController');
const uploads = require('../middlewares/image');

const router = Router();

router.post('/user/:_id', uploads.single('avatarImage'), userController.edit_user_profile);

module.exports = router;