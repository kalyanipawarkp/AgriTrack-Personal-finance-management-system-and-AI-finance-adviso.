const express = require('express')
const router = express.Router();

const {
    addExpense,
    getExpenses,
    getExpense,
    editExpense,
    removeExpense
} = require('../controller/expenseController')

const authMiddleware = require('../middleware/authMiddleware')
router.post('/', authMiddleware, addExpense);
router.get('/', authMiddleware, getExpenses);
router.get(
    '/:id', authMiddleware, getExpense
);

router.put('/:id', authMiddleware, editExpense);
router.delete('/:id', authMiddleware, removeExpense);


module.exports = router;