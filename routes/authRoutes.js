const express = require('express');
const router = express.Router();

const {
  register,
  login,
  logout,
  passwordReset,
  sendEmail,
} = require('../controllers/authController');

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/:id').patch(passwordReset);
router.route('/sendEmail').post(sendEmail);

module.exports = router;
