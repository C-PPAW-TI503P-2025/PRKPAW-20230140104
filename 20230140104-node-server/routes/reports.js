const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { addUserData, isAdmin } = require('../Middleware/promissionMiddleware');


router.get('/daily', [addUserData, isAdmin], reportController.getDailyReport);
router.get('/by-date', [addUserData, isAdmin], reportController.getDailyReportByDate)
module.exports = router;
