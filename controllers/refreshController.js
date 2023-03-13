const User = require('../models/User');
const jwt = require('jsonwebtoken');

const maxAgeAccessToken = 60 * 15;

const handleRefreshToken = async (req, res) => {
    console.log(req.cookies);
    const cookies = req.cookies;

    // check if there are cookies --> if yes then check if jwt exists
    if(!cookies?.jwt) return res.sendStatus(401);
    refreshToken = cookies.jwt;
    
    // find the user that owned this jwt
    const user = await User.findOne({ refreshToken }).exec();
    console.log(user);
    if(!user) return res.sendStatus(403); // token does not match with any user
    
    // evaluate jwt
    jwt.verify(
        refreshToken, 
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            console.log(decoded);
            if (err || user._id.toString() !== decoded.userId) return res.sendStatus(403);

            const accessToken = jwt.sign(
                {
                    "userId": user._id
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: maxAgeAccessToken }
            );
            res.json({ accessToken });
        }
    );
};

module.exports = { handleRefreshToken };