const express = require('express');

const router = express.Router();

const {
  authenticateUser,
  authenticatePermissions,
} = require('../middleware/authentication');

const {
  createEarning,
  getAllEarning,
  getSingleEarning,
  updateEarning,
  deleteEarning,
  getUserEarning,
  deleteAllEarning,
  getUserEarning2,
  deleteUserEarning,
} = require('../controllers/earningController');

router
  .route('/')
  .get([authenticateUser], getAllEarning)
  .post([authenticateUser], createEarning)
  .delete(authenticateUser, deleteAllEarning);
router.route('/showUserEarning').get(authenticateUser, getUserEarning);
router
  .route('/:id')
  .patch([authenticateUser], updateEarning)
  .delete([authenticateUser, authenticatePermissions('admin')], deleteEarning)
  .get([authenticateUser], getSingleEarning);

router.route('/:id/showUserEarning').get(authenticateUser, getUserEarning2);

router
  .route('/:id/deleteUserEarning')
  .delete(authenticateUser, deleteUserEarning);

module.exports = router;
