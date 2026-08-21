const express = require('express')
const router = express.Router()

const {
    totalExpenses,
    totalIncome,
    profitLoss,
    cropWiseAnalysis,
    expenseCategoryAnalysis
} = require('../controller/analysisController');

const authMiddleware = require('../middleware/authMiddleware')

router.get('/expenses', authMiddleware, totalExpenses)
router.get('/income', authMiddleware, totalIncome)
router.get('/profit', authMiddleware, profitLoss)
router.get('/crop-wise', authMiddleware, cropWiseAnalysis)
router.get('/categories', authMiddleware, expenseCategoryAnalysis)

module.exports = router;