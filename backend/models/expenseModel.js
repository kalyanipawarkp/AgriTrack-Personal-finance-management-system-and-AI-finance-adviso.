const db = require('../config/db')

const createExpense = (
    cropId,
    category,
    amount,
    expenseDate,
    description,
    callback
) => {
    const sql =
        `INSERT INTO expenses
    (crop_id, category , amount ,  expense_date,description)
    VALUES
    (?,?,?,?,?)`;

    db.query(
        sql,
        [
            cropId,
            category,
            amount,
            expenseDate,
            description
        ],
        callback
    );
};

const getExpensesByUser = (userId, callback) => {
    const sql =
        `
     SELECT
            expenses.id,
            expenses.crop_id,
            expenses.category,
            expenses.amount,
            expenses.expense_date,
            expenses.description,
            expenses.created_at,
            crops.crop_name,
            farms.farm_name
        FROM expenses
        INNER JOIN crops
            ON expenses.crop_id = crops.id
        INNER JOIN farms
            ON crops.farm_id = farms.id
        WHERE farms.user_id = ?
        ORDER BY expenses.expense_date DESC;`;

    db.query(
        sql,
        [userId],
        callback
    );
};

const getExpenseById = (expenseId, userId, callback) => {
    const sql =
        `
        SELECT
            expenses.id,
            expenses.crop_id,
            expenses.category,
            expenses.amount,
            expenses.expense_date,
            expenses.description,
            expenses.created_at,
            crops.crop_name,
            farms.farm_name
        FROM expenses
        INNER JOIN crops
            ON expenses.crop_id = crops.id
        INNER JOIN farms
            ON crops.farm_id = farms.id
        WHERE expenses.id = ?
          AND farms.user_id = ?;
    `;

    db.query(
        sql,
        [expenseId, userId],
        callback
    );
};

const updateExpense = (
    expenseId,
    userId,
    category,
    amount,
    expenseDate,
    description,
    callback
) => {
    const sql = `
        UPDATE expenses
        INNER JOIN crops
            ON expenses.crop_id = crops.id
        INNER JOIN farms
            ON crops.farm_id = farms.id
        SET
            expenses.category = ?,
            expenses.amount = ?,
            expenses.expense_date = ?,
            expenses.description = ?
        WHERE expenses.id = ?
          AND farms.user_id = ?
    `;

    db.query(
        sql,
        [
            category,
            amount,
            expenseDate,
            description,
            expenseId,
            userId
        ],
        callback
    );
};

const deleteExpense = (expenseId, userId, callback) => {
    const sql = `
        DELETE expenses
        FROM expenses
        INNER JOIN crops
            ON expenses.crop_id = crops.id
        INNER JOIN farms
            ON crops.farm_id = farms.id
        WHERE expenses.id = ?
          AND farms.user_id = ?
    `;

    db.query(
        sql,
        [expenseId, userId],
        callback
    );
};
module.exports = {
    createExpense,
    getExpenseById,
    getExpensesByUser,
    updateExpense,
    deleteExpense
};