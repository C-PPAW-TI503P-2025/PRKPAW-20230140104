const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authenticateJWT } = require("../Middleware/promissionMiddleware");
const { isAdmin } = require("../Middleware/promissionMiddleware");


router.get('/daily', authenticateJWT, isAdmin, reportController.getDailyReport);
router.get('/by-date', authenticateJWT,isAdmin,reportController.getDailyReportByDate)
module.exports = router;
