const {
    createIncome,
    getIncomeByUser,
    getIncomeById,
    updateIncome,
    deleteIncome
} = require("../models/incomeModel");

const db = require("../config/db");

// Create income
const addIncome = (req, res) => {
    const {
        crop_id,
        quantity,
        unit,
        selling_price,
        sale_date
    } = req.body;

    // Validate required fields
    if (
        !crop_id ||
        !quantity ||
        !unit ||
        !selling_price ||
        !sale_date
    ) {
        return res.status(400).json({
            message:
                "Crop ID, quantity, unit, selling price and sale date are required"
        });
    }

    const userId = req.user.id;

    // Check whether the crop belongs to the logged-in user
    const sql = `
        SELECT crops.id
        FROM crops
        INNER JOIN farms
            ON crops.farm_id = farms.id
        WHERE crops.id = ?
          AND farms.user_id = ?
    `;

    db.query(sql, [crop_id, userId], (err, results) => {
        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Database error"
            });
        }

        if (results.length === 0) {
            return res.status(403).json({
                message: "You do not have access to this crop"
            });
        }

        // Calculate total income on backend
        const totalAmount =
            Number(quantity) * Number(selling_price);

        createIncome(
            crop_id,
            quantity,
            unit,
            selling_price,
            totalAmount,
            sale_date,
            (err, result) => {
                if (err) {
                    console.error(err);

                    return res.status(500).json({
                        message: "Failed to create income"
                    });
                }

                return res.status(201).json({
                    message: "Income created successfully",
                    incomeId: result.insertId,
                    totalAmount: totalAmount
                });
            }
        );
    });
};

// Get all income records
const getIncome = (req, res) => {
    const userId = req.user.id;

    getIncomeByUser(userId, (err, results) => {
        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Failed to fetch income"
            });
        }

        return res.status(200).json({
            income: results
        });
    });
};

// Get one income record
const getIncomeRecord = (req, res) => {
    const incomeId = req.params.id;
    const userId = req.user.id;

    getIncomeById(
        incomeId,
        userId,
        (err, results) => {
            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: "Failed to fetch income"
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    message: "Income record not found"
                });
            }

            return res.status(200).json({
                income: results[0]
            });
        }
    );
};

// Update income
const editIncome = (req, res) => {
    const incomeId = req.params.id;
    const userId = req.user.id;

    const {
        quantity,
        unit,
        selling_price,
        sale_date
    } = req.body;

    if (
        !quantity ||
        !unit ||
        !selling_price ||
        !sale_date
    ) {
        return res.status(400).json({
            message:
                "Quantity, unit, selling price and sale date are required"
        });
    }

    // Recalculate total amount on backend
    const totalAmount =
        Number(quantity) * Number(selling_price);

    updateIncome(
        incomeId,
        userId,
        quantity,
        unit,
        selling_price,
        totalAmount,
        sale_date,
        (err, result) => {
            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: "Failed to update income"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Income record not found"
                });
            }

            return res.status(200).json({
                message: "Income updated successfully",
                totalAmount: totalAmount
            });
        }
    );
};

// Delete income
const removeIncome = (req, res) => {
    const incomeId = req.params.id;
    const userId = req.user.id;

    deleteIncome(
        incomeId,
        userId,
        (err, result) => {
            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: "Failed to delete income"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Income record not found"
                });
            }

            return res.status(200).json({
                message: "Income deleted successfully"
            });
        }
    );
};
module.exports = {
    addIncome,
    getIncome,
    getIncomeRecord,
    editIncome,
    removeIncome
};