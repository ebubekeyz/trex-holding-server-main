const express = require('express');

const router = express.Router();

const {
  authenticateUser,
  authenticatePermissions,
} = require('../middleware/authentication');

const {
  createWithdraw,
  getAllWithdraw,
  getSingleWithdraw,
  updateWithdraw,
  deleteWithdraw,
  getUserWithdraw,
  deleteAllWithdraw,
  deleteUserWithdraw,
} = require('../controllers/withdrawController');

router
  .route('/')
  .get([authenticateUser], getAllWithdraw)
  .post([authenticateUser], createWithdraw)
  .delete(authenticateUser, deleteAllWithdraw);
router.route('/showUserWithdraw').get(authenticateUser, getUserWithdraw);
router
  .route('/:id')
  .patch([authenticateUser], updateWithdraw)
  .delete([authenticateUser, authenticatePermissions('admin')], deleteWithdraw)
  .get([authenticateUser], getSingleWithdraw);

router
  .route('/:id/deleteUserWithdraw')
  .delete(authenticateUser, deleteUserWithdraw);

module.exports = router;
