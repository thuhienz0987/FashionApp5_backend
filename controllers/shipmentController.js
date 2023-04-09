const InternalServerError = require('../errors/internalServerError');
const NotFoundError = require('../errors/notFoundError');
const Address = require('../models/Address');
const Order = require('../models/Order');
const Shipment = require('../models/Shipment');
const User = require('../models/User');

module.exports.createShipment = async (orderId) => {
    const { userId } = await Order.findById(orderId);

    if (!userId) throw new InternalServerError("Some thing went wrong");
    const { firstName, lastName, phoneNumber } = await User.findById(userId);

    const { addresses } = await Address.findOne({userId: userId});

    function getDefaultAddress(address) {
        return address.isDefault;
    }
    const address = addresses.filter(getDefaultAddress);

    const shipment = await Shipment.create({
        username: firstName + " " + lastName,
        phoneNumber: phoneNumber,
        address: address,
        orderId: orderId
    })

    if (!shipment) throw new InternalServerError("Some thing has when wrong");
    return shipment;
};

module.exports.finishShipment = async (orderId) => {

    const shipment = await Shipment.findOne({orderId});

    if (!shipment) throw new NotFoundError("The order has not been ship yet");
    shipment.endShippingDate = Date.now();

    const savedShipment = await shipment.save();

    return savedShipment;
};