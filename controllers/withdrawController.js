const Withdraw = require('../models/Withdraw');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { checkPermissions } = require('../utils');
const User = require('../models/User');
const nodemailer = require('nodemailer');

const createWithdraw = async (req, res) => {
  const { fullName, email } = req.user;
  console.log(fullName);
  req.body.user = req.user.userId;
  const withdraw = await Withdraw.create(req.body);
  const {
    withdrawalMethod,
    amount,
    withdrawalCode,
    status,
    currentBalance,
    walletAddress,
  } = withdraw;

  console.log(amount);

  // const fullName = await Withdraw.findOneAndRemove({ user: req.user.fullName });
  // console.log(fullName);
  // const email = await Withdraw.findOne({ user: req.user.email });
  // console.log(email);

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
    subject: `Withdrawal Request from ${req.user.username}`,
    html: `
    <div style="background: rgb(241, 234, 234); border-radius: 0.5rem; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); padding: 2rem; text-align: center;margin: 1rem auto;">
     <p style="line-height: 1.5"><span>Status: </span><span>${status}</span></p>
    

       <p style="line-height: 1.5"><span>withdrawalMethod: </span><span>${withdrawalMethod}</span></p>

       <p style="line-height: 1.5"><span>Amount: </span><span>${amount}</span></p>

       <p style="line-height: 1.5"><span>Wallet Address: </span><span>${walletAddress}</span></p>

       p style="line-height: 1.5">Visit your Dashboard to approve Request</p>
     </div>`,
  });

  let info2 = await transporter.sendMail({
    from: `"Support" <support@trex-holding.com>`,
    to: `${email}`,
    subject: `Withdrawal Request Sent`,
    html: `<div style="background: green; padding: 1rem; color: white;">


    <p style="line-height: 1.5">Your withdrawal Request was successfully sent. Payment may take 15 minutes to process.</p>

    <P style="line-height: 1.5">Best Regards</P>
    <P style="line-height: 1.5">Trex-Holding Team</P>
    </div>`,
  });

  res.status(StatusCodes.CREATED).json({ withdraw });
};

const getAllWithdraw = async (req, res) => {
  const withdraw = await Withdraw.find({}).populate({
    path: 'user',
    select: 'username',
  });
  let { withdrawalMethod, amount, withdrawalCode, status, currentBalance } =
    withdraw;

  res.status(StatusCodes.OK).json({ withdraw, count: withdraw.length });
};

const getUserWithdraw = async (req, res) => {
  const withdraw = await Withdraw.find({ user: req.user.userId });
  res.status(StatusCodes.OK).json({ withdraw, count: withdraw.length });
};

