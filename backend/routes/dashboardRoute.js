const express = require("express");

const {
    getDashboard
} = require("../controller/dashboardController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get complete dashboard
router.get("/", authMiddleware, getDashboard);

module.exports = router;