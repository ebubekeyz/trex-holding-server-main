const mongoose = require('mongoose');

const PenaltySchema = new mongoose.Schema(
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
    userIdNumber: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Penalty', PenaltySchema);
