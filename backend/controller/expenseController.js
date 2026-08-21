const {
    createExpense,
    getExpensesByUser,
    getExpenseById,
    updateExpense,
    deleteExpense
} = require('../models/expenseModel')

const db = require('../config/db')

const addExpense = (req, res) => {
    const {
        crop_id,
        category,
        amount,
        expense_date,
        description
    } = req.body;

    if (!crop_id || !category || !amount || !expense_date) {
        return res.status(400).json({
            message: "Crop ID, category, amount and expense date are required"
        });
    }

    const userId = req.user.id;

    const sql =
        `SELECT crops.id
    FROM crops
    INNER JOIN farms
    ON crops.farm_id = farms.id
    WHERE crops.id=?
    AND farms.user_id=?`;

    db.query(sql, [crop_id, userId], (err, result) => {
        if (err) {
            console.error(err);

            return res.status(500).json({
                message: 'Database error'
            });
        }

        if (result.length === 0) {
            return res.status(403).json({
                message: 'You do not have access to this crop'
            });
        }

        createExpense(
            crop_id,
            category,
            amount,
            expense_date,
            description || null,
            (err, result) => {
                if (err) {
                    console.error(err);

                    return res.status(500).json({
                        message: 'Failed to create expense'
                    });
                }
                return res.status(201).json({
                    message: 'Expense Created successfully',
                    expenseId: result.insertId
                });
            }
        )
    })
};
const getExpenses = (req, res) => {
    const userId = req.user.id;

    getExpensesByUser(userId, (err, results) => {
        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Failed to fetch expenses"
            });
        }

        return res.status(200).json({
            expenses: results
        });
    });
};
const getExpense = (req, res) => {
    const expenseId = req.params.id;
    const userId = req.user.id;

    getExpenseById(expenseId, userId, (err, results) => {
        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Failed to fetch expense"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        return res.status(200).json({
            expense: results[0]
        });
    });
};


const editExpense = (req, res) => {
    const expenseId = req.params.id;
    const userId = req.user.id;

    const {
        category,
        amount,
        expense_date,
        description
    } = req.body;

    if (!category || !amount || !expense_date) {
        return res.status(400).json({
            message: "Category, amount and expense date are required"
        });
    }

    updateExpense(
        expenseId,
        userId,
        category,
        amount,
        expense_date,
        description || null,
        (err, result) => {
            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: 'Failed to update expense'
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: 'Expense not found'
                });
            }

            return res.status(200).json({
                message: 'Expense updated successfully'
            });
        }
    );
};

const removeExpense = (req, res) => {
    const expenseId = req.params.id;
    const userId = req.user.id;

    deleteExpense(
        expenseId,
        userId,
        (err, result) => {
            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: "Failed to delete expense"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Expense not found"
                });
            }

            return res.status(200).json({
                message: "Expense deleted successfully"
            });
        }
    );
};
module.exports = {
    addExpense,
    getExpense,
    getExpenses,
    editExpense,
    removeExpense
}