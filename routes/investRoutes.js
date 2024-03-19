const express = require('express');

const router = express.Router();

const {
  authenticateUser,
  authenticatePermissions,
} = require('../middleware/authentication');

const {
  createInvest,
  getAllInvest,
  getSingleInvest,
  updateInvest,
  deleteInvest,
  getUserInvest,
  deleteAllInvest,
} = require('../controllers/investController');

router
  .route('/')
  .get([authenticateUser], getAllInvest)
  .post([authenticateUser], createInvest)
  .delete(authenticateUser, deleteAllInvest);
router.route('/showUserInvest').get(authenticateUser, getUserInvest);
router
  .route('/:id')
  .patch([authenticateUser], updateInvest)
  .delete([authenticateUser, authenticatePermissions('admin')], deleteInvest)
  .get([authenticateUser], getSingleInvest);

module.exports = router;
