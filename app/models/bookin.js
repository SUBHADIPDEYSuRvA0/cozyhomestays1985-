const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bookinSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    checkindate: { type: String, required: true },
    checkoutdate: { type: String, required: true },
    adults: { type: Number, required: true },   // changed to Number
    children: { type: Number, required: true }, // changed to Number
    bedroom: { type: Number, required: true },  // changed to Number
    pets: { type: String, required: true },
    propertyid: { type: String, required: true },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Bookin", bookinSchema);
