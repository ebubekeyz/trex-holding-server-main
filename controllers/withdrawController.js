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
    bankName,
    accountName,
    accountNumber,
    withdrawalCode,
    charge,
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
    from: `"${fullName}" <${email}>`,
    to: `Trexholding539@gmail.com`,
    subject: 'Withdrawal Request',
    html: `<div display: grid, grid-template-columns: 1fr; justify-content: center;>

     <article style="display: grid; justify-content: center; grid-template-columns: 1fr 1fr; align-self: center; gap: 2rem;">
    <span style="font-weight: bold">Name: </span>
    <p>${fullName}</p>
    </article>

      <article style="display: grid; justify-content: center; grid-template-columns: 1fr 1fr; align-self: center; gap: 2rem;">
    <span style="font-weight: bold">Withdrawal Method: </span>
    <p>${withdrawalMethod}</p>
    </article>

     <article style="display: grid; justify-content: center; grid-template-columns: 1fr 1fr; align-self: center; gap: 2rem;">
    <span style="font-weight: bold">Amount: </span>
    <p>${amount}</p>
    </article>

     <article style="display: grid; justify-content: center; grid-template-columns: 1fr 1fr; align-self: center; gap: 2rem;">
    <span style="font-weight: bold">Bank Name: </span>
    <p>${bankName}</p>
    </article>

      <article style="display: grid; justify-content: center; grid-template-columns: 1fr 1fr; align-self: center; gap: 2rem;">
    <span style="font-weight: bold">Account Name: </span>
    <p>${accountName}</p>
    </article>

     <article style="display: grid; justify-content: center; grid-template-columns: 1fr 1fr; align-self: center; gap: 2rem;">
    <span style="font-weight: bold">Account Number: </span>
    <p>${accountNumber}</p>
    </article>

     

      <article style="display: grid; justify-content: center; grid-template-columns: 1fr 1fr; align-self: center; gap: 2rem;">
    <span style="font-weight: bold">Withdrawal Code: </span>
    <p>${withdrawalCode}</p>
    </article>

    

    <article style="display: grid; justify-content: center; grid-template-columns: 1fr 1fr; align-self: center; gap: 2rem;">
    <span style="font-weight: bold">Status: </span>
    <p>${status}</p>
    </article>

     <article style="display: grid; justify-content: center; grid-template-columns: 1fr 1fr; align-self: center; gap: 2rem;">
    <span style="font-weight: bold">WalletAddress: </span>
    <p>${walletAddress}</p>
    </article>

     <article style="display: grid; justify-content: center; grid-template-columns: 1fr 1fr; align-self: center; gap: 2rem;">
    <span style="font-weight: bold">Current Balance: </span>
      <p>${currentBalance}</p>
    </article>
    </div>`,
  });

  res.status(StatusCodes.CREATED).json({ withdraw });
};

const getAllWithdraw = async (req, res) => {
  const withdraw = await Withdraw.find({});
  let {
    withdrawalMethod,
    amount,
    bankName,
    accountName,
    accountNumber,
    withdrawalCode,
    charge,
    status,
    currentBalance,
  } = withdraw;

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
  if (!withdraw) {
    throw new CustomError.BadRequestError(
      `No withdrawal with id ${withdrawId}`
    );
  }
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

module.exports = {
  createWithdraw,
  getAllWithdraw,
  getUserWithdraw,
  updateWithdraw,
  getSingleWithdraw,
  deleteWithdraw,
  deleteAllWithdraw,
};
