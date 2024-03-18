const Contact = require('../models/Contact');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const nodemailer = require('nodemailer');

const createContact = async (req, res) => {
  const { name, email, enquiryType, enquiryDescription } = req.body;
  const contact = await Contact.create({
    name,
    email,
    enquiryType,
    enquiryDescription,
  });
  res.status(StatusCodes.CREATED).json({ contact });
};

const getAllContacts = async (req, res) => {
  const contact = await Contact.find({});
  res.status(StatusCodes.OK).json({ contact });
};
const sendMessage = async (req, res) => {
  let { name, email, enquiryType, enquiryDescription } = req.body;

  if (!email || !name || !enquiryType || !enquiryDescription) {
    throw new CustomError.BadRequestError('No input should be left blank');
  }

  //   const contact = await Contact.findOne({ email });

  //   const id = contact._id;
  //   name = contact.name;
  //   email = contact.email;
  //   enquiryType = contact.enquiryType;
  //   enquiryDescription = contact.enquiryDescription;

  //   console.log(name, email, enquiryType, enquiryDescription);

  let testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: process.env.GMAIL_HOST,
    port: process.env.GMAIL_PORT,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  let info = await transporter.sendMail({
    from: `"${name}" <${email}>`,
    to: `ebubeofforjoe@gmail.com`,
    subject: `${enquiryType}`,
    html: `<p>${enquiryDescription} </p>`,
  });

  res.status(StatusCodes.OK).json({ info });
};

module.exports = {
  createContact,
  sendMessage,
  getAllContacts,
};
