const mongoose = require('mongoose');

const NodeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Node name is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['academic', 'hostel', 'canteen', 'gate', 'sports', 'admin', 'library', 'recreation', 'medical', 'facility', 'other'],
      default: 'other',
    },
    lat: {
      type: Number,
      required: [true, 'Latitude is required'],
    },
    lng: {
      type: Number,
      required: [true, 'Longitude is required'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Node', NodeSchema);
