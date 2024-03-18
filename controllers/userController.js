const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const {
  createTokenUser,
  attachCookiesToResponse,
  checkPermissions,
} = require('../utils');

const getAllUsers = async (req, res) => {
  // console.log(req.user)
  const users = await User.find({ role: 'user' }).select('-password');
  res.status(StatusCodes.OK).json({ users });
};
const getSingleUser = async (req, res) => {
  const { id: userId } = req.params;

  const user = await User.findOne({ _id: userId }).select('-password');
  if (!user) {
    throw new CustomError.BadRequestError(
      `No user withy id  ${userId} was found`
    );
  }
  checkPermissions(req.user, user._id);

  res.status(StatusCodes.OK).json({ user });
};
const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

const updateUser = async (req, res) => {
  const {
    fullName,
    username,
    phone,
    country,
    city,
    zip,
    state,
    email,
    bitcoinAddress,
    etherumAddress,
    usdtTrc2Address,
    bitcoinCashAddress,
    liteCoinAddress,
    bnbAddress,
    tronAddress,
    xrpAddress,
    dogeCoinAddress,
  } = req.body;

  const user = await User.findOneAndUpdate(
    { _id: req.user.userId },
    {
      fullName,
      username,
      phone,
      city,
      zip,
      state,
      country,
      email,
      bitcoinAddress,
      etherumAddress,
      usdtTrc2Address,
      bitcoinCashAddress,
      liteCoinAddress,
      bnbAddress,
      tronAddress,
      xrpAddress,
      dogeCoinAddress,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  const tokenUser = createTokenUser(user);

  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.OK).json({ user: tokenUser });
};
const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError('Please provide both values');
  }

  const user = await User.findOne({ _id: req.user.userId });
  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError(
      'Password did not match existing user'
    );
  }

  user.password = newPassword;

  await user.save();

  res
    .status(StatusCodes.OK)
    .json({ msg: 'Successful, Password has been updated' });
};

const deleteUser = async (req, res) => {
  const { id: userId } = req.params;
  const user = await User.findByIdAndRemove({ _id: userId });

  if (!user) {
    throw new CustomError.BadRequestError(`No user with user id ${userId}`);
  }

  res.status(StatusCodes.OK).json({ msg: `user deleted successfully` });
};
module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
  deleteUser,
};
