const Referral = require('../models/Referral');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');

const createReferral = async (req, res) => {
  req.body.user = req.user.userId;

  const referral = await Referral.create(req.body);

  res.status(StatusCodes.CREATED).json({ referral });
};
const updateReferral = async (req, res) => {
  const { id: referralId } = req.params;
  const referral = await Referral.findOneAndUpdate(
    { _id: referralId },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!referralId) {
    throw new CustomError.BadRequestError(
      `No referral with id ${referralId} exist`
    );
  }

  res.status(StatusCodes.OK).json({ referral });
};
const getUserReferral = async (req, res) => {
  const referral = await Referral.find({ user: req.user.userId });
  res.status(StatusCodes.OK).json({ referral, count: referral.length });
};

const getAllReferral = async (req, res) => {
  const referral = await Referral.find({}).populate({
    path: 'user',
    select: 'fullName',
  });

  res.status(StatusCodes.OK).json({ referral, count: referral.length });
};

const deleteAllReferral = async (req, res) => {
  const referral = await Referral.deleteMany();

  res.status(StatusCodes.OK).json({ msg: 'Referral successfully deleted' });
};

module.exports = {
  createReferral,
  updateReferral,
  getAllReferral,
  getUserReferral,
  deleteAllReferral,
};
