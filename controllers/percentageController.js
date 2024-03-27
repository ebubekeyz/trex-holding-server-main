const Percentage = require('../models/Percentage');
const PayReceipt = require('../models/PayReceipt');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const nodemailer = require('nodemailer');

const createPercentage = async (req, res) => {
  req.body.user = req.user.userId;
  const percentage = await Percentage.create(req.body);

  res.status(StatusCodes.OK).json({ percentage, count: percentage.length });
};

const getAllPercentage = async (req, res) => {
  const percentage = await Percentage.find({});

  res.status(StatusCodes.OK).json({ percentage, count: percentage.length });
};

const getUserPercentage = async (req, res) => {
  const percentage = await Percentage.find({ user: req.user.userId });

  res.status(StatusCodes.OK).json({ percentage, count: percentage.length });
};

const updatePercentage = async (req, res) => {
  const { amount } = req.body;
  const { id: percentageId } = req.params;
  const percentage = await Percentage.findOne({ _id: percentageId });
  if (!percentageId) {
    throw new CustomError.BadRequestError(
      `No Percentage with id ${percentageId} exist`
    );
  }

  percentage.amount = amount;

  await percentage.save();
  res.status(StatusCodes.OK).json({ msg: 'Percentage successfully updated' });
};

const getSinglePercentage = async (req, res) => {
  const { id: percentageId } = req.params;
  const percentage = await Percentage.findOne({ _id: percentageId });
  if (!percentageId) {
    throw new CustomError.BadRequestError(
      `No Percentage with id ${percentageId} exist`
    );
  }
  res.status(StatusCodes.OK).json({ Percentage });
};

const deletePercentage = async (req, res) => {
  const { id: percentageId } = req.params;
  const percentage = await Percentage.findByIdAndRemove({ _id: percentageId });
  if (!percentageId) {
    throw new CustomError.BadRequestError(
      `No Percentage with id ${percentageId} exist`
    );
  }
  res.status(StatusCodes.OK).json({ msg: 'Percentage successfully deleted' });
};

const deleteAllPercentage = async (req, res) => {
  const percentage = await Percentage.deleteMany();

  res.status(StatusCodes.OK).json({ msg: 'Percentage successfully deleted' });
};

const getUserPercentage2 = async (req, res) => {
  const { id: userId } = req.params;
  const percentage = await Percentage.find({ user: userId });
  res.status(StatusCodes.OK).json({ percentage, count: percentage.length });
};

const deleteUserPercentage = async (req, res) => {
  const { id: userId } = req.params;
  const percentage = await Percentage.deleteMany({ user: userId });

  res.status(StatusCodes.OK).json({ msg: 'percentage successfully deleted' });
};

module.exports = {
  deleteUserPercentage,
  createPercentage,
  getAllPercentage,
  getUserPercentage,
  updatePercentage,
  getSinglePercentage,
  deletePercentage,
  deleteAllPercentage,
  getUserPercentage2,
};
