const PayReceipt = require('../models/PayReceipt');
const Amount = require('../models/Amount');
const Coin = require('../models/Coin');
const Invest = require('../models/Invest');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const nodemailer = require('nodemailer');

//new17

const createPayReceipt = async (req, res) => {
  const { amount: amountId } = req.body;

  const isValidAmount = await Amount.findOne({ _id: amountId });

  if (!isValidAmount) {
    throw new CustomError.NotFoundError(`No amount with id ${amountId}`);
  }
  req.body.user = req.user.userId;
  const payReceipt = await PayReceipt.create(req.body);

  const amount = await Amount.find({ user: req.user.userId });

  let { status, _id: amountId2, amount: amt } = amount[amount.length - 1];
  console.log(status, amountId2);
  const handleAmount = () => {
    status = 'confirmed';
  };

  const coin = await Coin.find({ user: req.user.userId });

  let { coinType } = coin[coin.length - 1];
  const invest = await Invest.find({ user: req.user.userId });

  let { plan } = invest[invest.length - 1];

  const { status: stat, receipt } = payReceipt;

  const email = req.user.email;
  const fullName = req.user.fullName;

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
    from: `"Support" <ebubeofforjoe@gmail.com>`,
    to: `ebubeofforjoe@gmail.com`,
    subject: `Payment Request from ${fullName}`,
    html: `
    <div style="background: rgb(241, 234, 234); border-radius: 0.5rem; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); padding: 2rem; text-align: center;margin: 1rem auto; width: 80vw;">
    
     <p ><span  style="font-weight: bold;">Status: </span><span>${stat}</span></p>
     <p><span style="font-weight: bold;">Receipt: </span><span><img src="https://trex-holding.onrender.com/${receipt}" style="width:5rem;object-fit:contain; " /></span></p>

       <p><span style="font-weight: bold">Amount: </span><span>€${amt}</span></p>
        <p><span style="font-weight: bold">Plan: </span><span>${plan}</span></p>
        <p><span style="font-weight: bold">Coin: </span><span>${coinType}</span></p>

    

       <p style="font-weight: bold">Visit your Dashboard to approve Request</p>
     </div>`,
  });

  let info2 = await transporter.sendMail({
    from: `"Support" <ebubeofforjoe@gmail.com>`,
    to: `${email}`,
    subject: `Payment Sent`,
    html: `<div style="background: rgb(241, 234, 234); border-radius: 0.5rem; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); padding: 2rem; text-align: center;margin: 1rem auto;">

    <img src="https://trex-holding-server.com/uploads/logo.png" style="width: 20rem; text-align: center" alt="logo"/>

    <p style="line-height: 1.5">Your Payment was successfully sent and awaits approval. Your balance will reflect immediately after approval is done and you will get your interest at due date.</p>

    <P style="line-height: 1.5">Best Regards</P>
    <P style="line-height: 1.5">Trex-Holding Team</P>
    </div>`,
  });
  res.status(StatusCodes.CREATED).json({ payReceipt });
};

const getAllPayReceipt = async (req, res) => {
  const payReceipt = await PayReceipt.find({})
    .populate({
      path: 'amount',
      populate: {
        path: 'coin',
        select: 'coinType invest',
        populate: { path: 'invest', select: 'plan percent days' },
      },
      select: 'amount status',
    })
    .populate({
      path: 'user',
      select: 'username',
    });

  res.status(StatusCodes.OK).json({ payReceipt, count: payReceipt.length });
};

const getUserPayReceipt = async (req, res) => {
  const payReceipt = await PayReceipt.find({ user: req.user.userId }).populate({
    path: 'amount',
    populate: {
      path: 'coin',
      select: 'coinType invest',
      populate: { path: 'invest', select: 'plan percent days' },
    },
    select: 'amount status',
  });

  res.status(StatusCodes.OK).json({ payReceipt, count: payReceipt.length });
};

const updatePayReceipt = async (req, res) => {
  const { id: payReceiptId } = req.params;
  const payReceipt = await PayReceipt.findOneAndUpdate(
    { _id: payReceiptId },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!payReceiptId) {
    throw new CustomError.BadRequestError(
      `No PayReceipt with id ${payReceiptId} exist`
    );
  }

  res.status(StatusCodes.OK).json({ payReceipt });
};

const getSinglePayReceipt = async (req, res) => {
  const { id: payReceiptId } = req.params;
  const payReceipt = await PayReceipt.findOne({ _id: payReceiptId });
  if (!payReceiptId) {
    throw new CustomError.BadRequestError(
      `No PayReceipt with id ${payReceiptId} exist`
    );
  }
  res.status(StatusCodes.OK).json({ payReceipt });
};

const deletePayReceipt = async (req, res) => {
  const { id: payReceiptId } = req.params;
  const payReceipt = await PayReceipt.findByIdAndRemove({ _id: payReceiptId });
  if (!payReceiptId) {
    throw new CustomError.BadRequestError(
      `No PayReceipt with id ${payReceiptId} exist`
    );
  }
  res.status(StatusCodes.OK).json({ msg: 'PayReceipt successfully deleted' });
};

// const deleteUserPayReceipt = async (req, res) => {
//   const { id: userId } = req.params;
//   const payReceipt = await PayReceipt.deleteMany({ user: userId });

//   res.status(StatusCodes.OK).json({ msg: 'PayReceipt successfully deleted' });
// };

const deleteAllPayReceipt = async (req, res) => {
  const payReceipt = await PayReceipt.deleteMany();

  res.status(StatusCodes.OK).json({ msg: 'PayReceipt successfully deleted' });
};

const getUserPayReceipt2 = async (req, res) => {
  const { id: userId } = req.params;
  const payReceipt = await PayReceipt.find({ user: userId }).populate({
    path: 'amount',
    populate: {
      path: 'coin',
      select: 'coinType invest',
      populate: { path: 'invest', select: 'plan percent days' },
    },
    select: 'amount status',
  });
  res.status(StatusCodes.OK).json({ payReceipt, count: payReceipt.length });
};

const deleteUserPayReceipt = async (req, res) => {
  const { id: userId } = req.params;
  const payReceipt = await PayReceipt.deleteMany({ user: userId });

  res.status(StatusCodes.OK).json({ msg: 'payReceipt successfully deleted' });
};

module.exports = {
  deleteUserPayReceipt,
  createPayReceipt,
  getAllPayReceipt,
  getUserPayReceipt,
  updatePayReceipt,
  getSinglePayReceipt,
  deletePayReceipt,
  deleteAllPayReceipt,
  getUserPayReceipt2,
  // deleteUserPayReceipt,
};
