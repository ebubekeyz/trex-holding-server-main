const Coin = require('../models/Coin');
const Invest = require('../models/Invest');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');

const createCoin = async (req, res) => {
  const { invest: investId } = req.body;

  const isValidInvest = await Invest.findOne({ _id: investId });

  if (!isValidInvest) {
    throw new CustomError.NotFoundError(`No invest with id ${investId}`);
  }
  //  const alreadySubmitted = await Coin.findOne({
  //    invest: investId,
  //    user: req.user.userId,
  //  });

  //  if (alreadySubmitted) {
  //    throw new CustomError.BadRequestError(
  //      'Already submitted coins for this invest'
  //    );
  //  }

  req.body.user = req.user.userId;

  const coin = await Coin.create(req.body);

  res.status(StatusCodes.CREATED).json({ coin });
};

const getUserCoin = async (req, res) => {
  const coin = await Coin.find({ user: req.user.userId });
  res.status(StatusCodes.OK).json({ coin, count: coin.length });
};

const updateCoin = async (req, res) => {
  const { coinType } = req.body;
  const { id: coinId } = req.params;
  const coinMain = await Coin.findOne({ _id: coinId });
  if (!coinId) {
    throw new CustomError.BadRequestError(`No amount with id ${coinId} exist`);
  }

  coinMain.coinType = coinType;

  await coinMain.save();
  res.status(StatusCodes.OK).json({ msg: 'Coin successfully updated' });
};

const getAllCoin = async (req, res) => {
  const coin = await Coin.find({})
    .populate({
      path: 'invest',
      select: 'plan amount percent days dailyProfit profit total',
    })
    .populate({
      path: 'user',
      select: 'fullName',
    });
  res.status(StatusCodes.OK).json({ coin, count: coin.length });
};

const getSingleInvestCoin = async (req, res) => {
  const { id: investId } = req.params;
  const coin = await Coin.find({ invest: investId });
  res.status(StatusCodes.OK).json({ coin });
};

const getSingleCoin = async (req, res) => {
  const { id: coinId } = req.params;
  const coin = await Coin.findOne({ _id: coinId });
  if (!coin) {
    throw new CustomError.NotFoundError(`No coin with id ${coinId}`);
  }
  res.status(StatusCodes.OK).json({ coin });
};

const deleteCoin = async (req, res) => {
  const { id: coinId } = req.params;
  const coin = await Coin.findOne({ _id: coinId });
  if (!coin) {
    throw new CustomError.NotFoundError(`No coin with id ${coinId}`);
  }

  await coin.deleteOne();
  res.status(StatusCodes.OK).json({ msg: 'Success, coin removed' });
};

const deleteAllCoin = async (req, res) => {
  const coin = await Coin.deleteMany();

  res.status(StatusCodes.OK).json({ msg: 'Coin successfully deleted' });
};

const deleteUserCoin = async (req, res) => {
  const { id: userId } = req.params;
  const coin = await Coin.deleteMany({ user: userId });

  res.status(StatusCodes.OK).json({ msg: 'coin successfully deleted' });
};

module.exports = {
  updateCoin,
  deleteUserCoin,
  createCoin,
  getAllCoin,
  getSingleCoin,
  getUserCoin,
  deleteCoin,
  getSingleInvestCoin,
  deleteAllCoin,
};
