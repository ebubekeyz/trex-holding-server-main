const Wallet = require('../models/Wallet');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');

const createWallet = async (req, res) => {
  const { coin: walletId } = req.body;

  req.body.user = req.user.userId;
  const wallet = await Wallet.create(req.body);
  res.status(StatusCodes.CREATED).json({ wallet });
};

const getAllWallet = async (req, res) => {
  const wallet = await Wallet.find({}).populate({
    path: 'user',
    select: 'fullName',
  });
  res.status(StatusCodes.OK).json({ wallet, count: wallet.length });
};

const getUserWallet = async (req, res) => {
  const wallet = await Wallet.find({ user: req.user.userId });
  res.status(StatusCodes.OK).json({ wallet, count: wallet.length });
};

const updateWallet = async (req, res) => {
  const { id: walletId } = req.params;
  const wallet = await Wallet.findOneAndUpdate({ _id: walletId }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!walletId) {
    throw new CustomError.BadRequestError(
      `No wallet with id ${walletId} exist`
    );
  }

  res.status(StatusCodes.OK).json({ msg: 'Wallet successfully updated' });
};

const getSingleWallet = async (req, res) => {
  const { id: walletId } = req.params;
  const wallet = await Wallet.findOne({ _id: walletId });
  if (!walletId) {
    throw new CustomError.BadRequestError(
      `No wallet with id ${walletId} exist`
    );
  }
  res.status(StatusCodes.OK).json({ wallet });
};

const deleteWallet = async (req, res) => {
  const { id: walletId } = req.params;
  const wallet = await Wallet.findByIdAndRemove({ _id: walletId });
  if (!walletId) {
    throw new CustomError.BadRequestError(
      `No wallet with id ${walletId} exist`
    );
  }
  res.status(StatusCodes.OK).json({ msg: 'Amount successfully deposited' });
};

const deleteAllWallet = async (req, res) => {
  const wallet = await Wallet.deleteMany();

  res.status(StatusCodes.OK).json({ msg: 'Wallet successfully deleted' });
};

const getUserWallet2 = async (req, res) => {
  const { id: userId } = req.params;
  const wallet = await Wallet.find({ user: userId });
  res.status(StatusCodes.OK).json({ wallet, count: wallet.length });
};

const deleteUserWallet = async (req, res) => {
  const { id: userId } = req.params;
  const wallet = await wallet.deleteMany({ user: userId });

  res.status(StatusCodes.OK).json({ msg: 'wallet successfully deleted' });
};

module.exports = {
  createWallet,
  getAllWallet,
  getUserWallet,
  getUserWallet2,
  updateWallet,
  getSingleWallet,
  deleteWallet,
  deleteAllWallet,
  deleteUserWallet,
};
