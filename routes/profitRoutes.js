const express = require('express');

const router = express.Router();

const {
  authenticateUser,
  authenticatePermissions,
} = require('../middleware/authentication');

const {
  createProfit,
  getAllProfit,
  getSingleProfit,
  updateProfit,
  deleteProfit,
  getUserProfit,
  deleteAllProfit,
  getUserProfit2,
  deleteUserProfit,
} = require('../controllers/profitController');

router
  .route('/')
  .get([authenticateUser], getAllProfit)
  .post([authenticateUser], createProfit)
  .delete(authenticateUser, deleteAllProfit);
router.route('/showUserProfit').get(authenticateUser, getUserProfit);
router
  .route('/:id')
  .patch([authenticateUser], updateProfit)
  .delete([authenticateUser, authenticatePermissions('admin')], deleteProfit)
  .get([authenticateUser], getSingleProfit);

router.route('/:id/showUserProfit').get(authenticateUser, getUserProfit2);

router
  .route('/:id/deleteUserProfit')
  .delete(authenticateUser, deleteUserProfit);

module.exports = router;
