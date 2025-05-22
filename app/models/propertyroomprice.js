const mongoose = require('mongoose');
const propertyaminities = require('./propertyaminities');
const Schema = mongoose.Schema;

const occasionPriceSchema = new Schema({
  name: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  price: { type: Number, required: true }
});

const discountSchema = new Schema({
  isActive: { type: Boolean, default: false },
  bookingsLimit: { type: Number, default: 3 },
  percentage: { type: Number, default: 0 },
  usedCount: { type: Number, default: 0 }
});

const roomPriceSchema = new Schema({
  userId:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  propertyId:     { type: String, required: true },
  roomId:         { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },

  basePrice:      { type: Number, required: true },
  dayWisePrices:  { type: Map, of: Number, default: {} },
  occasionPrices: [occasionPriceSchema],
  discount:       discountSchema,
  checkInTime:    { type: Date, required: true },      // fixed typo
  checkOutTime:   { type: Date, required: true },      // fixed typo
  createdAt:      { type: Date, default: Date.now },
  updatedAt:      { type: Date, default: Date.now },
  propertycategory:      { type: mongoose.Schema.Types.ObjectId, ref: 'PropertyCategory', required: true },
  propertyListingType:   { type: mongoose.Schema.Types.ObjectId, ref: 'ListingType', required: true },
  PropertyPolicy:        { type: mongoose.Schema.Types.ObjectId, ref: 'PropertyPolicy', required: true },
  fullproperty:          { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  PropertyAddress:       { type: mongoose.Schema.Types.ObjectId, ref: 'PropertyAddress', required: true },
  propertyaminities: { type: mongoose.Schema.Types.ObjectId, ref: 'PropertyAminity' }
});

// Always update updatedAt on save
roomPriceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('RoomPrice', roomPriceSchema);