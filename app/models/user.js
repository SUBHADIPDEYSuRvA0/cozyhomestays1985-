const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['Admin', 'Host', 'Guest', 'SuperAdmin','Manager','Employee','ChannelManeger','Caller','Subadmin','User', 'Seo'],
        default: 'User',
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active',
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    properties: {
        type: [String],
        default: [],
    },
    documentverification: {
        type: Boolean,
        default: false,
    },

},{
    timestamps: true,
    versionKey: false

});

module.exports = mongoose.model("User", userSchema);