const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/authentication');
const {
  createCoin,
  getAllCoin,
  getSingleCoin,
  getUserCoin,
  deleteCoin,
  getSingleInvestCoin,
  deleteAllCoin,
  deleteUserCoin,
  updateCoin,
} = require('../controllers/coinController');

router
  .route('/')
  .post(authenticateUser, createCoin)
  .get(authenticateUser, getAllCoin)
  .get(authenticateUser, getUserCoin)
  .delete(authenticateUser, deleteAllCoin);
router
  .route('/:id')
  .get(authenticateUser, getSingleCoin)
  .patch([authenticateUser], updateCoin)
  .delete(authenticateUser, deleteCoin);

router.route('/:id/coin').get(getSingleInvestCoin);

router.route('/:id/deleteUserCoin').delete(authenticateUser, deleteUserCoin);

module.exports = router;
