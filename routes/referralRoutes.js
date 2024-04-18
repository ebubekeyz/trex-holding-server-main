const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/authentication');
const {
  createReferral,
  getAllReferral,
  getUserReferral,
  deleteAllReferral,
  updateReferral,
} = require('../controllers/referralController');

router
  .route('/')
  .post(authenticateUser, createReferral)
  .get(authenticateUser, getAllReferral)
  .delete(authenticateUser, deleteAllReferral);

router.route('/:id').patch([authenticateUser], updateReferral);

router.route('/showUserReferral').get(authenticateUser, getUserReferral);

module.exports = router;
