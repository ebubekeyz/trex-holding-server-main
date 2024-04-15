const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
    },
    username: {
      type: String,
    },
    balance: {
      type: Number,
      min: 0,
      default: 0,
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      validate: {
        validator: validator.isEmail,
        message: 'Please provide valid email',
      },
      unique: true,
    },
    phone: {
      type: String,
    },
    country: {
      type: String,
    },
    city: {
      type: String,
    },
    zip: {
      type: Number,
    },
    state: {
      type: String,
    },
    password: {
      type: String,
      required: [true, 'Password length should not be less than 6'],
      minlength: 6,
    },
    walletAddress: {
      type: String,
    },
    coins: {
      type: String,
    },
    status: {
      type: String,
      enum: ['unverified', 'verified'],
      default: 'unverified',
    },
    referralId: {
      type: String,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isWait = await bcrypt.compare(candidatePassword, this.password);
  return isWait;
};

module.exports = mongoose.model('User', UserSchema);
