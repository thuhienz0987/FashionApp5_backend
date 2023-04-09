const { Router } = require('express');
const addressController = require('../controllers/addressController');

const router=  Router();

router.get('/get-address-by-user-id/:userId', addressController.getAddressByUserId);
router.put('/edit-addresses/:_id', addressController.editAddresses);
router.put('/add-new-address/:_id', addressController.addNewAddress);


module.exports= router;
