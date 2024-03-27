const Earning = require('../models/Earning');
const PayReceipt = require('../models/PayReceipt');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const nodemailer = require('nodemailer');

const createEarning = async (req, res) => {
  req.body.user = req.user.userId;
  const earning = await Earning.create(req.body);

  res.status(StatusCodes.OK).json({ earning, count: earning.length });
};

const getAllEarning = async (req, res) => {
  const earning = await Earning.find({});

  res.status(StatusCodes.OK).json({ earning, count: earning.length });
};

const getUserEarning = async (req, res) => {
  const earning = await Earning.find({ user: req.user.userId });

  res.status(StatusCodes.OK).json({ earning, count: earning.length });
};

const updateEarning = async (req, res) => {
  const { amount } = req.body;
  const { id: earningId } = req.params;
  const earning = await Earning.findOne({ _id: earningId });
  if (!earningId) {
    throw new CustomError.BadRequestError(
      `No PayReceipt with id ${earningId} exist`
    );
  }

  earning.amount = amount;

  await earning.save();
  res.status(StatusCodes.OK).json({ msg: 'Earning successfully updated' });
};

const getSingleEarning = async (req, res) => {
  const { id: earningId } = req.params;
  const earning = await Earning.findOne({ _id: earningId });
  if (!earningId) {
    throw new CustomError.BadRequestError(
      `No PayReceipt with id ${earningId} exist`
    );
  }
  res.status(StatusCodes.OK).json({ earning });
};

const deleteEarning = async (req, res) => {
  const { id: earningId } = req.params;
  const earning = await Earning.findByIdAndRemove({ _id: earningId });
  if (!earningId) {
    throw new CustomError.BadRequestError(
      `No PayReceipt with id ${earningId} exist`
    );
  }
  res.status(StatusCodes.OK).json({ msg: 'Earning successfully deleted' });
};

const deleteAllEarning = async (req, res) => {
  const earning = await Earning.deleteMany();

  res.status(StatusCodes.OK).json({ msg: 'Earning successfully deleted' });
};

const getUserEarning2 = async (req, res) => {
  const { id: userId } = req.params;
  const earning = await Earning.find({ user: userId });
  res.status(StatusCodes.OK).json({ earning, count: earning.length });
};

module.exports = {
  createEarning,
  getAllEarning,
  getUserEarning,
  updateEarning,
  getSingleEarning,
  deleteEarning,
  deleteAllEarning,
  getUserEarning2,
};
