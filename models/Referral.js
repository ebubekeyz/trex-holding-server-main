const mongoose = require('mongoose');

const ReferralSchema = new mongoose.Schema(
  {
    refId: {
      type: String,
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

module.exports = mongoose.model('Referral', ReferralSchema);
