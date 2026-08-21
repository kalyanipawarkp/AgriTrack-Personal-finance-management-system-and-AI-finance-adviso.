const express = require("express");

const {
    monthlyFinancialReport,
    cropWiseProfit,
    expenseCategoryReport,
    budgetVsActual
} = require("../controller/reportController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Monthly income vs expense
router.get("/monthly", authMiddleware, monthlyFinancialReport);

// Crop-wise profit
router.get("/crop-wise", authMiddleware, cropWiseProfit);

// Expense category report
router.get("/categories", authMiddleware, expenseCategoryReport);

// Budget vs actual spending
router.get("/budget-vs-actual", authMiddleware, budgetVsActual);

module.exports = router;