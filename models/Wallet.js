const mongoose = require('mongoose');

const WalletSchema = new mongoose.Schema(
  {
    btc: {
      type: String,
    },

    eth: {
      type: String,
    },

    usdt: {
      type: String,
    },

    tron: {
      type: String,
    },

    bnb: {
      type: String,
    },

    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Wallet', WalletSchema);
