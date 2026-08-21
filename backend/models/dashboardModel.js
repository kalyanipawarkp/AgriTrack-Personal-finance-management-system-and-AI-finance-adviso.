const db = require('../config/db')

// Get dashboard summary
const getDashboardSummary = (userId, callback) => {
    const sql = `
        SELECT

            COALESCE(
                (
                    SELECT SUM(income.total_amount)
                    FROM income
                    INNER JOIN crops
                        ON income.crop_id = crops.id
                    INNER JOIN farms
                        ON crops.farm_id = farms.id
                    WHERE farms.user_id = ?
                ),
                0
            ) AS total_income,

            COALESCE(
                (
                    SELECT SUM(expenses.amount)
                    FROM expenses
                    INNER JOIN crops
                        ON expenses.crop_id = crops.id
                    INNER JOIN farms
                        ON crops.farm_id = farms.id
                    WHERE farms.user_id = ?
                ),
                0
            ) AS total_expenses,

            (
                SELECT COUNT(*)
                FROM crops
                INNER JOIN farms
                    ON crops.farm_id = farms.id
                WHERE farms.user_id = ?
            ) AS total_crops,

            (
                SELECT COUNT(*)
                FROM farms
                WHERE farms.user_id = ?
            ) AS total_farms
    `;

    db.query(
        sql,
        [userId, userId, userId, userId],
        callback
    );
};


// Get recent expenses
const getRecentExpenses = (userId, callback) => {
    const sql = `
        SELECT
            expenses.id,
            expenses.category,
            expenses.amount,
            expenses.expense_date,
            expenses.description,
            crops.crop_name
        FROM expenses
        INNER JOIN crops
            ON expenses.crop_id = crops.id
        INNER JOIN farms
            ON crops.farm_id = farms.id
        WHERE farms.user_id = ?
        ORDER BY expenses.expense_date DESC
        LIMIT 5
    `;

    db.query(sql, [userId], callback);
};


// Get recent income
const getRecentIncome = (userId, callback) => {
    const sql = `
        SELECT
            income.id,
            income.quantity,
            income.unit,
            income.selling_price,
            income.total_amount,
            income.sale_date,
            crops.crop_name
        FROM income
        INNER JOIN crops
            ON income.crop_id = crops.id
        INNER JOIN farms
            ON crops.farm_id = farms.id
        WHERE farms.user_id = ?
        ORDER BY income.sale_date DESC
        LIMIT 5
    `;

    db.query(sql, [userId], callback);
};


// Get budget summary
const getBudgetSummary = (userId, callback) => {
    const sql = `
        SELECT
            COUNT(*) AS total_budgets,

            COALESCE(
                SUM(budgets.planned_amount),
                0
            ) AS total_planned_amount

        FROM budgets
        INNER JOIN crops
            ON budgets.crop_id = crops.id
        INNER JOIN farms
            ON crops.farm_id = farms.id
        WHERE farms.user_id = ?
    `;

    db.query(sql, [userId], callback);
};


module.exports = {
    getDashboardSummary,
    getRecentExpenses,
    getRecentIncome,
    getBudgetSummary
};