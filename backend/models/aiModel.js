const db = require('../config/db')


// Get financial data for AI analysis
const getFinancialData = (userId, callback) => {

    const sql = `
        SELECT

            /* Total Income */
            (
                SELECT COALESCE(SUM(income.total_amount), 0)
                FROM income
                INNER JOIN crops
                    ON income.crop_id = crops.id
                INNER JOIN farms
                    ON crops.farm_id = farms.id
                WHERE farms.user_id = ?
            ) AS total_income,

            /* Total Expenses */
            (
                SELECT COALESCE(SUM(expenses.amount), 0)
                FROM expenses
                INNER JOIN crops
                    ON expenses.crop_id = crops.id
                INNER JOIN farms
                    ON crops.farm_id = farms.id
                WHERE farms.user_id = ?
            ) AS total_expenses,

            /* Number of Crops */
            (
                SELECT COUNT(*)
                FROM crops
                INNER JOIN farms
                    ON crops.farm_id = farms.id
                WHERE farms.user_id = ?
            ) AS total_crops,

            /* Number of Farms */
            (
                SELECT COUNT(*)
                FROM farms
                WHERE farms.user_id = ?
            ) AS total_farms
    `;

    db.query(
        sql,
        [
            userId,
            userId,
            userId,
            userId
        ],
        callback
    );
};


// Get crop-wise financial data
const getCropFinancialData = (userId, callback) => {

    const sql = `
        SELECT
            crops.id AS crop_id,
            crops.crop_name,

            COALESCE(
                (
                    SELECT SUM(income.total_amount)
                    FROM income
                    WHERE income.crop_id = crops.id
                ),
                0
            ) AS total_income,

            COALESCE(
                (
                    SELECT SUM(expenses.amount)
                    FROM expenses
                    WHERE expenses.crop_id = crops.id
                ),
                0
            ) AS total_expenses

        FROM crops

        INNER JOIN farms
            ON crops.farm_id = farms.id

        WHERE farms.user_id = ?

        ORDER BY crops.crop_name
    `;

    db.query(
        sql,
        [userId],
        callback
    );
};


// Get expense category data
const getExpenseData = (userId, callback) => {

    const sql = `
        SELECT
            expenses.category,
            SUM(expenses.amount) AS total_amount

        FROM expenses

        INNER JOIN crops
            ON expenses.crop_id = crops.id

        INNER JOIN farms
            ON crops.farm_id = farms.id

        WHERE farms.user_id = ?

        GROUP BY expenses.category

        ORDER BY total_amount DESC
    `;

    db.query(
        sql,
        [userId],
        callback
    );
};


// Get budget data
const getBudgetData = (userId, callback) => {

    const sql = `
        SELECT
            crops.crop_name,
            budgets.category,
            budgets.planned_amount,

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

        WHERE farms.user_id = ?

        ORDER BY crops.crop_name
    `;

    db.query(
        sql,
        [userId],
        callback
    );
};


module.exports = {
    getFinancialData,
    getCropFinancialData,
    getExpenseData,
    getBudgetData
};