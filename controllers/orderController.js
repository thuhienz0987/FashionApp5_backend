const BadRequestError = require('../errors/badRequestError');
const Order = require('../models/Order');
const DetailProduct = require('../models/DetailProduct');
const Product = require('../models/Product');
const NotFoundError = require('../errors/notFoundError');
const { createShipment, finishShipment } = require('./shipmentController');

// new, in progress, shipping, complete, cancel, return

module.exports.getOrderByUserId = async (req, res) => {
    try {
        const userId = req.params._id;
        const orders = await Order.find({userId: userId});

        res.status(200).json({orders: orders});
    }
    catch (err) {
        throw err;
    }
};

module.exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();

        res.status(200).json({orders: orders});
    }
    catch (err) {
        throw err;
    }
};

const findPrice = async (detailId) => {
    const { productId } = await DetailProduct.findById(detailId);
    const product = await Product.findById(productId);
    return product.price;
}

module.exports.createOrder = async (req, res) => {
    try {
        const { userId, productDetails } = req.body;

        if(productDetails)
        if( Array.isArray(productDetails) && productDetails.length === 0) throw new BadRequestError("Can not create an order that does not have any product")
        const orderStatus = "new";

        let orderTotalPrice = 0
        // find total price
        await Promise.all(productDetails.map(async (productDetail) => {
            const price = await findPrice(productDetail.productDetailId);
            orderTotalPrice += price * parseInt(productDetail.quantity, 10);
        }));

        const order = await Order.create({
            userId, productDetails, orderTotalPrice, orderStatus
        })

        res.status(201).json({order: order});
    }
    catch (err) {
        throw err;
    }
};

module.exports.cancelOrder = async (req, res) => {
    try {
        const { _id } = req.params;
        const order = await Order.findById(_id);
        if (!order) throw new NotFoundError("No order found with the Id");

        if (!(order.status === "in progress" || order.status === "in progress")) 
            throw new BadRequestError("Order can only be cancel if it is new or in progress");

        order.status = "cancel";
        order.save();

        res.status(200).json({order: order, message: "Cancel order successfully"});
    }
    catch (err) {
        throw err;
    }
};

module.exports.changeOrderStatus = async (req, res) => {
    try {
        const { _id } = req.params;
        const { orderStatus } = req.body;
        const order = await Order.findById(_id);
        if (!order) throw new NotFoundError("No order found with the Id");

        if ( order.orderStatus === "new" && (orderStatus !== "cancel" || orderStatus !== "in progress")) 
            throw new BadRequestError("new status can only turn into cancel or in progress");

        if ( order.orderStatus === "in progress" && (orderStatus !== "cancel" || orderStatus !== "shipping")) 
            throw new BadRequestError("in progress status can only turn into cancel or shipping");

        if ( order.orderStatus === "shipping" && (orderStatus !== "complete" || orderStatus !== "return")) 
            throw new BadRequestError("shipping status can only turn into complete or return");

        const editedOrder = await order.save();
        if ( editedOrder === "shipping" ) createShipment(editedOrder._id);
        if ( editedOrder === "complete" ) finishShipment(editedOrder._id);

        res.status(200).json({order: order, message: "Order status changed successfully"});
    }
    catch (err) {
        throw err;
    }
};


const allowStatusValue = ['new', 'in progress', 'shipping', 'complete', 'cancel', 'return'];
module.exports.getOrderByStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!allowStatusValue.includes(status)) throw new BadRequestError("Invalid status");
        
        const orders = await Order.find({status: status});
        if (!orders) throw new NotFoundError(`No order found with status ${status}`);

        res.status(200).json({ orders: orders });
    }
    catch (err) {
        throw err;
    }
};