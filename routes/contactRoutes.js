const express = require('express');

const router = express.Router();

const {
  createContact,
  sendMessage,
  getAllContacts,
  deleteContact,
} = require('../controllers/contactController');

router.route('/').post(createContact).get(getAllContacts).post(sendMessage);

router.route('/:id').delete(deleteContact);

module.exports = router;
