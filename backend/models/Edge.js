const mongoose = require('mongoose');

const EdgeSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Node',
      required: [true, 'From node is required'],
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Node',
      required: [true, 'To node is required'],
    },
    weight: {
      type: Number,
      required: [true, 'Weight (distance/time) is required'],
      min: [0, 'Weight must be non-negative'],
    },
    directed: {
      type: Boolean,
      default: false, // false = two-way road
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Edge', EdgeSchema);
