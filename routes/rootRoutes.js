const { Router } = require('express');

// initial root routes
const router = Router();

// root routes
router.get('/', (req, res) => {
    res.render('home')
});

module.exports = router;
