const {
    getTotalExpenses,
    getTotalIncome,
    getCropWiseAnalysis,
    getExpenseCategoryAnalysis,
    getProfitLoss
} = require('../models/analysisModel')



// Get total expenses
const totalExpenses = (req, res) => {
    const userId = req.user.id;

    getTotalExpenses(userId, (err, results) => {
        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Failed to calculate total expenses"
            });
        }

        return res.status(200).json({
            totalExpenses: Number(results[0].total_expenses)
        });
    });
};


// Get total income
const totalIncome = (req, res) => {
    const userId = req.user.id;

    getTotalIncome(userId, (err, results) => {
        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Failed to calculate total income"
            });
        }

        return res.status(200).json({
            totalIncome: Number(results[0].total_income)
        });
    });
};


// Get profit/loss
const profitLoss = (req, res) => {
    const userId = req.user.id;

    getProfitLoss(userId, (err, results) => {
        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Failed to calculate profit/loss"
            });
        }

        const totalIncome = Number(results[0].total_income);
        const totalExpenses = Number(results[0].total_expenses);

        const profitLoss = totalIncome - totalExpenses;

        let status;

        if (profitLoss > 0) {
            status = "PROFIT";
        } else if (profitLoss < 0) {
            status = "LOSS";
        } else {
            status = "BREAK-EVEN";
        }

        return res.status(200).json({
            totalIncome,
            totalExpenses,
            profitLoss,
            status
        });
    });
};


// Get crop-wise analysis
const cropWiseAnalysis = (req, res) => {
    const userId = req.user.id;

    getCropWiseAnalysis(userId, (err, results) => {
        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Failed to calculate crop-wise analysis"
            });
        }

        const analysis = results.map((crop) => {
            const totalIncome = Number(crop.total_income);
            const totalExpenses = Number(crop.total_expenses);

            return {
                cropId: crop.crop_id,
                cropName: crop.crop_name,
                totalIncome,
                totalExpenses,
                profitLoss: totalIncome - totalExpenses
            };
        });

        return res.status(200).json({
            crops: analysis
        });
    });
};


// Get expense category analysis
const expenseCategoryAnalysis = (req, res) => {
    const userId = req.user.id;

    getExpenseCategoryAnalysis(
        userId,
        (err, results) => {
            if (err) {
                console.error(err);

                return res.status(500).json({
                    message:
                        "Failed to calculate expense category analysis"
                });
            }

            const categories = results.map((item) => ({
                category: item.category,
                totalAmount: Number(item.total_amount)
            }));

            return res.status(200).json({
                categories
            });
        }
    );
};


module.exports = {
    totalExpenses,
    totalIncome,
    profitLoss,
    cropWiseAnalysis,
    expenseCategoryAnalysis
};