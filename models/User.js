const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true,'A email with the same name has already exists'],
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
        required: [true, 'Please tell us your phone number'],
        minLength: [9, 'Please check your phone number'],
        maxLength: [11, 'Please check your phone number']
    },
    profileImage: {
        type: String
    },
    emailVerified: {
        type: Boolean,
        required: [true, 'Your email has not been verified yet, please verify your email to use our app'],
        default: false
    },
    refreshToken: {
        type: String
    },
    avatarImage: {
        type: String,
        default: 'https://res.cloudinary.com/dux8aqzzz/image/upload/v1685547037/xd0gen7b4z5wgwuqfvpz.png',
        required: true
    }
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

userSchema.methods.comparePassword = async function (password) {
    const result = await bcrypt.compare(password, this.password);
    return result;
};

userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
    }
    
    next();
})

const User = mongoose.model('user', userSchema);

module.exports = User;
