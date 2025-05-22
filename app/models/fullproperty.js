const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  totalRooms: { type: Number, required: true, min: 1 },
  maxAttendant: { type: Number, required: true, min: 1 },
  propertyId: {
    type: String,
    required: true
  },
   addextrabed: { type: Boolean, default: false },
    addextrabed_charge: { type: Number, default: 0 },
    extraguistcharge: { type: Number, default: 0 },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  roomTypes: {
    single: { type: Boolean, default: false },
    double: { type: Boolean, default: false }
  },

  totalSingleRooms: { type: Number, min: 0, default: 0 },
  totalDoubleRooms: { type: Number, min: 0, default: 0 },

  washroomStyle: { type: String, enum: ['Indian', 'Western', 'Both'], required: true },
  washroomType: { type: String, enum: ['Attached', 'Common', 'Both'], required: true },
 status: { type: String,
   enum: ['processing', 'approved', 'rejected'],
   default: 'processing' 
  },
  mediaInput: [
    {
      filename: String,
      path: String,
      mimetype: String,
      isMain: { type: Boolean, default: false }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('fullproperty', roomSchema);
