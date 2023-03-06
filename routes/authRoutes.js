const { Router } = require('express');
const authController = require('../controllers/authController');

// initial auth routes
const router = Router();

// auth routes
router.post('/login', authController.login_post);

module.exports = router;
