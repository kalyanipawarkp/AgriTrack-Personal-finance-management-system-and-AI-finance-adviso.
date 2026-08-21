const db = require('../config/db')


const getTotalExpenses = (userId, callback) => {
    const sql = `
        SELECT
            COALESCE(SUM(expenses.amount), 0) AS total_expenses
        FROM expenses
        INNER JOIN crops
            ON expenses.crop_id = crops.id
        INNER JOIN farms
            ON crops.farm_id = farms.id
        WHERE farms.user_id = ?
    `;

    db.query(sql, [userId], callback);
};

const getTotalIncome = (userId, callback) => {
    const sql = `
        SELECT
            COALESCE(SUM(income.total_amount), 0) AS total_income
        FROM income
        INNER JOIN crops
            ON income.crop_id = crops.id
        INNER JOIN farms
            ON crops.farm_id = farms.id
        WHERE farms.user_id = ?
    `;

    db.query(sql, [userId], callback);
};


// Get profit/loss
const getProfitLoss = (userId, callback) => {
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
            ) AS total_expenses
    `;

    db.query(
        sql,
        [userId, userId],
        callback
    );
};


// Get crop-wise financial analysis
const getCropWiseAnalysis = (userId, callback) => {
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

    db.query(sql, [userId], callback);
};


// Get expense category analysis
const getExpenseCategoryAnalysis = (userId, callback) => {
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

    db.query(sql, [userId], callback);
};


module.exports = {
    getTotalExpenses,
    getTotalIncome,
    getProfitLoss,
    getCropWiseAnalysis,
    getExpenseCategoryAnalysis
};