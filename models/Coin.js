const mongoose = require('mongoose');

const CoinSchema = new mongoose.Schema(
  {
    coinType: {
      type: String,
    },

    invest: {
      type: mongoose.Types.ObjectId,
      ref: 'Invest',
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

module.exports = mongoose.model('Coin', CoinSchema);
