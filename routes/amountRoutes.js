const express = require('express');

const router = express.Router();

const {
  authenticateUser,
  authenticatePermissions,
} = require('../middleware/authentication');

const {
  createAmount,
  getAllAmount,
  getSingleAmount,
  updateAmount,
  deleteAmount,
  getUserAmount,
  getSingleCoinAmount,
} = require('../controllers/amountController');

router
  .route('/')
  .get([authenticateUser], getAllAmount)
  .post([authenticateUser], createAmount);
router.route('/showUserAmount').get(authenticateUser, getUserAmount);
router
  .route('/:id')
  .patch([authenticateUser], updateAmount)
  .delete([authenticateUser, authenticatePermissions('admin')], deleteAmount)
  .get([authenticateUser], getSingleAmount);

router.route('/:id/amount').get(getSingleCoinAmount);

module.exports = router;
