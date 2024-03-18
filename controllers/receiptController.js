const path = require('path');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');

const uploadReceipt = async (req, res) => {
  if (!req.files) {
    throw new CustomError.BadRequestError('No File Uploaded');
  }
  const receipt = req.files.image;

  if (!receipt.mimetype.startsWith('image')) {
    throw new CustomError.BadRequestError('Please Upload Image');
  }
  //   const maxSize = 1024 * 1024;
  //   if (receipt.size > maxSize) {
  //     throw new CustomError.BadRequestError('Please upload image smaller 1MB');
  //   }
  const imagePath = path.join(
    __dirname,
    '../public/uploads/' + `${receipt.name}`
  );
  await receipt.mv(imagePath);
  return res
    .status(StatusCodes.OK)
    .json({ image: { src: `/uploads/${receipt.name}` } });
};

module.exports = {
  uploadReceipt,
};
