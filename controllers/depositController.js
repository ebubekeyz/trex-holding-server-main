const Deposit = require('../models/Deposit');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { checkPermissions } = require('../utils');

const nodemailer = require('nodemailer');

const createDeposit = async (req, res) => {
  req.body.user = req.user.userId;
  const deposit = await Deposit.create(req.body);

  res.status(StatusCodes.CREATED).json({ deposit });
};

const getAllDeposit = async (req, res) => {
  const deposit = await Deposit.find({});
  res.status(StatusCodes.OK).json({ deposit, count: deposit.length });
};

const getUserDeposit = async (req, res) => {
  const deposit = await Deposit.find({ user: req.user.userId });
  res.status(StatusCodes.OK).json({ deposit, count: deposit.length });
};

const updateDeposit = async (req, res) => {
  const { selectPlan, enterAmountToWithdraw, paymentMethod, profit } = req.body;
  const { id: depositId } = req.params;
  const deposit = await Deposit.findOne({ _id: depositId });
  if (!depositId) {
    throw new CustomError.BadRequestError(
      `No deposit with id ${depositId} exist`
    );
  }
  checkPermissions(req.user, deposit.user);
  deposit.selectPlan = selectPlan;
  deposit.enterAmountToWithdraw = enterAmountToWithdraw;
  deposit.paymentMethod = paymentMethod;
  deposit.profit = profit;

  await deposit.save();
  res.status(StatusCodes.OK).json({ msg: 'Deposit successfully updated' });
};

const getSingleDeposit = async (req, res) => {
  const { id: depositId } = req.params;
  const deposit = await Deposit.findOne({ _id: depositId });
  if (!depositId) {
    throw new CustomError.BadRequestError(
      `No deposit with id ${depositId} exist`
    );
  }
  res.status(StatusCodes.OK).json({ deposit });
};

const deleteDeposit = async (req, res) => {
  const { id: depositId } = req.params;
  const deposit = await Deposit.findByIdAndRemove({ _id: depositId });
  if (!depositId) {
    throw new CustomError.BadRequestError(
      `No deposit with id ${depositId} exist`
    );
  }
  res.status(StatusCodes.OK).json({ msg: 'deposit successfully deleted' });
};

const deleteAllDeposit = async (req, res) => {
  const deposit = await Deposit.deleteMany();

  res.status(StatusCodes.OK).json({ msg: 'Deposit successfully deleted' });
};

module.exports = {
  createDeposit,
  getAllDeposit,
  getUserDeposit,
  updateDeposit,
  getSingleDeposit,
  deleteAllDeposit,
  deleteDeposit,
};
