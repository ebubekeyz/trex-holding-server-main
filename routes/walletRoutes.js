const express = require('express');

const router = express.Router();

const {
  authenticateUser,
  authenticatePermissions,
} = require('../middleware/authentication');

const {
  createWallet,
  getAllWallet,
  getSingleWallet,
  updateWallet,
  deleteWallet,
  getUserWallet,
  deleteAllWallet,
  getUserWallet2,
  deleteUserWallet,
} = require('../controllers/walletController');

router
  .route('/')
  .get([authenticateUser], getAllWallet)
  .post([authenticateUser], createWallet)
  .delete(authenticateUser, deleteAllWallet);
router.route('/showUserWallet').get(authenticateUser, getUserWallet);
router
  .route('/:id')
  .patch([authenticateUser], updateWallet)
  .delete([authenticateUser, authenticatePermissions('admin')], deleteWallet)
  .get([authenticateUser], getSingleWallet);

router.route('/:id/showUserWallet').get(authenticateUser, getUserWallet2);

router
  .route('/:id/deleteUserWallet')
  .delete(authenticateUser, deleteUserWallet);

module.exports = router;
