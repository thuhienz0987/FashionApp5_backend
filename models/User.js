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
        require: [true, 'password is required'],
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
    emailVerified: {
        type: Boolean,
        require: true,
        default: false
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
