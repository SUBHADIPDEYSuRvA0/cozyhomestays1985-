const mongoose = require('mongoose');

const ListingTypeSchema = new mongoose.Schema({
  propertyId: {
    type: String,  // or ObjectId if linked to Property model
    required: true,
      // one listing type per property
  },
  listingType: {
    type: String,
    enum: ['roomWise', 'entireProperty'],
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, { timestamps: true });

const ListingType = mongoose.model('ListingType', ListingTypeSchema);
module.exports = ListingType;
