const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const BadRequestError = require('../errors/badRequestError');
const passwordValidator = require('password-validator');


// init password validator
let passwordSchema = new passwordValidator();

// Add properties to it
passwordSchema
.is().min(8)                                    // Minimum length 8
.is().max(100)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().not().spaces();                          // Should not have spaces

// controller action
module.exports.signup_get = (req, res) => {
    res.send('Sign up');
};

module.exports.signup_post = async (req, res) => {
    const { email, password, firstName, lastName, phoneNumber } = req.body;

    try {
        // validate password
        const validateResult = passwordSchema.validate(password, { details: true });
        if (validateResult.length != 0) {
            throw new BadRequestError(validateResult);
        }
        
        // encrypt the password and create new user
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({email, password: hashedPassword, firstName, lastName, phoneNumber});
        res.status(201).json({ 'success': `New user ${user} created!` });
    }
    catch (err) {
        if (err.code = 11000) throw new BadRequestError({"message": "This email has already been registered"})
        throw err;
    }
};