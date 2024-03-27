const Profit = require('../models/Profit');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const nodemailer = require('nodemailer');

const createProfit = async (req, res) => {
  req.body.user = req.user.userId;
  const profit = await Profit.create(req.body);

  res.status(StatusCodes.OK).json({ profit, count: profit.length });
};

const getAllProfit = async (req, res) => {
  const profit = await Profit.find({});

  res.status(StatusCodes.OK).json({ profit, count: profit.length });
};

const getUserProfit = async (req, res) => {
  const profit = await Profit.find({ user: req.user.userId });

  res.status(StatusCodes.OK).json({ profit, count: profit.length });
};

const updateProfit = async (req, res) => {
  const { amount } = req.body;
  const { id: profitId } = req.params;
  const profit = await Profit.findOne({ _id: profitId });
  if (!profitId) {
    throw new CustomError.BadRequestError(
      `No PayReceipt with id ${profitId} exist`
    );
  }

  profit.amount = amount;

  await profit.save();
  res.status(StatusCodes.OK).json({ msg: 'Profit successfully updated' });
};

const getSingleProfit = async (req, res) => {
  const { id: profitId } = req.params;
  const profit = await Profit.findOne({ _id: profitId });
  if (!profitId) {
    throw new CustomError.BadRequestError(
      `No PayReceipt with id ${profitId} exist`
    );
  }
  res.status(StatusCodes.OK).json({ profit });
};

const deleteProfit = async (req, res) => {
  const { id: profitId } = req.params;
  const profit = await Profit.findByIdAndRemove({ _id: profitId });
  if (!profitId) {
    throw new CustomError.BadRequestError(
      `No PayReceipt with id ${profitId} exist`
    );
  }
  res.status(StatusCodes.OK).json({ msg: 'Profit successfully deleted' });
};

const deleteAllProfit = async (req, res) => {
  const profit = await Profit.deleteMany();

  res.status(StatusCodes.OK).json({ msg: 'Profit successfully deleted' });
};

const getUserProfit2 = async (req, res) => {
  const { id: userId } = req.params;
  const profit = await Profit.find({ user: userId });
  res.status(StatusCodes.OK).json({ profit, count: profit.length });
};

const deleteUserProfit = async (req, res) => {
  const { id: userId } = req.params;
  const profit = await Profit.deleteMany({ user: userId });

  res.status(StatusCodes.OK).json({ msg: 'profit successfully deleted' });
};

module.exports = {
  deleteUserProfit,
  createProfit,
  getAllProfit,
  getUserProfit,
  updateProfit,
  getSingleProfit,
  getUserProfit2,
  deleteProfit,
  deleteAllProfit,
};
