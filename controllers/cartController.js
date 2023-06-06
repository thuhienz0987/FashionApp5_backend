const InternalServerError = require('../errors/internalServerError');
const NotFoundError = require('../errors/notFoundError');
const Cart = require('../models/Cart');

module.exports.getCartByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        
        // find cart
        const cart = await Cart.findOne({userId: userId}).populate({
            path: 'productDetails.productDetailId',
            populate: {
                path: 'productId'
            }
        });


        if (!cart) throw new InternalServerError("Something has went wrong");

        res.status(200).json({
            cart: cart
        });
    }
    catch (err) {
        throw err
    }
};

module.exports.createCart = async (userId) => {
    try {
        const productDetails = [];
        const cart = await Cart.create({
            userId, productDetails
        });
        return cart;
    }
    catch (err) {
        throw err
    }
};

module.exports.resetProductOfCart = async (req, res) => {
    try {
        const productDetails = [];
        const { _id } = req.params; // (cart id)
        const cart = await Cart.findById(_id);

        // check if exist
        if (!cart) throw new NotFoundError("None of cart was found");
        cart.productDetails = productDetails;
        cart.save();
        res.status(200).json({
            message: 'Cart cleared',
            cart: cart
        });
    }
    catch (err) {
        throw err
    }
};

module.exports.editCart = async (req, res) => {
    try {
        const { productDetails } = req.body;
        const { _id } = req.params; // (cart id)
        const cart = await Cart.findById(_id);

        // check if exist
        if (!cart) throw new NotFoundError("None of cart was found");
        cart.productDetails = productDetails;
        cart.save();
        res.status(200).json({
            message: 'Cart updated',
            cart: cart
        });
    }
    catch (err) {
        throw err
    }
};