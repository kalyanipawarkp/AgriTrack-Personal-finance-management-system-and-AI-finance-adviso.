const db = require('../config/db')

// Create income
const createIncome = (
    cropId,
    quantity,
    unit,
    sellingPrice,
    totalAmount,
    saleDate,
    callback
) => {
    const sql = `
        INSERT INTO income
        (
            crop_id,
            quantity,
            unit,
            selling_price,
            total_amount,
            sale_date
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            cropId,
            quantity,
            unit,
            sellingPrice,
            totalAmount,
            saleDate
        ],
        callback
    );
};

// Get all income records of logged-in user
const getIncomeByUser = (userId, callback) => {
    const sql = `
        SELECT
            income.id,
            income.crop_id,
            income.quantity,
            income.unit,
            income.selling_price,
            income.total_amount,
            income.sale_date,
            income.created_at,
            crops.crop_name,
            farms.farm_name
        FROM income
        INNER JOIN crops
            ON income.crop_id = crops.id
        INNER JOIN farms
            ON crops.farm_id = farms.id
        WHERE farms.user_id = ?
        ORDER BY income.sale_date DESC
    `;

    db.query(sql, [userId], callback);
};

// Get one income record
const getIncomeById = (
    incomeId,
    userId,
    callback
) => {
    const sql = `
        SELECT
            income.id,
            income.crop_id,
            income.quantity,
            income.unit,
            income.selling_price,
            income.total_amount,
            income.sale_date,
            income.created_at,
            crops.crop_name,
            farms.farm_name
        FROM income
        INNER JOIN crops
            ON income.crop_id = crops.id
        INNER JOIN farms
            ON crops.farm_id = farms.id
        WHERE income.id = ?
          AND farms.user_id = ?
    `;

    db.query(
        sql,
        [incomeId, userId],
        callback
    );
};

// Update income
const updateIncome = (
    incomeId,
    userId,
    quantity,
    unit,
    sellingPrice,
    totalAmount,
    saleDate,
    callback
) => {
    const sql = `
        UPDATE income
        INNER JOIN crops
            ON income.crop_id = crops.id
        INNER JOIN farms
            ON crops.farm_id = farms.id
        SET
            income.quantity = ?,
            income.unit = ?,
            income.selling_price = ?,
            income.total_amount = ?,
            income.sale_date = ?
        WHERE income.id = ?
          AND farms.user_id = ?
    `;

    db.query(
        sql,
        [
            quantity,
            unit,
            sellingPrice,
            totalAmount,
            saleDate,
            incomeId,
            userId
        ],
        callback
    );
};

// Delete income
const deleteIncome = (
    incomeId,
    userId,
    callback
) => {
    const sql = `
        DELETE income
        FROM income
        INNER JOIN crops
            ON income.crop_id = crops.id
        INNER JOIN farms
            ON crops.farm_id = farms.id
        WHERE income.id = ?
          AND farms.user_id = ?
    `;

    db.query(
        sql,
        [incomeId, userId],
        callback
    );
};
module.exports = {
    createIncome,
    getIncomeByUser,
    getIncomeById,
    updateIncome,
    deleteIncome
};