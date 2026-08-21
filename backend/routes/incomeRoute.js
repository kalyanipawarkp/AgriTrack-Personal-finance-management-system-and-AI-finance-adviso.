const express = require('express')
const router = express.Router()

const {
    addIncome,
    getIncome,
    getIncomeRecord,
    editIncome,
    removeIncome
} = require("../controller/incomeController");

const authMiddleware = require('../middleware/authMiddleware')

router.post('/', authMiddleware, addIncome)
router.get('/', authMiddleware, getIncome);
router.get('/:id', authMiddleware, getIncomeRecord);
router.put('/:id', authMiddleware, editIncome);
router.delete('/:id', authMiddleware, removeIncome);

module.exports = router;