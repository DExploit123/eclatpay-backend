const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const requireAuth = require('../middlewares/requireAuth');

router.use(requireAuth);

// ✅ Only admin should be able to view reports
router.get('/summary', reportController.getSummaryReport);

module.exports = router;
