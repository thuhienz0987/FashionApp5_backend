const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email');
            }
        }
    },
    password: {
        type: String,
        required: [true, 'password is required'],
        minLength: [8, 'password must have 8 or more characters']
    },
    firstName: {
        type: String,
        required: [true, 'First name is missing']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is missing']
    },
    phoneNumber: {
        type: String,
        required: [true, 'Please tell us your phone number']
    },
    profileImage: {
        type: String
    },
    refreshToken: {
        type: String
    },
},
    { timestamps: true }
);

// static method to login user
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    console.log(user);
    if (user) {
            const auth = await bcrypt.compare(password, user.password);
            if (auth) {
                return user;
            }
            throw Error('incorrect password');
    }
    throw Error('incorrect email');
};

const User = mongoose.model('user', userSchema);

module.exports = User;
