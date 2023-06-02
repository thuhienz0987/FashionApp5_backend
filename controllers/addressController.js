const InternalServerError = require('../errors/internalServerError');
const NotFoundError = require('../errors/notFoundError');
const Address = require('../models/Address');

module.exports.initAddress = async (userId) => {
    try {
        const addresses = [];
        const address = await Address.create({
            userId, addresses
        });
        return address;
    }
    catch (err) {
        throw err
    }
};

module.exports.getAddressByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        
        // find cart
        const address = Address.findOne({userId: userId});

        if (!address) throw new InternalServerError("Something has went wrong");

        res.status(200).json({
            address: address
        });
    }
    catch (err) {
        throw err
    }
};

module.exports.editAddresses = async (req, res) => {
    try {
        const { addresses } = req.body;
        const _id = req.params; 
        const address = await Address.findById(_id);

        // check if exist
        if (!address) throw new NotFoundError("None of address was found");
        address.addresses = addresses;
        address.save();
        res.status(200).json({
            message: 'Address updated',
            address: address
        });
    }
    catch (err) {
        throw err
    }
};

module.exports.addNewAddress = async (req, res) => {
    try {
        const { addressObject } = req.body;
        const {_id} = req.params; 
        const address = await Address.findOne({userId: _id});

        // check if exist
        if (!address) throw new NotFoundError("None of address was found");
        
        // first address granted isDefault
        if (address.addresses.length === 0) addressObject.isDefault = true;
        address.addresses = [...address.addresses, addressObject ];
        address.save();
        res.status(200).json({
            message: 'Address updated',
            address: address
        });
    }
    catch (err) {
        throw err
    }
};
