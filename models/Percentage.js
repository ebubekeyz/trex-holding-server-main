const mongoose = require('mongoose');

const PercentageSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Percentage', PercentageSchema);
