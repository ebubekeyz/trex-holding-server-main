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
} = require('../controllers/coinController');

router
  .route('/')
  .post(authenticateUser, createCoin)
  .get(authenticateUser, getAllCoin)
  .get(authenticateUser, getUserCoin);
router
  .route('/:id')
  .get(authenticateUser, getSingleCoin)
  .delete(authenticateUser, deleteCoin);

router.route('/:id/coin').get(getSingleInvestCoin);

module.exports = router;
