const { Router } = require('express');
const verifyJWT = require('../middlewares/verifyJWT');
const errorHandler = require("../middlewares/errorHandler");

const rootRoutes = require('./rootRoutes');
const registerRoutes = require('./registerRoutes');
const authRoutes = require('./authRoutes');
const refreshRoutes = require('./refreshRoutes');

const categoryRoutes = require('./categoryRoutes');

const productRouters= require('./productRouters');
const addressRouters = require('./addressRouters');
const tagRouters=require('./tagRouters');
const sizeRouters= require('./sizeRouters');
const colorRouters= require('./colorRouters');
const productDetailRouter= require('./productDetailRouters');
const blogRouters = require('./blogRouters');
const userRouters = require('./userRoutes');
const collectionRouters= require('./collectionRouters');
const orderRouters = require('./orderRoutes');
const cartRouters = require('./cartRoutes')


const router = Router();

// all routes of application
router.use(rootRoutes);
router.use(registerRoutes);
router.use(authRoutes);
router.use(refreshRoutes);

router.use(verifyJWT);
router.get('/test', (req, res) => {res.status(200).json('OK')});
router.use(userRouters);
router.use(categoryRoutes);
router.use(productRouters);
router.use(tagRouters);
router.use(sizeRouters);
router.use(colorRouters);
router.use(productDetailRouter);
router.use(blogRouters);
router.use(collectionRouters);
router.use(orderRouters);
router.use(cartRouters);
router.use(addressRouters);



// error handler all routes
router.use(errorHandler);

module.exports = router;
