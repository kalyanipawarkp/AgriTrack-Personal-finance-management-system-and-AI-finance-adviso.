const db = require('../config/db')
// Monthly income vs expense
const getMonthlyFinancialReport = (userId, callback) => {
    const sql = `
        SELECT
            months.month,
            COALESCE(income_data.total_income, 0) AS total_income,
            COALESCE(expense_data.total_expenses, 0) AS total_expenses
        FROM
        (
            SELECT DISTINCT
                DATE_FORMAT(sale_date, '%Y-%m') AS month
            FROM income
            INNER JOIN crops
                ON income.crop_id = crops.id
            INNER JOIN farms
                ON crops.farm_id = farms.id
            WHERE farms.user_id = ?

            UNION

            SELECT DISTINCT
                DATE_FORMAT(expense_date, '%Y-%m') AS month
            FROM expenses
            INNER JOIN crops
                ON expenses.crop_id = crops.id
            INNER JOIN farms
                ON crops.farm_id = farms.id
            WHERE farms.user_id = ?
        ) AS months

        LEFT JOIN
        (
            SELECT
                DATE_FORMAT(income.sale_date, '%Y-%m') AS month,
                SUM(income.total_amount) AS total_income
            FROM income
            INNER JOIN crops
                ON income.crop_id = crops.id
            INNER JOIN farms
                ON crops.farm_id = farms.id
            WHERE farms.user_id = ?
            GROUP BY DATE_FORMAT(income.sale_date, '%Y-%m')
        ) AS income_data
            ON months.month = income_data.month

        LEFT JOIN
        (
            SELECT
                DATE_FORMAT(expenses.expense_date, '%Y-%m') AS month,
                SUM(expenses.amount) AS total_expenses
            FROM expenses
            INNER JOIN crops
                ON expenses.crop_id = crops.id
            INNER JOIN farms
                ON crops.farm_id = farms.id
            WHERE farms.user_id = ?
            GROUP BY DATE_FORMAT(expenses.expense_date, '%Y-%m')
        ) AS expense_data
            ON months.month = expense_data.month

        ORDER BY months.month;
    `;

    db.query(
        sql,
        [userId, userId, userId, userId],
        callback
    );
};


// Crop-wise profit report
const getCropWiseProfit = (userId, callback) => {
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

        ORDER BY crops.crop_name;
    `;

    db.query(sql, [userId], callback);
};


// Expense category report
const getExpenseCategoryReport = (userId, callback) => {
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

        ORDER BY total_amount DESC;
    `;

    db.query(sql, [userId], callback);
};


// Budget vs actual spending
const getBudgetVsActual = (userId, callback) => {
    const sql = `
        SELECT
            budgets.id AS budget_id,
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

        ORDER BY crops.crop_name;
    `;

    db.query(sql, [userId], callback);
};


module.exports = {
    getMonthlyFinancialReport,
    getCropWiseProfit,
    getExpenseCategoryReport,
    getBudgetVsActual
};