const express = require('express');
const router = express.Router();
const {
  authenticateUser,
  authenticatePermissions,
} = require('../middleware/authentication');

const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
  deleteUser,
  deleteAllUsers,
  getRefId,
} = require('../controllers/userController');

router
  .route('/')
  .get(authenticateUser, getAllUsers)
  .delete(authenticateUser, deleteAllUsers);
router.route('/showMe').get(authenticateUser, showCurrentUser);
// router.route('/updateUser').patch(authenticateUser, updateUser);
router.route('/updateUserPassword').patch(authenticateUser, updateUserPassword);
router.route('/refId').get(authenticateUser, getRefId);
router
  .route('/:id')
  .get(authenticateUser, getSingleUser)
  .patch(authenticateUser, updateUser)
  .delete([authenticateUser, authenticatePermissions('admin')], deleteUser);

module.exports = router;
