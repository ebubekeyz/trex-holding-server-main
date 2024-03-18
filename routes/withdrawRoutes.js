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
} = require('../controllers/withdrawController');

router
  .route('/')
  .get([authenticateUser], getAllWithdraw)
  .post([authenticateUser], createWithdraw);
router.route('/showUserWithdraw').get(authenticateUser, getUserWithdraw);
router
  .route('/:id')
  .patch([authenticateUser], updateWithdraw)
  .delete([authenticateUser, authenticatePermissions('admin')], deleteWithdraw)
  .get([authenticateUser], getSingleWithdraw);

module.exports = router;
