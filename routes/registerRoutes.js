const { Router } = require('express');
const registerController = require('../controllers/registerController');


// initial register routes
const router = Router();

// register routes
router.post('/signup', registerController.signup_post);
router.post('/verify-email', registerController.verifyEmail);


module.exports = router;
