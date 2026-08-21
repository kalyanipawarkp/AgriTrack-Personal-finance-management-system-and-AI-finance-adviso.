const Gemini = require('../config/gemini')

const {
    getFinancialData,
    getCropFinancialData,
    getExpenseData,
    getBudgetData
} = require("../models/aiModel");


// Generate AI financial insight
const generateAIInsight = (req, res) => {

    const userId = req.user.id;

    const question =
        req.body.question ||
        "Analyze my farming finances and give me useful recommendations.";

    // 1. Get overall financial data
    getFinancialData(userId, (err, financialResults) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Failed to fetch financial data"
            });
        }

        // 2. Get crop data
        getCropFinancialData(userId, (err, cropResults) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: "Failed to fetch crop data"
                });
            }

            // 3. Get expense data
            getExpenseData(userId, (err, expenseResults) => {

                if (err) {
                    console.error(err);

                    return res.status(500).json({
                        message: "Failed to fetch expense data"
                    });
                }

                // 4. Get budget data
                getBudgetData(userId, async (err, budgetResults) => {

                    if (err) {
                        console.error(err);

                        return res.status(500).json({
                            message: "Failed to fetch budget data"
                        });
                    }

                    try {

                        const financialData =
                            financialResults[0];

                        const totalIncome =
                            Number(financialData.total_income);

                        const totalExpenses =
                            Number(financialData.total_expenses);

                        const profitLoss =
                            totalIncome - totalExpenses;

                        const dataForAI = {
                            financialSummary: {
                                totalIncome,
                                totalExpenses,
                                profitLoss,
                                totalCrops:
                                    Number(
                                        financialData.total_crops
                                    ),
                                totalFarms:
                                    Number(
                                        financialData.total_farms
                                    )
                            },

                            cropAnalysis:
                                cropResults.map((crop) => {

                                    const income =
                                        Number(
                                            crop.total_income
                                        );

                                    const expenses =
                                        Number(
                                            crop.total_expenses
                                        );

                                    return {
                                        cropName:
                                            crop.crop_name,
                                        totalIncome:
                                            income,
                                        totalExpenses:
                                            expenses,
                                        profitLoss:
                                            income - expenses
                                    };
                                }),

                            expenseCategories:
                                expenseResults.map(
                                    (item) => ({
                                        category:
                                            item.category,
                                        totalAmount:
                                            Number(
                                                item.total_amount
                                            )
                                    })
                                ),

                            budgets:
                                budgetResults.map(
                                    (budget) => {

                                        const planned =
                                            Number(
                                                budget.planned_amount
                                            );

                                        const actual =
                                            Number(
                                                budget.actual_spent
                                            );

                                        return {
                                            cropName:
                                                budget.crop_name,
                                            category:
                                                budget.category,
                                            plannedAmount:
                                                planned,
                                            actualSpent:
                                                actual,
                                            remaining:
                                                planned - actual
                                        };
                                    }
                                )
                        };

                        const prompt = `
You are an AI financial assistant for a farming expense management application.

Analyze the farmer's financial data carefully.

Give practical, simple and understandable recommendations.

Focus on:
1. Profit and loss
2. High expense categories
3. Crop profitability
4. Budget problems
5. Ways to control unnecessary expenses

Do not invent financial numbers.
Use only the data provided.
If there is insufficient data, clearly mention it.

Keep the response concise and useful for a farmer.

Farmer's financial data:

${JSON.stringify(
                            dataForAI,
                            null,
                            2
                        )}

Farmer's question:

${question}
`;

                        const response = await Gemini.models.generateContent({
                            model: "gemini-3.6-flash",
                            contents: prompt
                        });

                        return res.status(200).json({
                            question,
                            insight: response.text
                        });

                    } catch (error) {

                        console.error(
                            "OpenAI Error:",
                            error
                        );

                        return res.status(500).json({
                            message:
                                "Failed to generate AI insight"
                        });
                    }
                });
            });
        });
    });
};


module.exports = {
    generateAIInsight
};