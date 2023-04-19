const User = require('../models/User');
const cloudinary = require('../helper/imageUpload');
const NotFoundError = require('../errors/notFoundError');
const InternalServerError = require('../errors/internalServerError');

module.exports.edit_user_profile = async (req, res) => {
    const { firstName, lastName, phoneNumber} = req.body;

    const id = req.params._id;
    // find user by id
    const user = await User.findById(id);

    // check if user found
    if (!user) throw new NotFoundError('User not found!');

    // edit user information
    user.firstName = firstName;
    user.lastName = lastName;
    user.phoneNumber = phoneNumber;

    // upload result init
    let result;
    if (req.file) {
        try {
            result = await cloudinary.uploader.upload(req.file.path, {
                public_id: `${user._id}_profile`,
                width: 500,
                height: 500,
                crop: 'fill',
            });
        }
        catch (err) {throw new InternalServerError('Unable to upload avatar, please try again');}
    }

    // check if image upload or not
    if (result) {
        user.avatarImage = result.url;
    }

    try {
        // save the user
        await user.save();

        // delete refresh token and password from user info
        user.refreshToken = undefined;
        user.password = undefined;

        // send success message to front end
        res.status(200).json({Status: 'Success', message: `Update ${user.firstName}'s information successfully`, user: user})
    }
    catch (err) {throw err;}
};


module.exports.get_user_profile = async (req, res) => {
    User.find({isDeleted: false})
    .then((result)=>{
        res.send(result);
    })
    .catch((err)=>{
        throw err;
    })
}