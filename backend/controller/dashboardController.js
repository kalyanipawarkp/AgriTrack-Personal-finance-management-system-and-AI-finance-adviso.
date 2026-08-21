const {
    getDashboardSummary,
    getRecentExpenses,
    getRecentIncome,
    getBudgetSummary
} = require("../models/dashboardModel");



// Get complete dashboard
const getDashboard = (req, res) => {
    const userId = req.user.id;

    // Get summary
    getDashboardSummary(userId, (err, summaryResults) => {
        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Failed to fetch dashboard summary"
            });
        }

        const summary = summaryResults[0];

        const totalIncome = Number(summary.total_income);
        const totalExpenses = Number(summary.total_expenses);

        const profitLoss = totalIncome - totalExpenses;

        let financialStatus;

        if (profitLoss > 0) {
            financialStatus = "PROFIT";
        } else if (profitLoss < 0) {
            financialStatus = "LOSS";
        } else {
            financialStatus = "BREAK-EVEN";
        }

        // Get recent expenses
        getRecentExpenses(userId, (err, expenseResults) => {
            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: "Failed to fetch recent expenses"
                });
            }

            // Get recent income
            getRecentIncome(userId, (err, incomeResults) => {
                if (err) {
                    console.error(err);

                    return res.status(500).json({
                        message: "Failed to fetch recent income"
                    });
                }

                // Get budget summary
                getBudgetSummary(userId, (err, budgetResults) => {
                    if (err) {
                        console.error(err);

                        return res.status(500).json({
                            message: "Failed to fetch budget summary"
                        });
                    }

                    const budget = budgetResults[0];

                    return res.status(200).json({
                        summary: {
                            totalIncome,
                            totalExpenses,
                            profitLoss,
                            financialStatus
                        },

                        farms: Number(summary.total_farms),

                        crops: Number(summary.total_crops),

                        budgets: {
                            totalBudgets: Number(
                                budget.total_budgets
                            ),

                            totalPlannedAmount: Number(
                                budget.total_planned_amount
                            )
                        },

                        recentExpenses: expenseResults,

                        recentIncome: incomeResults
                    });
                });
            });
        });
    });
};


module.exports = {
    getDashboard
};