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

// const updateBalance = async (req, res) => {
//   const { balance } = req.body;
//   const { id: balanceId } = req.params;
//   const balanceMain = await AccountBalance.findOne({ _id: balanceId });
//   if (!balanceId) {
//     throw new CustomError.BadRequestError(
//       `No balance with id ${balanceId} exist`
//     );
//   }

//   balanceMain.balance = balance;

//   await balanceMain.save();
//   res.status(StatusCodes.OK).json({ msg: 'Balance successfully updated' });
// };

const updateBalance = async (req, res) => {
  const { balance } = req.body;
  const { id: balanceId } = req.params;
  const balanceMain = await AccountBalance.findOneAndUpdate(
    { _id: balanceId },
    { balance },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!balanceId) {
    throw new CustomError.BadRequestError(
      `No balance with id ${balanceId} exist`
    );
  }
  res.status(StatusCodes.OK).json({ msg: 'Balance successfully updated' });
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

const getUserBalance2 = async (req, res) => {
  const { id: userId } = req.params;
  const balance = await AccountBalance.find({ user: userId });
  res.status(StatusCodes.OK).json({ balance, count: balance.length });
};

const deleteBalance = async (req, res) => {
  const balance = await AccountBalance.deleteMany();

  res.status(StatusCodes.OK).json({ msg: 'Balance successfully deleted' });
};

const deleteUserBalance = async (req, res) => {
  const { id: userId } = req.params;
  const balance = await AccountBalance.deleteMany({ user: userId });

  res.status(StatusCodes.OK).json({ msg: 'Balance successfully deleted' });
};

module.exports = {
  createBalance,
  getAllBalance,
  getUserBalance,
  updateBalance,
  getSingleBalance,
  deleteBalance,
  getUserBalance2,
  deleteUserBalance,
};
