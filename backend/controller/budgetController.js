const {
    createBudget,
    getBudgetsByUser,
    getBudgetById,
    updateBudget,
    getBudgetStatus,
    deleteBudget
} = require("../models/budgetModel");

const db = require("../config/db");


// Create budget
const addBudget = (req, res) => {
    const {
        crop_id,
        category,
        planned_amount
    } = req.body;

    if (
        !crop_id ||
        !category ||
        !planned_amount
    ) {
        return res.status(400).json({
            message:
                "Crop ID, category and planned amount are required"
        });
    }

    const userId = req.user.id;

    // Check whether crop belongs to logged-in user
    const sql = `
        SELECT crops.id
        FROM crops
        INNER JOIN farms
            ON crops.farm_id = farms.id
        WHERE crops.id = ?
          AND farms.user_id = ?
    `;

    db.query(
        sql,
        [crop_id, userId],
        (err, results) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: "Database error"
                });
            }

            if (results.length === 0) {
                return res.status(403).json({
                    message:
                        "You do not have access to this crop"
                });
            }

            createBudget(
                crop_id,
                category,
                planned_amount,
                (err, result) => {

                    if (err) {
                        console.error(err);

                        return res.status(500).json({
                            message:
                                "Failed to create budget"
                        });
                    }

                    return res.status(201).json({
                        message:
                            "Budget created successfully",
                        budgetId: result.insertId
                    });
                }
            );
        }
    );
};


// Get all budgets
const getBudgets = (req, res) => {

    const userId = req.user.id;

    getBudgetsByUser(
        userId,
        (err, results) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message:
                        "Failed to fetch budgets"
                });
            }

            return res.status(200).json({
                budgets: results
            });
        }
    );
};


// Get one budget
const getBudget = (req, res) => {

    const budgetId = req.params.id;
    const userId = req.user.id;

    getBudgetById(
        budgetId,
        userId,
        (err, results) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message:
                        "Failed to fetch budget"
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    message:
                        "Budget not found"
                });
            }

            return res.status(200).json({
                budget: results[0]
            });
        }
    );
};

// Update budget
const editBudget = (req, res) => {
    const budgetId = req.params.id;
    const userId = req.user.id;

    const {
        category,
        planned_amount
    } = req.body;

    if (!category || !planned_amount) {
        return res.status(400).json({
            message:
                "Category and planned amount are required"
        });
    }

    updateBudget(
        budgetId,
        userId,
        category,
        planned_amount,
        (err, result) => {
            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: "Failed to update budget"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Budget not found"
                });
            }

            return res.status(200).json({
                message: "Budget updated successfully"
            });
        }
    );
};


// Delete budget
const removeBudget = (req, res) => {
    const budgetId = req.params.id;
    const userId = req.user.id;

    deleteBudget(
        budgetId,
        userId,
        (err, result) => {
            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: "Failed to delete budget"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Budget not found"
                });
            }

            return res.status(200).json({
                message: "Budget deleted successfully"
            });
        }
    );
};
// Get budget spending status
const budgetStatus = (req, res) => {
    const budgetId = req.params.id;
    const userId = req.user.id;

    getBudgetStatus(
        budgetId,
        userId,
        (err, results) => {
            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: "Failed to calculate budget status"
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    message: "Budget not found"
                });
            }

            const budget = results[0];

            const plannedAmount =
                Number(budget.planned_amount);

            const actualSpent =
                Number(budget.actual_spent);

            const remainingAmount =
                plannedAmount - actualSpent;

            let percentageUsed = 0;

            if (plannedAmount > 0) {
                percentageUsed =
                    (actualSpent / plannedAmount) * 100;
            }

            let status;

            if (percentageUsed >= 100) {
                status = "OVER BUDGET";
            } else if (percentageUsed >= 80) {
                status = "NEAR LIMIT";
            } else {
                status = "ON TRACK";
            }

            return res.status(200).json({
                budgetId: budget.budget_id,
                cropId: budget.crop_id,
                cropName: budget.crop_name,
                category: budget.category,
                plannedAmount,
                actualSpent,
                remainingAmount,
                percentageUsed: Number(
                    percentageUsed.toFixed(2)
                ),
                status
            });
        }
    );
};
module.exports = {
    addBudget,
    getBudgets,
    getBudget,
    editBudget,
    removeBudget,
    budgetStatus
};