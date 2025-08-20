const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
      required: true
    },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: false },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Review', reviewSchema);
