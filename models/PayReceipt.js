const mongoose = require('mongoose');

const PayReceiptSchema = new mongoose.Schema(
  {
    receipt: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'paid'],
      default: 'pending',
    },
    balance: {
      type: Number,
      min: 0,
      default: 0,
    },
    profit: {
      type: Number,
      default: 0,
    },
    refBonus: {
      type: Number,
      default: 0,
    },
    balanceStatus: {
      type: String,
      enum: ['pending', 'confirmed'],
      default: 'pending',
    },
    addAmount: {
      type: Number,
      default: 0,
    },

    amount: {
      type: mongoose.Types.ObjectId,
      ref: 'Amount',
      required: true,
    },

    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PayReceipt', PayReceiptSchema);
