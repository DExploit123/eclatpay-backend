const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');
const requireAuth = require('../middlewares/requireAuth');

router.use(requireAuth);

router.post('/', transactionController.createTransaction);
router.get('/', transactionController.getAllTransactions);
router.get('/customer/:id', transactionController.getByCustomer);

module.exports = router;
