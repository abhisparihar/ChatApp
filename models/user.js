const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    confirmPassword: {
        type: String,
    },
    phone: {
        type: String,
        trim: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    title: {
        type: String,
        trim: true,
    },
    dob: {
        type: String,
        trim: true,
    },
    gender: {
        type: String,
        trim: true,
    },
    country: {
        type: String,
        trim: true,
    },
    state: {
        type: String,
        trim: true,
    },
    postalCode: {
        type: String,
        trim: true,
    },
    address: {
        type: String,
        trim: true,
    },
    agreement: {
        type: String,
        trim: true,
    },
    fbURL: {
        type: String,
        trim: true,
    },
    xURL: {
        type: String,
        trim: true,
    },
    linkedinURL: {
        type: String,
        trim: true,
    },
    instaURL: {
        type: String,
        trim: true,
    },
    dribbleRL: {
        type: String,
        trim: true,
    },
    dropBoxURL: {
        type: String,
        trim: true,
    },
    googlePlusURL: {
        type: String,
        trim: true,
    },
    pinterestURL: {
        type: String,
        trim: true,
    },
    skypeURL: {
        type: String,
        trim: true,
    },
    vineURL: {
        type: String,
        trim: true,
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpireTime: {
        type: Date
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    image: {
        type: String
    },
    role: {
        type: String,
        enum: ['superAdmin', 'user'],
        default: 'user'
    },
    chat: {
        type: Array,
        default: []
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);