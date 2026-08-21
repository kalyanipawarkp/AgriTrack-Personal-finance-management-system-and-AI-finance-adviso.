const express = require("express");

const {
    addBudget,
    getBudgets,
    getBudget,
    editBudget,
    removeBudget,
    budgetStatus
} = require("../controller/budgetController");

const authMiddleware = require('../middleware/authMiddleware')
const router = express.Router();

// Create budget
router.post("/", authMiddleware, addBudget);

// Get all budgets
router.get("/", authMiddleware, getBudgets);

// Get one budget
router.get("/:id", authMiddleware, getBudget);

router.put("/:id", authMiddleware, editBudget);

router.delete("/:id", authMiddleware, removeBudget);

router.get('/:id/status', authMiddleware, budgetStatus)


module.exports = router;