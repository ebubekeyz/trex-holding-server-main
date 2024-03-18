const Amount = require('../models/Amount');
const Coin = require('../models/Coin');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');

const createAmount = async (req, res) => {
  const { coin: coinId } = req.body;

  const isValidCoin = await Coin.findOne({ _id: coinId });

  if (!isValidCoin) {
    throw new CustomError.NotFoundError(`No coin with id ${coinId}`);
  }
  req.body.user = req.user.userId;
  const amount = await Amount.create(req.body);
  res.status(StatusCodes.CREATED).json({ amount });
};

const getAllAmount = async (req, res) => {
  const amount = await Amount.find({})
    .populate({
      path: 'coin',
      select: 'coinType',
    })
    .populate({
      path: 'user',
      select: 'fullName',
    });
  res.status(StatusCodes.OK).json({ amount, count: amount.length });
};

const getUserAmount = async (req, res) => {
  const amount = await Amount.find({ user: req.user.userId });
  res.status(StatusCodes.OK).json({ amount, count: amount.length });
};

const getSingleCoinAmount = async (req, res) => {
  const { id: coinId } = req.params;
  const amount = await Amount.find({ coin: coinId });
  res.status(StatusCodes.OK).json({ amount });
};

const updateAmount = async (req, res) => {
  const { status } = req.body;
  const { id: amountId } = req.params;
  const amountMain = await Amount.findOne({ _id: amountId });
  if (!amountId) {
    throw new CustomError.BadRequestError(
      `No amount with id ${amountId} exist`
    );
  }

  amountMain.status = status;

  await amountMain.save();
  res.status(StatusCodes.OK).json({ msg: 'Amount successfully deposited' });
};

const getSingleAmount = async (req, res) => {
  const { id: amountId } = req.params;
  const amount = await Amount.findOne({ _id: amountId });
  if (!amountId) {
    throw new CustomError.BadRequestError(
      `No amount with id ${amountId} exist`
    );
  }
  res.status(StatusCodes.OK).json({ amount });
};

const deleteAmount = async (req, res) => {
  const { id: amountId } = req.params;
  const amount = await Amount.findByIdAndRemove({ _id: amountId });
  if (!amountId) {
    throw new CustomError.BadRequestError(
      `No amount with id ${amountId} exist`
    );
  }
  res.status(StatusCodes.OK).json({ msg: 'Amount successfully deposited' });
};

module.exports = {
  createAmount,
  getAllAmount,
  getUserAmount,
  updateAmount,
  getSingleAmount,
  deleteAmount,
  getSingleCoinAmount,
};
