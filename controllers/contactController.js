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
    from: `"Support" <support@trex-holding.com>`,
    to: `support@trex-holding.com`,
    subject: `New Message from ${name}`,
    html: `
    <div style="background: rgb(241, 234, 234); border-radius: 0.5rem; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); padding: 2rem; text-align: center;margin: 1rem auto;">
     <p style="line-height: 1.5"><span>Name: </span><span>${name}</span></p>
    

       <p style="line-height: 1.5"><span>Email: </span><span>${email}</span></p>

       <p style="line-height: 1.5"><span>Enquiry Type: </span><span>${enquiryType}</span></p>

       <p style="line-height: 1.5"><span>Enquiry Description: </span><span>${enquiryDescription}</span></p>
     </div>`,
  });

  let info2 = await transporter.sendMail({
    from: `"Support" <support@trex-holding.com>`,
    to: `${email}`,
    subject: `Thank you for contacting us.`,
    html: `<div style="background: rgb(241, 234, 234); border-radius: 0.5rem; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); padding: 2rem; text-align: center;margin: 1rem auto;">

    <p style="line-height: 1.5">Our Support team will get back to you in less than 24 hours.</p>

    </div>`,
  });

  res.status(StatusCodes.OK).json({ info });
};

const deleteContact = async (req, res) => {
  const { id: contactId } = req.params;
  const contact = await Contact.findByIdAndRemove({ _id: contactId });

  if (!contact) {
    throw new CustomError.BadRequestError(`No user with user id ${contactId}`);
  }

  res.status(StatusCodes.OK).json({ msg: `user deleted successfully` });
};

module.exports = {
  createContact,
  sendMessage,
  getAllContacts,
  deleteContact,
};
