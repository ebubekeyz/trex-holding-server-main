const express = require('express');

const router = express.Router();

const {
  authenticateUser,
  authenticatePermissions,
} = require('../middleware/authentication');

const {
  createPenalty,
  getAllPenalty,
  getSinglePenalty,
  updatePenalty,
  deletePenalty,
  getUserPenalty,
  deleteAllPenalty,
  getUserPenalty2,
  createPenaltyUser,
  deleteUserPenalty,
  deletePenalty2,
} = require('../controllers/penaltyController');

router
  .route('/')
  .get([authenticateUser], getAllPenalty)
  .post([authenticateUser], createPenalty)
  .delete(authenticateUser, deleteAllPenalty);
router.route('/showUserPenalty').get(authenticateUser, getUserPenalty);
router
  .route('/:id')
  .patch([authenticateUser], updatePenalty)
  .delete([authenticateUser, authenticatePermissions('admin')], deletePenalty)
  .get([authenticateUser], getSinglePenalty);

router.route('/:id/showUserPenalty').get(authenticateUser, getUserPenalty2);

router
  .route('/:id/deleteUserIdNumber')
  .delete([authenticateUser], deletePenalty2);

router
  .route('/:id/deleteUserPenalty')
  .delete(authenticateUser, deleteUserPenalty);

module.exports = router;
