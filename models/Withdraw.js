const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const WithdrawSchema = new mongoose.Schema(
  {
    withdrawalMethod: {
      type: String,
    },
    amount: {
      type: Number,
      min: [5000, 'Amount should not be less than 5000'],
      max: [100000, 'Amount should not be more than 100000'],
    },
    bankName: {
      type: String,
    },
    accountName: {
      type: String,
    },
    accountNumber: {
      type: Number,
    },
    withdrawalCode: {
      type: String,
      default: uuidv4(),
    },
    walletAddress: {
      type: String,
    },
    charge: {
      type: Number,
      default: 0,
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
