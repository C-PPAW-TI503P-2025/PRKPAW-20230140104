const express = require("express"); 
const router = express.Router();  
const presensiController = require("../controllers/presensiController"); 
const { authenticateJWT } = require("../Middleware/promissionMiddleware");

router.post("/checkin", authenticateJWT, presensiController.checkIn); 
router.post("/checkout", authenticateJWT, presensiController.checkOut); 
 
module.exports = router;