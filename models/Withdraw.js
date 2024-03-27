const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const WithdrawSchema = new mongoose.Schema(
  {
    withdrawalMethod: {
      type: String,
    },
    amount: {
      type: Number,
      min: [0, 'Amount should not be less than 0'],
      max: [59999, 'Amount should not be more than 59999'],
    },

    withdrawalCode: {
      type: String,
    },
    walletAddress: {
      type: String,
    },

    status: {
      type: String,
      enum: ['processing', 'sent'],
      default: 'processing',
    },
    currentBalance: {
      type: Number,
      default: 200,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Withdraw', WithdrawSchema);
