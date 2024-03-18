const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const WithdrawSchema = new mongoose.Schema(
  {
    withdrawalMethod: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
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
      required: true,
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
