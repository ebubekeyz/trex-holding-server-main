const express = require('express');
const router = express.Router();

const { uploadReceipt } = require('../controllers/receiptController');

router.route('/').post(uploadReceipt);

module.exports = router;
