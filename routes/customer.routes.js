const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer.controller');
const requireAuth = require('../middlewares/requireAuth');
const upload = require('../upload');

// Apply authentication
router.use(requireAuth);

// Add debug logging
router.use((req, res, next) => {
  console.log(`🔍 Customer route accessed: ${req.method} ${req.path}`);
  console.log(`🔍 Full URL: ${req.originalUrl}`);
  next();
});

// ✅ Route to get transactions FIRST
router.get('/:id/transactions', customerController.getCustomerTransactions);

// Other customer routes
router.post('/', upload.single('profileImage'), customerController.createCustomer);
router.put('/qr/:id', customerController.regenerateQR);
router.get('/', customerController.getAllCustomers);
router.get('/:id', customerController.getCustomerById);
router.post('/qr/verify', customerController.getCustomerByQR);

module.exports = router;