const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a user name'],
    },
    email: {
        type: String,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email',
        ],
        required: [true, 'Please add an email'],
        unique: true,
    },
    role: {
        type: String,
        enum: ['user', 'publisher'],
        default: 'user',
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        select: false, // when getting User from api, it will not show password
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    confirmEmailToken: String,
    isEmailConfirmed: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Encype a password before save : react to @POST
//
UserSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    // await bcrypt.genSalt(10, async (err, salt) => {
    //     this.password = await bcrypt.hash(this.password, salt);
    // });
    next();
});

// Sign JWT and return
// methods for a function to be called on an instance of model
UserSchema.methods.getJwtToken = function () {
    const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE,
    });
    return token;
};

// Validate if the input password matches with the password of a specific user instance in db
UserSchema.methods.matchPassword = async function (inputPassword) {
    return await bcrypt.compare(inputPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