const updateWithdraw = async (req, res) => {
  const { id: withdrawId } = req.params;

  const withdraw = await Withdraw.findOneAndUpdate(
    { _id: withdrawId },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  const email = req.user.email;
  const username = req.user.username;

  const { amount, withdrawalMethod, walletAddress, status, withdrawalCode } =
    withdraw;
  console.log(withdraw);
  if (!withdraw) {
    throw new CustomError.BadRequestError(
      `No withdrawal with id ${withdrawId}`
    );
  }

  const date = new Date();
  const year = date.getFullYear();
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
    subject: `Withdrawal has been Sent to ${username}`,
    html: `<div style="background: rgb(241, 234, 234); border-radius: 0.5rem; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); padding: 2rem; text-align: center;margin: 1rem auto;">

 <img src="https://trex-holding-server.com//uploads/logo.png" style="width: 15rem; text-align: center" alt="logo"/>

  <p style="font-weight: bold">WITHDRAWAL SUCCESSFUL</p>
     <p>Hello ${username}</p>

      <p style="font-weight: bold">Your withdrawal has been sent to the details you provided below</p>

    <p style="font-weight: bold">Username</p>
     <p>${username}</p>

    <p style="font-weight: bold">Amount</p>
     <p>€${amount}</p>


     <p style="font-weight: bold">Coin</p>
     <p>${withdrawalMethod}</p>

       <p style="font-weight: bold">Wallet Address</p>
     <p>${walletAddress}</p>


       <p style="font-weight: bold">Withdrawal Code</p>
     <p>${withdrawalCode}</p>


     <p style="font-weight: bold">Status</p>
     <p>${status}</p>

      <p style="font-weight: bold">We are glad to serve you and we look forward to partnering with you to achieve more financial exploits. enjoy your earnings and let our bonding grow stronger.</p>

       <p style="font-weight: bold">Warm Regards</p>

     <p style="font-weight: bold">This is an auto generated email, please do not reply to this email. For enquiry and questions, kindly contact our live support service on our website or contact us at <a href="https://trex-holding.com">support@trex-holding.com</a></p>

      <p style="font-weight: bold">Payment Processed</p>
    </div>`,
  });

  let info2 = await transporter.sendMail({
    from: `"Support" <support@trex-holding.com>`,
    to: `${email}`,
    subject: `Withdrawal has been Sent`,
    html: `<div style="background: rgb(241, 234, 234); border-radius: 0.5rem; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); padding: 2rem; text-align: center;margin: 1rem auto;">

 <img src="https://trex-holding-server.com//uploads/logo.png" style="width: 15rem; text-align: center" alt="logo"/>

     <p style="font-weight: bold">WITHDRAWAL SUCCESSFUL</p>
     <p>Hello ${username}</p>

      <p style="font-weight: bold">Your withdrawal has been sent to the details you provided below</p>

    <p style="font-weight: bold">Username</p>
     <p>${username}</p>

    <p style="font-weight: bold">Amount</p>
     <p>€${amount}</p>


     <p style="font-weight: bold">Coin</p>
     <p>${withdrawalMethod}</p>

       <p style="font-weight: bold">Wallet Address</p>
     <p>${walletAddress}</p>


       <p style="font-weight: bold">Transaction Batch</p>
     <p>${withdrawalCode}</p>


     <p style="font-weight: bold">Status</p>
     <p>${status}</p>

      <p style="font-weight: bold">We are glad to serve you and we look forward to partnering with you to achieve more financial exploits. enjoy your earnings and let our bonding grow stronger.</p>

       <p style="font-weight: bold">Warm Regards</p>

     <p style="font-weight: bold">This is an auto generated email, please do not reply to this email. For enquiry and questions, kindly contact our live support service on our website or contact us at <b>support@trex-holding.com</b></p>

      <p style="font-weight: bold">Payment Processed</p>
    <p>${year} <a href="https://trex-holding.com">https://trex-holding.com</a></p>
    </div>`,
  });

  res.status(StatusCodes.OK).json({ withdraw });
};

const getSingleWithdraw = async (req, res) => {
  const { id: withdrawId } = req.params;
  const withdraw = await Withdraw.findOne({ _id: depositId });
  if (!withdrawId) {
    throw new CustomError.BadRequestError(
      `No withdrawal with id ${withdrawId} exist`
    );
  }
  res.status(StatusCodes.OK).json({ withdraw });
};

const deleteWithdraw = async (req, res) => {
  const { id: withdrawId } = req.params;
  const withdraw = await Withdraw.findByIdAndRemove({ _id: withdrawId });
  if (!withdrawId) {
    throw new CustomError.BadRequestError(
      `No withdraw with id ${withdrawId} exist`
    );
  }
  res.status(StatusCodes.OK).json({ msg: 'Withdrawal successfully deleted' });
};

const deleteAllWithdraw = async (req, res) => {
  const withdraw = await Withdraw.deleteMany();

  res.status(StatusCodes.OK).json({ msg: 'Withdraw successfully deleted' });
};

const deleteUserWithdraw = async (req, res) => {
  const { id: userId } = req.params;
  const withdraw = await Withdraw.deleteMany({ user: userId });

  res.status(StatusCodes.OK).json({ msg: 'Withdraw successfully deleted' });
};

module.exports = {
  deleteUserWithdraw,
  createWithdraw,
  getAllWithdraw,
  getUserWithdraw,
  updateWithdraw,
  getSingleWithdraw,
  deleteWithdraw,
  deleteAllWithdraw,
};
