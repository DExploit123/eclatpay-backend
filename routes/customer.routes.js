const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer.controller');
const requireAuth = require('../middlewares/requireAuth');
const upload = require('../upload'); // adjust path if needed

router.use(requireAuth); // Protect all routes

// 🖼️ Route with file upload
router.post('/', upload.single('profileImage'), customerController.createCustomer);
router.get('/', customerController.getAllCustomers);
router.get('/:id', customerController.getCustomerById);

module.exports = router;
