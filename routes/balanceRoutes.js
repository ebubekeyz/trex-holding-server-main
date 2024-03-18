const express = require('express');

const router = express.Router();

const {
  authenticateUser,
  authenticatePermissions,
} = require('../middleware/authentication');

const {
  createBalance,
  getAllBalance,
  getUserBalance,
  getSingleBalance,
} = require('../controllers/accountBalanceController');

router
  .route('/')
  .get([authenticateUser], getAllBalance)
  .post([authenticateUser], createBalance);
router.route('/showUserBalance').get(authenticateUser, getUserBalance);
router.route('/:id').get([authenticateUser], getSingleBalance);

module.exports = router;
