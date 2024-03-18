const express = require('express');

const router = express.Router();

const {
  authenticateUser,
  authenticatePermissions,
} = require('../middleware/authentication');

const {
  createDeposit,
  getAllDeposit,
  getSingleDeposit,
  updateDeposit,
  deleteDeposit,
  getUserDeposit,
} = require('../controllers/depositController');

router
  .route('/')
  .get([authenticateUser], getAllDeposit)
  .post([authenticateUser], createDeposit);
router.route('/showUserDeposit').get(authenticateUser, getUserDeposit);
router
  .route('/:id')
  .patch([authenticateUser], updateDeposit)
  .delete([authenticateUser, authenticatePermissions('admin')], deleteDeposit)
  .get([authenticateUser], getSingleDeposit);

module.exports = router;
