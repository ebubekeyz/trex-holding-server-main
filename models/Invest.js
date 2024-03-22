const mongoose = require('mongoose');

const InvestSchema = new mongoose.Schema(
  {
    plan: {
      type: String,
    },
    amount: {
      type: Number,
    },
    max: {
      type: Number,
    },
    percent: {
      type: Number,
    },

    days: {
      type: Number,
    },
    profit: {
      type: Number,
    },
    dailyProfit: {
      type: Number,
    },
    total: {
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

// InvestSchema.pre('save', async function (next) {
//   this.profit = ((this.amount * this.percent) / 100) * this.days;
//   this.dailyProfit = (this.amount * this.percent) / 100;
//   this.total = this.profit + this.amount;
//   next();
// });

module.exports = mongoose.model('Invest', InvestSchema);
