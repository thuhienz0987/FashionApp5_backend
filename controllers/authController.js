const User = require('../models/User');
const jwt = require('jsonwebtoken');

// handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email: '', password: '' };

    // incorrect email
    if (err.message === 'incorrect email') {
        errors.email = 'That email is not registered';
    }

    // incorrect password
    if (err.message === 'incorrect password') {
        errors.password = 'That password is incorrect';
    }

    // validation errors
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
        errors[properties.path] = properties.message;
        });
    }

    return errors;
};

// define max age of JWT
const maxAgeAccessToken = 15;
const maxAgeRefreshToken = 60 * 60 * 24 * 30 * 6;

module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password)
        // create JWTs for logged in user.
        const accessToken = jwt.sign(
            {
                "userInfo": {
                    "userId": user._id,
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: maxAgeAccessToken }
        );
        const refreshToken = jwt.sign(
            { "userId": user._id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: maxAgeRefreshToken }
        );

        // set new refresh token
        user.refreshToken = refreshToken;
        user.password = password;
        const result = await user.save();
        console.log(result);

        // Creates Secure Cookie with refresh token
        res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: maxAgeRefreshToken * 1000 });

        // Send authorization roles and access token to user
        res.json({ accessToken });
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(401).json({ errors });
    }
};