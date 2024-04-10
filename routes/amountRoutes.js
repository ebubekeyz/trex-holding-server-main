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
  deleteAllAmount,
  getUserAmount2,
  deleteUserAmount,
} = require('../controllers/amountController');

router
  .route('/')
  .get([authenticateUser], getAllAmount)
  .post([authenticateUser], createAmount)
  .delete(authenticateUser, deleteAllAmount);
router.route('/showUserAmount').get(authenticateUser, getUserAmount);
router
  .route('/:id')
  .patch([authenticateUser], updateAmount)
  .delete([authenticateUser, authenticatePermissions('admin')], deleteAmount)
  .get([authenticateUser], getSingleAmount);

router.route('/:id/showUserAmount').get(authenticateUser, getUserAmount2);

router
  .route('/:id/deleteUserAmount')
  .delete(authenticateUser, deleteUserAmount);

module.exports = router;
