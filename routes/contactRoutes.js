const express = require('express');

const router = express.Router();

const {
  createContact,
  sendMessage,
  getAllContacts,
} = require('../controllers/contactController');

router.route('/').post(createContact).get(getAllContacts).post(sendMessage);

module.exports = router;
