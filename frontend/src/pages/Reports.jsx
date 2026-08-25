import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import DashboardNavbar from "../components/DashboardNavbar";

const API_URL = "http://localhost:5000/api/reports";

const Reports = () => {
    const [monthlyData, setMonthlyData] = useState([]);
    const [cropData, setCropData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [budgetData, setBudgetData] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const getConfig = () => {
        const token = localStorage.getItem("token");

        return {
            headers: {
                Authorization: `Bearer ${token} `,
            },
        };
    };

    const fetchReports = async () => {
        try {
            setLoading(true);
            setError("");

            const config = getConfig();

            const [
                monthlyResponse,
                cropResponse,
                categoryResponse,
                budgetResponse,
            ] = await Promise.all([
                axios.get(`${API_URL}/monthly`, config),
                axios.get(`${API_URL}/crop-wise`, config),
                axios.get(`${API_URL}/categories`, config),
                axios.get(`${API_URL}/budget-vs-actual`, config),
            ]);

            setMonthlyData(monthlyResponse.data.report || []);
            setCropData(cropResponse.data.report || []);
            setCategoryData(categoryResponse.data.report || []);
            setBudgetData(budgetResponse.data.report || []);
        } catch (err) {
            console.error("Fetch reports error:", err);

            setError(
                err.response?.data?.message ||
                "Unable to load reports. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const formatCurrency = (value) => {
        return `₹${Number(value || 0).toLocaleString("en-IN")}`;
    };

    const formatMonth = (month) => {
        if (!month) return "-";

        const [year, monthNumber] = month.split("-");

        const date = new Date(
            Number(year),
            Number(monthNumber) - 1,
            1
        );

        return date.toLocaleDateString("en-IN", {
            month: "short",
            year: "numeric",
        });
    };

    const totals = useMemo(() => {
        const income = monthlyData.reduce(
            (sum, item) => sum + Number(item.totalIncome || 0),
            0
        );

        const expenses = monthlyData.reduce(
            (sum, item) => sum + Number(item.totalExpenses || 0),
            0
        );

        return {
            income,
            expenses,
            profit: income - expenses,
        };
    }, [monthlyData]);

    const maxMonthlyValue = useMemo(() => {
        if (!monthlyData.length) return 1;

        return Math.max(
            ...monthlyData.flatMap((item) => [
                Number(item.totalIncome || 0),
                Number(item.totalExpenses || 0),
            ]),
            1
        );
    }, [monthlyData]);

    const maxCategoryAmount = useMemo(() => {
        if (!categoryData.length) return 1;

        return Math.max(
            ...categoryData.map(
                (item) => Number(item.totalAmount || 0)
            ),
            1
        );
    }, [categoryData]);

    /*
    ============================================================
    LOADING
    ============================================================
    */

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50">
                {/* SAME SIDEBAR IMPLEMENTATION AS EXPENSE PAGE */}
                <Sidebar
                    open={sidebarOpen}
                    setOpen={setSidebarOpen}
                />

                {/* MAIN CONTENT - IMPORTANT lg:pl-72 */}
                <div className="lg:pl-72">
                    <DashboardNavbar
                        setSidebarOpen={setSidebarOpen}
                    />

                    <main className="p-4 sm:p-6 lg:p-8">
                        <div className="mx-auto max-w-7xl animate-pulse">
                            <div className="mb-8">
                                <div className="h-8 w-48 rounded-lg bg-slate-200" />
                                <div className="mt-3 h-4 w-80 rounded bg-slate-200" />
                            </div>

                            <div className="grid gap-5 md:grid-cols-3">
                                {[1, 2, 3].map((item) => (
                                    <div
                                        key={item}
                                        className="h-32 rounded-2xl bg-white shadow-sm"
                                    />
                                ))}
                            </div>

                            <div className="mt-6 grid gap-6 lg:grid-cols-2">
                                {[1, 2].map((item) => (
                                    <div
                                        key={item}
                                        className="h-80 rounded-2xl bg-white shadow-sm"
                                    />
                                ))}
                            </div>

                            <div className="mt-6 h-96 rounded-2xl bg-white shadow-sm" />
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    /*
    ============================================================
    ERROR
    ============================================================
    */

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50">
                {/* SAME SIDEBAR */}
                <Sidebar
                    open={sidebarOpen}
                    setOpen={setSidebarOpen}
                />

                {/* MAIN AREA */}
                <div className="lg:pl-72">
                    <DashboardNavbar
                        setSidebarOpen={setSidebarOpen}
                    />

                    <main className="flex min-h-[calc(100vh-64px)] items-center justify-center p-6">
                        <div className="mx-auto flex w-full max-w-xl flex-col items-center justify-center rounded-3xl bg-white p-10 text-center shadow-sm">
                            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-3xl">
                                ⚠️
                            </div>

                            <h2 className="text-xl font-bold text-slate-800">
                                Unable to load reports
                            </h2>

                            <p className="mt-2 text-sm text-slate-500">
                                {error}
                            </p>

                            <button
                                onClick={fetchReports}
                                className="mt-6 rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-green-700 hover:shadow-lg"
                            >
                                Try Again
                            </button>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    /*
    ============================================================
    MAIN REPORT PAGE
    ============================================================
    */

    return (
        <div className="font-serif min-h-screen bg-slate-50">
            {/* ==================================================
                SAME SIDEBAR AS EXPENSE PAGE
            ================================================== */}

            <Sidebar
                open={sidebarOpen}
                setOpen={setSidebarOpen}
            />

            {/* ==================================================
                MAIN CONTENT AREA
                lg:pl-72 = leaves space for fixed sidebar
            ================================================== */}

            <div className="lg:pl-72">
                {/* SAME NAVBAR IMPLEMENTATION */}
                <DashboardNavbar
                    setSidebarOpen={setSidebarOpen}
                />

                <main className="p-4 sm:p-6 lg:p-8">
                    <div className="mx-auto max-w-7xl">

                        {/* ==================================================
                            HEADER
                        ================================================== */}

                        <div className="mb-8 animate-[fadeIn_0.5s_ease-out]">
                            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                                <div>
                                    <div className="flex items-center gap-3">

                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-600 text-2xl text-white shadow-lg shadow-green-200">
                                            📊
                                        </div>

                                        <div>
                                            <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
                                                Financial Reports
                                            </h1>

                                            <p className="mt-1 text-sm text-slate-500">
                                                Understand your farm's financial performance
                                            </p>
                                        </div>

                                    </div>
                                </div>

                                <button
                                    onClick={fetchReports}
                                    className="group flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-green-200 hover:text-green-700 hover:shadow-md"
                                >
                                    <span className="transition-transform duration-500 group-hover:rotate-180">
                                        ↻
                                    </span>

                                    Refresh Reports
                                </button>

                            </div>
                        </div>

                        {/* ==================================================
                            SUMMARY CARDS
                        ================================================== */}

                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                            {/* TOTAL INCOME */}

                            <div className="group rounded-2xl border border-green-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                                <div className="flex items-start justify-between">

                                    <div>
                                        <p className="text-sm font-medium text-slate-500">
                                            Total Income
                                        </p>

                                        <h2 className="mt-2 text-2xl font-bold text-slate-800">
                                            {formatCurrency(totals.income)}
                                        </h2>

                                        <p className="mt-2 text-xs font-medium text-green-600">
                                            Overall earnings
                                        </p>
                                    </div>

                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-xl transition-transform duration-300 group-hover:scale-110">
                                        💰
                                    </div>

                                </div>
                            </div>

                            {/* TOTAL EXPENSES */}

                            <div className="group rounded-2xl border border-red-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                                <div className="flex items-start justify-between">

                                    <div>
                                        <p className="text-sm font-medium text-slate-500">
                                            Total Expenses
                                        </p>

                                        <h2 className="mt-2 text-2xl font-bold text-slate-800">
                                            {formatCurrency(totals.expenses)}
                                        </h2>

                                        <p className="mt-2 text-xs font-medium text-red-500">
                                            Overall spending
                                        </p>
                                    </div>

                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-xl transition-transform duration-300 group-hover:scale-110">
                                        💸
                                    </div>

                                </div>
                            </div>

                            {/* PROFIT */}

                            <div className="group rounded-2xl border border-blue-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:col-span-2 lg:col-span-1">
                                <div className="flex items-start justify-between">

                                    <div>
                                        <p className="text-sm font-medium text-slate-500">
                                            Net Profit / Loss
                                        </p>

                                        <h2
                                            className={`mt-2 text-2xl font-bold ${totals.profit >= 0
                                                ? "text-green-600"
                                                : "text-red-600"
                                                }`}
                                        >
                                            {formatCurrency(totals.profit)}
                                        </h2>

                                        <p
                                            className={`mt-2 text-xs font-medium ${totals.profit >= 0
                                                ? "text-green-600"
                                                : "text-red-500"
                                                }`}
                                        >
                                            {totals.profit >= 0
                                                ? "Your farm is profitable"
                                                : "Expenses exceed income"}
                                        </p>
                                    </div>

                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl transition-transform duration-300 group-hover:scale-110">
                                        📈
                                    </div>

                                </div>
                            </div>

                        </div>

                        {/* ==================================================
                            MONTHLY FINANCIAL REPORT
                        ================================================== */}

                        <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-md">

                            <div className="mb-6">
                                <h2 className="text-lg font-bold text-slate-800">
                                    Monthly Income vs Expenses
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Compare your monthly earnings and spending
                                </p>
                            </div>

                            {monthlyData.length === 0 ? (
                                <EmptyState message="No monthly financial data available yet." />
                            ) : (
                                <div className="space-y-6">

                                    {monthlyData.map((item, index) => {

                                        const income = Number(
                                            item.totalIncome || 0
                                        );

                                        const expenses = Number(
                                            item.totalExpenses || 0
                                        );

                                        const profit = Number(
                                            item.profitLoss || 0
                                        );

                                        const incomeWidth =
                                            (income / maxMonthlyValue) * 100;

                                        const expenseWidth =
                                            (expenses / maxMonthlyValue) * 100;

                                        return (
                                            <div
                                                key={item.month}
                                                className="animate-[slideUp_0.5s_ease-out]"
                                                style={{
                                                    animationDelay: `${index * 80}ms`,
                                                }}
                                            >

                                                <div className="mb-2 flex items-center justify-between gap-4">

                                                    <span className="text-sm font-semibold text-slate-700">
                                                        {formatMonth(item.month)}
                                                    </span>

                                                    <span
                                                        className={`text-sm font-bold ${profit >= 0
                                                            ? "text-green-600"
                                                            : "text-red-600"
                                                            }`}
                                                    >
                                                        {profit >= 0 ? "+" : ""}
                                                        {formatCurrency(profit)}
                                                    </span>

                                                </div>

                                                <div className="space-y-2">

                                                    {/* INCOME */}

                                                    <div className="flex items-center gap-3">

                                                        <span className="w-16 text-xs text-slate-500">
                                                            Income
                                                        </span>

                                                        <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100">
                                                            <div
                                                                className="h-full rounded-full bg-green-500 transition-all duration-1000"
                                                                style={{
                                                                    width: `${Math.max(
                                                                        incomeWidth,
                                                                        income > 0 ? 3 : 0
                                                                    )}%`,
                                                                }}
                                                            />
                                                        </div>

                                                        <span className="w-28 text-right text-xs font-semibold text-slate-600">
                                                            {formatCurrency(income)}
                                                        </span>

                                                    </div>

                                                    {/* EXPENSE */}

                                                    <div className="flex items-center gap-3">

                                                        <span className="w-16 text-xs text-slate-500">
                                                            Expense
                                                        </span>

                                                        <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100">
                                                            <div
                                                                className="h-full rounded-full bg-red-400 transition-all duration-1000"
                                                                style={{
                                                                    width: `${Math.max(
                                                                        expenseWidth,
                                                                        expenses > 0 ? 3 : 0
                                                                    )}%`,
                                                                }}
                                                            />
                                                        </div>

                                                        <span className="w-28 text-right text-xs font-semibold text-slate-600">
                                                            {formatCurrency(expenses)}
                                                        </span>

                                                    </div>

                                                </div>
                                            </div>
                                        );
                                    })}

                                </div>
                            )}

                            <div className="mt-6 flex flex-wrap gap-5 border-t border-slate-100 pt-4">

                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <span className="h-3 w-3 rounded-full bg-green-500" />
                                    Income
                                </div>

                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <span className="h-3 w-3 rounded-full bg-red-400" />
                                    Expenses
                                </div>

                            </div>

                        </div>

                        {/* ==================================================
                            CROP WISE + EXPENSE CATEGORY
                        ================================================== */}

                        <div className="mt-6 grid gap-6 lg:grid-cols-2">

                            {/* CROP WISE */}

                            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-md">

                                <div className="mb-6">
                                    <h2 className="text-lg font-bold text-slate-800">
                                        Crop-wise Profit
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        See which crops are generating the most profit
                                    </p>
                                </div>

                                {cropData.length === 0 ? (
                                    <EmptyState message="No crop financial data available." />
                                ) : (
                                    <div className="space-y-4">

                                        {cropData.map((crop, index) => {

                                            const profit = Number(
                                                crop.profitLoss || 0
                                            );

                                            const income = Number(
                                                crop.totalIncome || 0
                                            );

                                            const expenses = Number(
                                                crop.totalExpenses || 0
                                            );

                                            return (
                                                <div
                                                    key={crop.cropId}
                                                    className="rounded-xl border border-slate-100 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-green-100 hover:bg-green-50/30"
                                                    style={{
                                                        animationDelay: `${index * 100}ms`,
                                                    }}
                                                >

                                                    <div className="flex items-center justify-between">

                                                        <div>

                                                            <h3 className="font-semibold text-slate-800">
                                                                {crop.cropName}
                                                            </h3>

                                                            <p className="mt-1 text-xs text-slate-500">
                                                                Income: {formatCurrency(income)}
                                                            </p>

                                                            <p className="text-xs text-slate-500">
                                                                Expenses: {formatCurrency(expenses)}
                                                            </p>

                                                        </div>

                                                        <div className="text-right">

                                                            <p
                                                                className={`text-lg font-bold ${profit >= 0
                                                                    ? "text-green-600"
                                                                    : "text-red-600"
                                                                    }`}
                                                            >
                                                                {profit >= 0 ? "+" : ""}
                                                                {formatCurrency(profit)}
                                                            </p>

                                                            <p className="text-xs text-slate-400">
                                                                {profit >= 0
                                                                    ? "Profit"
                                                                    : "Loss"}
                                                            </p>

                                                        </div>

                                                    </div>

                                                </div>
                                            );
                                        })}

                                    </div>
                                )}

                            </div>

                            {/* EXPENSE CATEGORIES */}

                            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-md">

                                <div className="mb-6">
                                    <h2 className="text-lg font-bold text-slate-800">
                                        Expense Categories
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Understand where your money is being spent
                                    </p>
                                </div>

                                {categoryData.length === 0 ? (
                                    <EmptyState message="No expense category data available." />
                                ) : (
                                    <div className="space-y-5">

                                        {categoryData.map((item, index) => {

                                            const amount = Number(
                                                item.totalAmount || 0
                                            );

                                            const percentage =
                                                (amount / maxCategoryAmount) *
                                                100;

                                            return (
                                                <div
                                                    key={`${item.category}-${index}`}
                                                    className="animate-[slideUp_0.5s_ease-out]"
                                                >

                                                    <div className="mb-2 flex items-center justify-between">

                                                        <span className="text-sm font-medium text-slate-700">
                                                            {item.category}
                                                        </span>

                                                        <span className="text-sm font-bold text-slate-800">
                                                            {formatCurrency(amount)}
                                                        </span>

                                                    </div>

                                                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">

                                                        <div
                                                            className="h-full rounded-full bg-green-500 transition-all duration-1000"
                                                            style={{
                                                                width: `${Math.max(
                                                                    percentage,
                                                                    amount > 0 ? 4 : 0
                                                                )}%`,
                                                            }}
                                                        />

                                                    </div>

                                                </div>
                                            );
                                        })}

                                    </div>
                                )}

                            </div>

                        </div>

                        {/* ==================================================
                            BUDGET VS ACTUAL
                        ================================================== */}

                        <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-md">

                            <div className="mb-6">

                                <h2 className="text-lg font-bold text-slate-800">
                                    Budget vs Actual Spending
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Track whether your spending is staying within budget
                                </p>

                            </div>

                            {budgetData.length === 0 ? (
                                <EmptyState message="No budget data available." />
                            ) : (
                                <div className="overflow-x-auto">

                                    <table className="w-full min-w-[700px] border-collapse">

                                        <thead>
                                            <tr className="border-b border-slate-100 text-left">

                                                <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                                    Crop
                                                </th>

                                                <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                                    Category
                                                </th>

                                                <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                                    Planned
                                                </th>

                                                <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                                    Actual
                                                </th>

                                                <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                                    Remaining
                                                </th>

                                                <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                                    Status
                                                </th>

                                            </tr>
                                        </thead>

                                        <tbody>

                                            {budgetData.map((item) => {

                                                const percentage = Number(
                                                    item.percentageUsed || 0
                                                );

                                                const remaining = Number(
                                                    item.remainingAmount || 0
                                                );

                                                let status;
                                                let statusClass;

                                                if (percentage >= 100) {
                                                    status = "Over Budget";
                                                    statusClass =
                                                        "bg-red-50 text-red-600";
                                                } else if (percentage >= 80) {
                                                    status = "Near Limit";
                                                    statusClass =
                                                        "bg-amber-50 text-amber-600";
                                                } else {
                                                    status = "On Track";
                                                    statusClass =
                                                        "bg-green-50 text-green-600";
                                                }

                                                return (
                                                    <tr
                                                        key={item.budgetId}
                                                        className="border-b border-slate-50 transition-colors duration-200 hover:bg-slate-50"
                                                    >

                                                        <td className="px-3 py-4 text-sm font-semibold text-slate-700">
                                                            {item.cropName}
                                                        </td>

                                                        <td className="px-3 py-4 text-sm text-slate-500">
                                                            {item.category}
                                                        </td>

                                                        <td className="px-3 py-4 text-sm font-medium text-slate-700">
                                                            {formatCurrency(
                                                                item.plannedAmount
                                                            )}
                                                        </td>

                                                        <td className="px-3 py-4 text-sm font-medium text-slate-700">
                                                            {formatCurrency(
                                                                item.actualSpent
                                                            )}
                                                        </td>

                                                        <td
                                                            className={`px-3 py-4 text-sm font-semibold ${remaining >= 0
                                                                ? "text-green-600"
                                                                : "text-red-600"
                                                                }`}
                                                        >
                                                            {formatCurrency(
                                                                remaining
                                                            )}
                                                        </td>

                                                        <td className="px-3 py-4">

                                                            <span
                                                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}
                                                            >
                                                                {status}
                                                            </span>

                                                        </td>

                                                    </tr>
                                                );
                                            })}

                                        </tbody>

                                    </table>

                                </div>
                            )}

                        </div>

                    </div>
                </main>
            </div>

            {/* ==================================================
                ANIMATIONS
            ================================================== */}

            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }

                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(12px);
                    }

                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

/*
============================================================
EMPTY STATE
============================================================
*/

const EmptyState = ({ message }) => {
    return (
        <div className="flex flex-col items-center justify-center rounded-xl bg-slate-50 px-5 py-12 text-center">

            <div className="mb-3 text-3xl">
                📊
            </div>

            <p className="text-sm text-slate-500">
                {message}
            </p>

        </div>
    );
};

export default Reports;
