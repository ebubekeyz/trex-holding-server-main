const mongoose = require('mongoose');

const DepositSchema = new mongoose.Schema(
  {
    selectPlan: {
      type: String,
      required: true,
    },
    enterAmountToWithdraw: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    profit: {
      type: Number,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Deposit', DepositSchema);
