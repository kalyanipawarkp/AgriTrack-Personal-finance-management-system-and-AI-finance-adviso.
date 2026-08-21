const {
    getMonthlyFinancialReport,
    getCropWiseProfit,
    getExpenseCategoryReport,
    getBudgetVsActual
} = require("../models/reportModel");


// Monthly income vs expense
const monthlyFinancialReport = (req, res) => {
    const userId = req.user.id;

    getMonthlyFinancialReport(userId, (err, results) => {
        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Failed to fetch monthly financial report"
            });
        }

        const report = results.map((item) => {
            const totalIncome = Number(item.total_income);
            const totalExpenses = Number(item.total_expenses);

            return {
                month: item.month,
                totalIncome,
                totalExpenses,
                profitLoss: totalIncome - totalExpenses
            };
        });

        return res.status(200).json({
            report
        });
    });
};


// Crop-wise profit
const cropWiseProfit = (req, res) => {
    const userId = req.user.id;

    getCropWiseProfit(userId, (err, results) => {
        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Failed to fetch crop-wise profit report"
            });
        }

        const report = results.map((crop) => {
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
            report
        });
    });
};


// Expense category report
const expenseCategoryReport = (req, res) => {
    const userId = req.user.id;

    getExpenseCategoryReport(userId, (err, results) => {
        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Failed to fetch expense category report"
            });
        }

        const report = results.map((item) => ({
            category: item.category,
            totalAmount: Number(item.total_amount)
        }));

        return res.status(200).json({
            report
        });
    });
};


// Budget vs actual spending
const budgetVsActual = (req, res) => {
    const userId = req.user.id;

    getBudgetVsActual(userId, (err, results) => {
        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Failed to fetch budget report"
            });
        }

        const report = results.map((item) => {
            const plannedAmount =
                Number(item.planned_amount);

            const actualSpent =
                Number(item.actual_spent);

            return {
                budgetId: item.budget_id,
                cropName: item.crop_name,
                category: item.category,
                plannedAmount,
                actualSpent,
                remainingAmount:
                    plannedAmount - actualSpent,
                percentageUsed:
                    plannedAmount > 0
                        ? Number(
                            (
                                (actualSpent /
                                    plannedAmount) *
                                100
                            ).toFixed(2)
                        )
                        : 0
            };
        });

        return res.status(200).json({
            report
        });
    });
};


module.exports = {
    monthlyFinancialReport,
    cropWiseProfit,
    expenseCategoryReport,
    budgetVsActual
};