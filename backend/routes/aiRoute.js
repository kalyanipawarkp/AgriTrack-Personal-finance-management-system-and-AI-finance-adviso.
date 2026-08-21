const express = require("express");

const {
    generateAIInsight
} = require("../controller/aiController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Generate AI financial insight
router.post("/insight", authMiddleware, generateAIInsight);

module.exports = router;