const mongoose = require('mongoose');

const PayReceiptSchema = new mongoose.Schema(
  {
    receipt: {
      type: String,
      required: true,
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
