const BadRequestError = require('../errors/badRequestError');
const Order = require('../models/Order');
const Product = require('../models/Product');
const NotFoundError = require('../errors/notFoundError');
const { createShipment, finishShipment } = require('./shipmentController');
const User = require('../models/User');
const ProductDetail = require('../models/ProductDetail');
const Size = require('../models/Size');
const Color = require('../models/Color');
const InternalServerError = require('../errors/internalServerError');

// new, in progress, shipping, complete, cancel, return

module.exports.getOrderByUserId = async (req, res) => {
    try {
        const userId = req.params._id;
        const orders = await Order.find({userId: userId}).populate({     
            path: 'productDetails.productDetailId',
            populate: {
                path: 'productId'
                
            }
        }).populate({
            path: 'productDetails.productDetailId',
            populate: {
                path: 'sizeId'
                
            }
        }).populate({
            path: 'productDetails.productDetailId',
            populate: {
                path: 'colorId'
                
            }
        });

        res.status(200).json({orders: orders});
    }
    catch (err) {
        throw err;
    }
};

module.exports.getAllOrders = async (req, res) => {
    try {
        let orderArray = [];
        const orders = await Order.find();
        if(!orders) throw new InternalServerError("Order went wrong ");
        await Promise.all(orders.map( async (item) => {
            const user = await User.findById(item.userId);
            if(!user) throw new InternalServerError("User went wrong");
            let products = [];
            await Promise.all(item.productDetails.map(async (detailItem) => {
                console.log({detailItem})
                const productDetail = await ProductDetail.findById(detailItem.productDetailId);
                if(!productDetail) throw new InternalServerError("ProductDetail went wrong")
                if(productDetail.isDeleted) throw new NotFoundError("ProductDetail not exists")
                console.log({productDetail});

                const size= await Size.findById(productDetail.sizeId);
                if(!size) throw new InternalServerError("Size went wrong");
                if(size.isDeleted) throw new NotFoundError("Size not exists")

                const color = await Color.findById(productDetail.colorId);
                if(!color) throw new InternalServerError("Color went wrong");
                if(color.isDeleted) throw new NotFoundError("Color not exists")

                const product = await Product.findById(productDetail.productId);
                if(!product) throw new InternalServerError("Product went wrong");
                if(product.isDeleted) throw new NotFoundError("Product not exists")

                products.push({...detailItem._doc, size: size.name, color: color.name, image: product.posterImage, price: product.price, productName: product.name })
                console.log({products});
            }))
            orderArray.push({...item._doc, userName: user.firstName+ " " + user.lastName, productDetails:products, userAvatar: user.avatarImage});
            console.log({orderArray})

        }))


        res.status(200).json({orders: orderArray});
    }
    catch (err) {
        throw err;
    }
};

const findPrice = async (detailId) => {
    const { productId } = await ProductDetail.findById(detailId);
    const product = await Product.findById(productId);
    return product.price;
}

module.exports.createOrder = async (req, res) => {
    try {
        const { userId, productDetails, note, orderMethod} = req.body;
        let shippingCost=0;
        if(productDetails)
        if( Array.isArray(productDetails) && productDetails.length === 0) throw new BadRequestError("Can not create an order that does not have any product")
        const orderStatus = "new";
        let orderTotalPrice = 0
        
        // find total price
        await Promise.all(productDetails.map(async (productDetail) => {
            const price = await (findPrice(productDetail.productDetailId));
            orderTotalPrice += price * parseInt(productDetail.quantity, 10);
        }));

        if(orderMethod=="Delivery"){
            shippingCost = 5;
            const {address} = req.body;
            orderTotalPrice+=parseInt(shippingCost);
            
            if(!address||!address.city ||!address.district ||!address.ward ||!address.streetAndNumber) throw new BadRequestError("Please fill in the address information")
            const order = await Order.create({
                userId, productDetails, orderTotalPrice, orderStatus, note, address, orderMethod, shippingCost
            })
            res.status(201).json({order: order});

        }
        else {
            orderTotalPrice+=parseInt(shippingCost);
            const order = await Order.create({
                userId, productDetails, orderTotalPrice, orderStatus, note, orderMethod, shippingCost
            })
            res.status(201).json({order: order});
        }
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

        if (!(order.orderStatus === "in progress" || order.orderStatus === "new")) 
            throw new BadRequestError("Order can only be cancel if it is new or in progress");

        order.orderStatus = "cancel";
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

        if ( order.orderStatus === "new" && (orderStatus !== "cancel" && orderStatus !== "in progress")) 
            throw new BadRequestError("new status can only turn into cancel or in progress");

        if ( order.orderStatus === "in progress" && (orderStatus !== "cancel" && orderStatus !== "shipping")) 
            throw new BadRequestError("in progress status can only turn into cancel or shipping");

        if ( order.orderStatus === "shipping" && (orderStatus !== "complete" && orderStatus !== "return")) 
            throw new BadRequestError("shipping status can only turn into complete or return");
        if (orderStatus === "complete") {
            for (const item of order.productDetails) {
                const productDetail = await ProductDetail.findById(item.productDetailId);
                const product = await Product.findById(productDetail.productId);
            
                product.sale = product.sale + item.quantity;
                product.quantity = product.quantity- item.quantity;
                productDetail.quantity= productDetail.quantity - item.quantity;
                await productDetail.save();
                await product.save();
            }
        }

        if(orderStatus==="return"){
            for (const item of order.productDetails) {
                const productDetail = await ProductDetail.findById(item.productDetailId);
                const product = await Product.findById(productDetail.productId);
            
                product.sale = product.sale - item.quantity;
                product.quantity = product.quantity+ item.quantity;
                productDetail.quantity= productDetail.quantity + item.quantity;
                await productDetail.save();
                await product.save();
            }
        }
        order.orderStatus = orderStatus;
        const editedOrder = await order.save();

        res.status(200).json({order: editedOrder, message: "Order status changed successfully"});
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