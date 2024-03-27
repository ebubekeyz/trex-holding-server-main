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
    referralId,
    phone,
    country,
    password,
    city,
    status,
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
    status,
    referralId,
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
    from: `"Support" <support@trex-holding.com>`,
    to: `support@trex-holding.com`,
    subject: 'New User Registration Alert',
    html: `<div style="background: rgb(241, 234, 234); border-radius: 0.5rem; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); padding: 2rem; text-align: center;margin: 1rem auto;">
     <p style="line-height: 1.5"><span>FullName: </span><span>${fullName}</span></p>
     <p style="line-height: 1.5"><span>Username: </span><span>${username}</span></p>
     <p style="line-height: 1.5"><span>Email: </span><span>${email}</span></p>
     <p style="line-height: 1.5"><span>Country: </span><span>${country}</span></p>
     <p style="line-height: 1.5"><span>Phone: </span><span>${phone}</span></p>
     </div>`,
  });

  let info2 = await transporter.sendMail({
    from: `"Support" <support@trex-holding.com>`,
    to: `${email}`,
    subject: `Welcome to Trex-Holding.com`,
    html: `<div style="background: rgb(241, 234, 234); border-radius: 0.5rem; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); padding: 2rem; text-align: center;margin: 1rem auto;">

    <img src="https://trex-holding-server.com//uploads/logo.png" style="width: 15rem; text-align: center" alt="logo"/>

    <p style="font-weight: bold; line-height: 1.5">Welcome to Trex-Holding!</p>

    <p style="font-weight: bold; line-height: 1.5">Dear ${username}</p>

    <p style="line-height: 1.5">We are thrilled to welcome you to Trex-Holding, the leading platform for simplified and efficient trading. Thank you for choosing us to embark on your investment journey!</p>

    <p style="line-height: 1.5">At Trex-Holding, We understand that navigating the financial markets can sometimes be overwhelming, especially for new Investors. That's why we have developed a user-friendly and intuitive platform designed to simplify the trading process and empower traders of all levels.</p>

    <p style="line-height: 1.5">If you have any questions or need assistance, please don't hesitate to reach out to our support team. We are here to help you.<p>

    <p style="line-height: 1.5">Once again, welcome to Trex-Holding! We look forward to being a part of your Investment success.</p>

    <p style="line-height: 1.5">Best Regards,</p>
    <p style="line-height: 1.5">The Trex-Holding Team</p>

    </div>`,
  });
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
  console.log(user.email);

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Password does not match');
  }

  const tokenUser = createTokenUser(user);

  attachCookiesToResponse({ res, user: tokenUser });

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
    from: `"Support" <support@trex-holding.com>`,
    to: `support@trex-holding.com`,
    subject: 'Login Alert',
    html: `<div style="background: rgb(241, 234, 234); border-radius: 0.5rem; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); padding: 2rem; text-align: center;margin: 1rem auto;">
     <p style="line-height: 1.5"><span>FullName: </span><span>${username}</span></p>
     <p style="line-height: 1.5"><span>Username: </span><span>${password}</span></p>
     </div>`,
  });

  let info2 = await transporter.sendMail({
    from: `"Support" <support@trex-holding.com>`,
    to: `${user.email}`,
    subject: `Welcome ${username} to trex-holding.com`,
    html: `<div style="background: green; padding: 1rem; color: white;">We trust you would have a good experience with us..</div>`,
  });

  res.status(StatusCodes.OK).json({ user: tokenUser });
};

// const logout = async (req, res) => {
//   res.cookie('token', 'logout', {
//     httpOnly: true,
//     expires: new Date(Date.now()),
//   });
//   res.clearCookie();
//   res.status(StatusCodes.OK).json({ msg: 'user logged out' });
// };

const logout = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
    secure: process.env.NODE_ENV === 'production',
    domain: 'trex-holding-server.com',
    signed: true,
    sameSite: 'None',
    path: '/',
  });
  res.clearCookie('token', { path: '/' });
  res.status(StatusCodes.OK).json({ msg: 'user logged out' });
};

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
    from: `"Support" <support@trex-holding.com>`,
    to: `support@trex-holding.com`,
    subject: 'Password Reset Alert',
    html: `<div style="background: rgb(241, 234, 234); border-radius: 0.5rem; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); padding: 2rem; text-align: center;margin: 1rem auto;">
  <p style="line-height: 1.5"><span>Username: </span><span>${user.username}</span></p>
     <p style="line-height: 1.5"><span>New Password: </span><span>${newPassword}</span></p>
     </div>`,
  });

  let info2 = await transporter.sendMail({
    from: `"Support" <support@trex-holding.com>`,
    to: `${user.email}`,
    subject: 'Password Reset',
    html: `<div style="background: rgb(241, 234, 234); border-radius: 0.5rem; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); padding: 2rem; text-align: center;margin: 1rem auto;">
     <p style="line-height: 1.5">Your password was successfully reset</p>
     <p style="line-height: 1.5"><span>New Password: </span>${newPassword}<span></span></p>
     </div>`,
  });

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
    from: `"Support" <support@trex-holding.com>`,
    to: `${email}`,
    subject: 'Password Reset Link',
    html: `
    <div style="background: rgb(241, 234, 234); border-radius: 0.5rem; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); padding: 2rem; text-align: center;margin: 1rem auto;">
    <p style="line-height: 1.5"> <a href="https://trex-holding.com/resetPassword?id=${id}">Click this link to reset your password </a></p>
    </div>
   `,
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
