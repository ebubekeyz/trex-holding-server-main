const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/authentication');
const {
  createReferral,
  getAllReferral,
  getUserReferral,
  deleteAllReferral,
} = require('../controllers/referralController');

router
  .route('/')
  .post(authenticateUser, createReferral)
  .get(authenticateUser, getAllReferral)
  .delete(authenticateUser, deleteAllReferral);

router.route('/showUserReferral').get(authenticateUser, getUserReferral);

module.exports = router;
