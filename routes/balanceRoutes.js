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
  deleteBalance,
  getUserBalance2,
  deleteUserBalance,
} = require('../controllers/accountBalanceController');

router
  .route('/')
  .get([authenticateUser], getAllBalance)
  .post([authenticateUser], createBalance)
  .delete(authenticateUser, deleteBalance);
router.route('/showUserBalance').get(authenticateUser, getUserBalance);

router.route('/showBalance').get(authenticateUser, getUserBalance2);
router
  .route('/:id')
  .get([authenticateUser], getSingleBalance)
  .patch(authenticateUser, updateBalance);
router.route('/:id/showUserBalance').get(authenticateUser, getUserBalance2);

router
  .route('/:id/deleteUserBalance')
  .delete(authenticateUser, deleteUserBalance);

module.exports = router;
