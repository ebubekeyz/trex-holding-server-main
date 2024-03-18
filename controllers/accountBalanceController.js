const AccountBalance = require('../models/AccountBalance');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');

const createBalance = async (req, res) => {
  const { coin: coinId } = req.body;

  req.body.user = req.user.userId;
  const balance = await AccountBalance.create(req.body);
  res.status(StatusCodes.CREATED).json({ balance });
};

const getAllBalance = async (req, res) => {
  const balance = await AccountBalance.find({});

  res.status(StatusCodes.OK).json({ balance, count: balance.length });
};

const getUserBalance = async (req, res) => {
  const balance = await AccountBalance.find({ user: req.user.userId });
  res.status(StatusCodes.OK).json({ balance, count: balance.length });
};

const getSingleBalance = async (req, res) => {
  const { id: balanceId } = req.params;
  const balance = await AccountBalance.findOne({ _id: balanceId });
  if (!balanceId) {
    throw new CustomError.BadRequestError(
      `No balance with id ${balanceId} exist`
    );
  }
  res.status(StatusCodes.OK).json({ balance });
};

module.exports = {
  createBalance,
  getAllBalance,
  getUserBalance,
  getSingleBalance,
};
