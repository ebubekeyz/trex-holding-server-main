const Invest = require('../models/Invest');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');

const createInvest = async (req, res) => {
  req.body.user = req.user.userId;
  const invest = await Invest.create(req.body);
  res.status(StatusCodes.CREATED).json({ invest });
};

const getAllInvest = async (req, res) => {
  const invest = await Invest.find({});
  res.status(StatusCodes.OK).json({ invest, count: invest.length });
};

const getUserInvest = async (req, res) => {
  const invest = await Invest.find({ user: req.user.userId });
  res.status(StatusCodes.OK).json({ invest, count: invest.length });
};

const updateInvest = async (req, res) => {
  const { plan, amount, max, percent, days, profit } = req.body;
  const { id: investId } = req.params;
  const investMain = await Invest.findOne({ _id: investId });
  if (!investId) {
    throw new CustomError.BadRequestError(
      `No invest with id ${investId} exist`
    );
  }

  investMain.plan = plan;
  investMain.percent = percent;
  investMain.max = max;
  investMain.days = days;
  investMain.profit = profit;
  investMain.total = total;
  investMain.amount = amount;

  await investMain.save();
  res.status(StatusCodes.OK).json({ msg: 'invest successfully deposited' });
};

const getSingleInvest = async (req, res) => {
  const { id: investId } = req.params;
  const invest = await Invest.findOne({ _id: investId });
  if (!investId) {
    throw new CustomError.BadRequestError(
      `No invest with id ${investId} exist`
    );
  }
  res.status(StatusCodes.OK).json({ invest });
};

const deleteInvest = async (req, res) => {
  const { id: investId } = req.params;
  const invest = await Invest.findByIdAndRemove({ _id: investId });
  if (!investId) {
    throw new CustomError.BadRequestError(
      `No invest with id ${investId} exist`
    );
  }
  res.status(StatusCodes.OK).json({ msg: 'invest successfully deposited' });
};

const deleteAllInvest = async (req, res) => {
  const invest = await Invest.deleteMany();

  res.status(StatusCodes.OK).json({ msg: 'Invest successfully deleted' });
};

const deleteUserInvest = async (req, res) => {
  const { id: userId } = req.params;
  const invest = await Invest.deleteMany({ user: userId });

  res.status(StatusCodes.OK).json({ msg: 'invest successfully deleted' });
};

module.exports = {
  deleteUserInvest,
  createInvest,
  getAllInvest,
  getUserInvest,
  updateInvest,
  getSingleInvest,
  deleteInvest,
  deleteAllInvest,
};
