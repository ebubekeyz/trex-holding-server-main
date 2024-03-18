const mongoose = require('mongoose');

const AccountBalanceSchema = new mongoose.Schema(
  {
    balance: {
      type: Number,
      min: 250,
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

module.exports = mongoose.model('AccountBalance', AccountBalanceSchema);
