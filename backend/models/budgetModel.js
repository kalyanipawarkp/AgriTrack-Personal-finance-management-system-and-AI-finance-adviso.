const db = require("../config/db");

// Create budget
const createBudget = (
    cropId,
    category,
    plannedAmount,
    callback
) => {
    const sql = `
        INSERT INTO budgets
        (
            crop_id,
            category,
            planned_amount
        )
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [
            cropId,
            category,
            plannedAmount
        ],
        callback
    );
};


// Get all budgets of logged-in user
const getBudgetsByUser = (userId, callback) => {
    const sql = `
        SELECT
            budgets.id,
            budgets.crop_id,
            budgets.category,
            budgets.planned_amount,
            budgets.created_at,
            crops.crop_name,
            farms.farm_name
        FROM budgets
        INNER JOIN crops
            ON budgets.crop_id = crops.id
        INNER JOIN farms
            ON crops.farm_id = farms.id
        WHERE farms.user_id = ?
        ORDER BY budgets.created_at DESC
    `;

    db.query(sql, [userId], callback);
};


// Get one budget
const getBudgetById = (
    budgetId,
    userId,
    callback
) => {
    const sql = `
        SELECT
            budgets.id,
            budgets.crop_id,
            budgets.category,
            budgets.planned_amount,
            budgets.created_at,
            crops.crop_name,
            farms.farm_name
        FROM budgets
        INNER JOIN crops
            ON budgets.crop_id = crops.id
        INNER JOIN farms
            ON crops.farm_id = farms.id
        WHERE budgets.id = ?
          AND farms.user_id = ?
    `;

    db.query(
        sql,
        [budgetId, userId],
        callback
    );
};

// Update budget
const updateBudget = (
    budgetId,
    userId,
    category,
    plannedAmount,
    callback
) => {
    const sql = `
        UPDATE budgets
        INNER JOIN crops
            ON budgets.crop_id = crops.id
        INNER JOIN farms
            ON crops.farm_id = farms.id
        SET
            budgets.category = ?,
            budgets.planned_amount = ?
        WHERE budgets.id = ?
          AND farms.user_id = ?
    `;

    db.query(
        sql,
        [
            category,
            plannedAmount,
            budgetId,
            userId
        ],
        callback
    );
};


// Delete budget
const deleteBudget = (
    budgetId,
    userId,
    callback
) => {
    const sql = `
        DELETE budgets
        FROM budgets
        INNER JOIN crops
            ON budgets.crop_id = crops.id
        INNER JOIN farms
            ON crops.farm_id = farms.id
        WHERE budgets.id = ?
          AND farms.user_id = ?
    `;

    db.query(
        sql,
        [budgetId, userId],
        callback
    );
};
// Get budget spending status
const getBudgetStatus = (
    budgetId,
    userId,
    callback
) => {
    const sql = `
        SELECT
            budgets.id AS budget_id,
            budgets.crop_id,
            budgets.category,
            budgets.planned_amount,
            crops.crop_name,

            COALESCE(
                (
                    SELECT SUM(expenses.amount)
                    FROM expenses
                    WHERE expenses.crop_id = budgets.crop_id
                      AND expenses.category = budgets.category
                ),
                0
            ) AS actual_spent

        FROM budgets

        INNER JOIN crops
            ON budgets.crop_id = crops.id

        INNER JOIN farms
            ON crops.farm_id = farms.id

        WHERE budgets.id = ?
          AND farms.user_id = ?
    `;

    db.query(
        sql,
        [budgetId, userId],
        callback
    );
};
module.exports = {
    createBudget,
    getBudgetsByUser,
    getBudgetById,
    updateBudget,
    deleteBudget,
    getBudgetStatus
};