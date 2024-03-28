const express = require('express');

const router = express.Router();

const {
  authenticateUser,
  authenticatePermissions,
} = require('../middleware/authentication');

const {
  createPayReceipt,
  getAllPayReceipt,
  getSinglePayReceipt,
  updatePayReceipt,
  deletePayReceipt,
  getUserPayReceipt,
  deleteAllPayReceipt,
  getUserPayReceipt2,
  deleteUserPayReceipt,
} = require('../controllers/payReceiptController');

router
  .route('/')
  .get([authenticateUser], getAllPayReceipt)
  .post([authenticateUser], createPayReceipt)
  .delete(authenticateUser, deleteAllPayReceipt);
router.route('/showUserPayReceipt').get(authenticateUser, getUserPayReceipt);
router
  .route('/:id')
  .patch([authenticateUser], updatePayReceipt)
  .delete(
    [authenticateUser, authenticatePermissions('admin')],
    deletePayReceipt
  )
  .get([authenticateUser], getSinglePayReceipt);

router
  .route('/:id/showUserPayReceipt')
  .get(authenticateUser, getUserPayReceipt2);

router
  .route('/:id/deleteUserPayReceipt')
  .delete(authenticateUser, deleteUserPayReceipt);

module.exports = router;
