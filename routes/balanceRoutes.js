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
  updateBalance,
} = require('../controllers/accountBalanceController');

router
  .route('/')
  .get([authenticateUser], getAllBalance)
  .post([authenticateUser], createBalance);
router.route('/showUserBalance').get(authenticateUser, getUserBalance);
router
  .route('/:id')
  .get([authenticateUser], getSingleBalance)
  .patch(authenticateUser, updateBalance);

module.exports = router;
