const mongoose = require('mongoose');

const refundPolicySchema = new mongoose.Schema({
  days: { type: Number, required: true },
  percent: { type: Number, required: true }
}, { _id: false });

const propertyPolicySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // <-- Added userId
  propertyId: { type:String, required: true, unique: true },
  refundPolicies: [refundPolicySchema],
  rules: [String]
}, { timestamps: true });

module.exports = mongoose.model('PropertyPolicy', propertyPolicySchema);