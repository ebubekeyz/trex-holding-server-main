const express = require('express');

const router = express.Router();

const {
  authenticateUser,
  authenticatePermissions,
} = require('../middleware/authentication');

const {
  createPercentage,
  getAllPercentage,
  getSinglePercentage,
  updatePercentage,
  deletePercentage,
  getUserPercentage,
  deleteAllPercentage,
  getUserPercentage2,
  deleteUserPercentage,
} = require('../controllers/percentageController');

router
  .route('/')
  .get([authenticateUser], getAllPercentage)
  .post([authenticateUser], createPercentage)
  .delete(authenticateUser, deleteAllPercentage);
router.route('/showUserPercentage').get(authenticateUser, getUserPercentage);
router
  .route('/:id')
  .patch([authenticateUser], updatePercentage)
  .delete(
    [authenticateUser, authenticatePermissions('admin')],
    deletePercentage
  )
  .get([authenticateUser], getSinglePercentage);

router
  .route('/:id/showUserPercentage')
  .get(authenticateUser, getUserPercentage2);

router
  .route('/:id/deleteUserPercentage')
  .delete(authenticateUser, deleteUserPercentage);

module.exports = router;
