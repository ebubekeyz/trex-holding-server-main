const { BadRequestError, UnauthenticatedError } = require('../errors');
const CustomError = require('../errors');
const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { attachCookiesToResponse, createTokenUser } = require('../utils');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
  const {
    fullName,
    username,
    email,
    phone,
    country,
    password,
    city,
    zip,
    state,
  } = req.body;
  const emailAlreadyExist = await User.findOne({ email });
  if (emailAlreadyExist) {
    throw new BadRequestError('Email already exist');
  }

  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? 'admin' : 'user';

  const user = await User.create({
    fullName,
    username,
    email,
    phone,
    country,
    password,
    role,
    city,
    zip,
    state,
  });

  const tokenUser = createTokenUser(user);

  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new BadRequestError('Username or Password should not be empty');
  }

  const user = await User.findOne({ username });
  if (!user) {
    throw new UnauthenticatedError('Invalid Credentials');
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Password does not match');
  }

  const tokenUser = createTokenUser(user);

  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const logout = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.clearCookie();
  res.status(StatusCodes.OK).json({ msg: 'user logged out' });
};

// const logout = async (req, res) => {
//   res.cookie('token', 'logout', {
//     httpOnly: true,
//     expires: new Date(Date.now()),
//     secure: process.env.NODE_ENV === 'production',
//     domain: 'trex-holding-server.com',
//     signed: true,
//     sameSite: 'None',
//     path: '/',
//   });
//   res.clearCookie('token', { path: '/' });
//   res.status(StatusCodes.OK).json({ msg: 'user logged out' });
// };

const passwordReset = async (req, res) => {
  const { newPassword, password } = req.body;

  if (newPassword !== password) {
    throw new CustomError.BadRequestError('Password did not match');
  }

  if (!newPassword || !password) {
    throw new CustomError.BadRequestError('No field must be empty');
  }

  const { id: userId } = req.params;

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  const user = await User.findOneAndUpdate(
    { _id: userId },
    { newPassword, password: hashPassword },
    { new: true, runValidators: true }
  );
  console.log(userId);
  if (!user) {
    throw new NotFoundError(`No user with id ${userId} `);
  }

  console.log(user);

  const tokenUser = createTokenUser(user);

  attachCookiesToResponse({ res, user: tokenUser });

  res
    .status(StatusCodes.OK)
    .json({ user: tokenUser, msg: 'Password has been reset' });
};

const sendEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new CustomError.BadRequestError('Email must not be empty');
  }

  const user = await User.findOne({ email });
  console.log(user._id);
  const id = user._id;

  if (!user) {
    throw new CustomError.BadRequestError('Email does not exist');
  }

  let testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: process.env.GMAIL_HOST,
    port: process.env.GMAIL_PORT,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  let info = await transporter.sendMail({
    from: `"Support" <trex-holdiing-official@outlook.com>`,
    to: `${email}`,
    subject: 'Password Reset Link',
    html: `<a href="https://trex-holding.com/resetPassword?id=${id}">Click this link to reset your password </a>`,
  });

  res.status(StatusCodes.OK).json({ user, info });
};
module.exports = {
  register,
  login,
  logout,
  sendEmail,
  passwordReset,
};
