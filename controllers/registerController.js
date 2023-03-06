const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// controller action
module.exports.signup_get = (req, res) => {
    res.send('Sign up');
};

// handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email: '', password: '' };

    // duplicate email error
    if (err.code === 11000) {
        errors.email = 'that email is already registered';
        return errors;
    }

    // validation errors
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
        errors[properties.path] = properties.message;
        });
    }

    return errors;
};

module.exports.signup_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.create({email, password});

        console.log(user);
        res.status(201).json({ 'success': `New user ${user} created!` });
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(500).json({ errors });
    }
};