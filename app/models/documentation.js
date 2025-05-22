const mongoose = require('mongoose');

const ownerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  idType: { type: String, required: true },
  idFront: { type: String, required: true },
  idBack: { type: String, required: true }
});

const documentVerificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  ownerType: { type: String, enum: ['single', 'multiple'], required: true },

  // For single owner
  singleOwner: {
    idType: String,
    idFront: String,
    idBack: String
  },

  // For multiple owners
  multipleOwners: [ownerSchema],

  // Bank info
  accountNumber: { type: String, required: true },
  ifsc: { type: String, required: true, uppercase: true },

  // GST
  hasGst: { type: Boolean, required: true },
  gstNumber: { type: String, uppercase: true },
  gstDoc: String,

  isVerified: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('DocumentVerification', documentVerificationSchema);