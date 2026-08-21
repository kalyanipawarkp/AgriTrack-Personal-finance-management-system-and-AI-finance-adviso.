import { motion } from "framer-motion";
import {
    ArrowUpRight,
    BarChart3,
    CircleDollarSign,
    Leaf,
    RefreshCw,
    Sprout,
    Target,
    TrendingUp,
    Wallet,
} from "lucide-react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";
import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import DashboardNavbar from "../components/DashboardNavbar";
import StatCard from "../components/StatCard";
import AIInsightCard from "../components/AIInsightCard";
import api from "../services/api";

function Dashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // --------------------------------------------------
    // FETCH DASHBOARD DATA
    // --------------------------------------------------

    const fetchDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            const response = await api.get("/dashboard", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setDashboardData(response.data);
        } catch (err) {
            console.error("Dashboard error:", err);

            setError(
                err.response?.data?.message ||
                "Unable to load dashboard data."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    // --------------------------------------------------
    // FORMAT DATE
    // --------------------------------------------------

    const formatDate = (date) => {
        if (!date) return "";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    // --------------------------------------------------
    // CHART DATA
    // --------------------------------------------------

    const chartData = dashboardData
        ? [
            {
                name: "Financial Summary",
                Income: Number(
                    dashboardData.summary?.totalIncome || 0
                ),
                Expenses: Number(
                    dashboardData.summary?.totalExpenses || 0
                ),
            },
        ]
        : [];

    // --------------------------------------------------
    // BUDGET CALCULATION
    // --------------------------------------------------

    const plannedBudget = Number(
        dashboardData?.budgets?.totalPlannedAmount || 0
    );

    const totalExpenses = Number(
        dashboardData?.summary?.totalExpenses || 0
    );

    const budgetUsage =
        plannedBudget > 0
            ? (totalExpenses / plannedBudget) * 100
            : 0;

    const budgetProgress = Math.min(budgetUsage, 100);

    const budgetExceeded = budgetUsage > 100;

    // --------------------------------------------------
    // RENDER
    // --------------------------------------------------

    return (
        <div className="min-h-screen bg-slate-50">

            {/* SIDEBAR */}
            <Sidebar
                open={sidebarOpen}
                setOpen={setSidebarOpen}
            />



            {/* MAIN AREA */}
            <div className="lg:pl-72">

                {/* NAVBAR */}
                <DashboardNavbar
                    setSidebarOpen={setSidebarOpen}
                />

                <main className="p-4 sm:p-6 lg:p-8">

                    {/* ==========================================
              PAGE HEADER
          ========================================== */}

                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

                            <div>
                                <p className="text-sm font-medium text-green-700">
                                    Farm Overview
                                </p>

                                <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                                    Dashboard
                                </h1>

                                <p className="mt-2 text-sm text-slate-500">
                                    Here's what's happening with your farm finances.
                                </p>
                            </div>

                            {/* REFRESH */}
                            <button
                                onClick={fetchDashboard}
                                disabled={loading}
                                className="inline-flex w-fit items-center gap-2 rounded-xl border border-green-100 bg-white px-4 py-2.5 text-sm font-semibold text-green-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-green-50 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <RefreshCw
                                    size={16}
                                    className={
                                        loading ? "animate-spin" : ""
                                    }
                                />

                                Refresh Dashboard
                            </button>

                        </div>
                    </motion.div>

                    {/* ERROR */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600"
                        >
                            {error}
                        </motion.div>
                    )}

                    {/* ==========================================
              STAT CARDS
          ========================================== */}

                    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

                        <StatCard
                            title="Total Income"
                            value={
                                loading
                                    ? "..."
                                    : `₹${Number(
                                        dashboardData?.summary
                                            ?.totalIncome || 0
                                    ).toLocaleString("en-IN")}`
                            }
                            icon={Wallet}
                            description="Total recorded income"
                        />

                        <StatCard
                            title="Total Expenses"
                            value={
                                loading
                                    ? "..."
                                    : `₹${Number(
                                        dashboardData?.summary
                                            ?.totalExpenses || 0
                                    ).toLocaleString("en-IN")}`
                            }
                            icon={CircleDollarSign}
                            description="Total recorded expenses"
                            iconStyle="bg-orange-100 text-orange-600"
                        />

                        <StatCard
                            title="Total Profit"
                            value={
                                loading
                                    ? "..."
                                    : `₹${Number(
                                        dashboardData?.summary
                                            ?.profitLoss || 0
                                    ).toLocaleString("en-IN")}`
                            }
                            icon={TrendingUp}
                            description={
                                dashboardData?.summary
                                    ?.financialStatus === "PROFIT"
                                    ? "Current financial status: Profit"
                                    : "Current financial status: Loss"
                            }
                            iconStyle="bg-blue-100 text-blue-600"
                        />

                        <StatCard
                            title="Active Crops"
                            value={
                                loading
                                    ? "..."
                                    : dashboardData?.crops || 0
                            }
                            icon={Sprout}
                            description="Currently managed crops"
                            iconStyle="bg-lime-100 text-lime-700"
                        />

                    </div>

                    {/* ==========================================
              FARM & CROP SUMMARY
          ========================================== */}

                    <div className="mt-6 grid gap-5 sm:grid-cols-2">

                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="flex items-center gap-4 rounded-2xl border border-green-100 bg-white p-5 shadow-sm"
                        >
                            <div className="rounded-2xl bg-green-100 p-4 text-green-700">
                                <Leaf size={24} />
                            </div>

                            <div>
                                <p className="text-sm text-slate-500">
                                    Your Farms
                                </p>

                                <p className="text-2xl font-bold text-slate-900">
                                    {dashboardData?.farms || 0}
                                </p>

                                <p className="text-xs text-slate-400">
                                    Registered farms
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center gap-4 rounded-2xl border border-lime-100 bg-white p-5 shadow-sm"
                        >
                            <div className="rounded-2xl bg-lime-100 p-4 text-lime-700">
                                <Sprout size={24} />
                            </div>

                            <div>
                                <p className="text-sm text-slate-500">
                                    Managed Crops
                                </p>

                                <p className="text-2xl font-bold text-slate-900">
                                    {dashboardData?.crops || 0}
                                </p>

                                <p className="text-xs text-slate-400">
                                    Active crops
                                </p>
                            </div>
                        </motion.div>

                    </div>

                    {/* ==========================================
              FINANCIAL OVERVIEW + QUICK ACTIONS
          ========================================== */}

                    <div className="mt-6 grid gap-6 xl:grid-cols-3">

                        {/* FINANCIAL CHART */}

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 }}
                            className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm xl:col-span-2"
                        >

                            <div className="flex items-center justify-between">

                                <div>
                                    <h2 className="font-bold text-slate-900">
                                        Financial Overview
                                    </h2>

                                    <p className="mt-1 text-xs text-slate-400">
                                        Income and expenses
                                    </p>
                                </div>

                                <button className="flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-semibold text-green-700 transition hover:bg-green-50">
                                    View Reports
                                    <ArrowUpRight size={14} />
                                </button>

                            </div>

                            <div className="mt-6 h-72 w-full">

                                {loading ? (
                                    <div className="flex h-full items-center justify-center rounded-xl bg-slate-50">
                                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-200 border-t-green-700" />
                                    </div>
                                ) : (
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <BarChart
                                            data={chartData}
                                            margin={{
                                                top: 10,
                                                right: 10,
                                                left: 0,
                                                bottom: 10,
                                            }}
                                        >

                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                vertical={false}
                                            />

                                            <XAxis
                                                dataKey="name"
                                                tick={{ fontSize: 12 }}
                                                axisLine={false}
                                                tickLine={false}
                                            />

                                            <YAxis
                                                tick={{ fontSize: 12 }}
                                                axisLine={false}
                                                tickLine={false}
                                                tickFormatter={(value) =>
                                                    `₹${Number(
                                                        value
                                                    ).toLocaleString("en-IN")}`
                                                }
                                            />

                                            <Tooltip
                                                formatter={(value) =>
                                                    `₹${Number(
                                                        value
                                                    ).toLocaleString("en-IN")}`
                                                }
                                                contentStyle={{
                                                    borderRadius: "12px",
                                                    border: "1px solid #e2e8f0",
                                                    boxShadow:
                                                        "0 10px 30px rgba(0,0,0,0.08)",
                                                }}
                                            />

                                            <Legend />

                                            <Bar
                                                dataKey="Income"
                                                fill="#16a34a"
                                                radius={[8, 8, 0, 0]}
                                                animationDuration={1000}
                                            />

                                            <Bar
                                                dataKey="Expenses"
                                                fill="#f97316"
                                                radius={[8, 8, 0, 0]}
                                                animationDuration={1200}
                                            />

                                        </BarChart>
                                    </ResponsiveContainer>
                                )}

                            </div>

                        </motion.div>

                        {/* QUICK ACTIONS */}

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35 }}
                            className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
                        >

                            <h2 className="font-bold text-slate-900">
                                Quick Actions
                            </h2>

                            <p className="mt-1 text-xs text-slate-400">
                                Manage your farm quickly
                            </p>

                            <div className="mt-6 space-y-3">

                                {[
                                    {
                                        icon: Leaf,
                                        title: "Add Farm",
                                    },
                                    {
                                        icon: Sprout,
                                        title: "Add Crop",
                                    },
                                    {
                                        icon: CircleDollarSign,
                                        title: "Add Expense",
                                    },
                                    {
                                        icon: Wallet,
                                        title: "Add Income",
                                    },
                                    {
                                        icon: Target,
                                        title: "Create Budget",
                                    },
                                ].map((action) => {
                                    const Icon = action.icon;

                                    return (
                                        <button
                                            key={action.title}
                                            className="flex w-full items-center gap-3 rounded-xl border border-slate-100 p-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-green-100 hover:bg-green-50"
                                        >
                                            <div className="rounded-lg bg-green-100 p-2 text-green-700">
                                                <Icon size={17} />
                                            </div>

                                            <span className="text-sm font-medium text-slate-700">
                                                {action.title}
                                            </span>

                                            <ArrowUpRight
                                                size={15}
                                                className="ml-auto text-slate-400"
                                            />
                                        </button>
                                    );
                                })}

                            </div>

                        </motion.div>

                    </div>

                    {/* ==========================================
              BUDGET + RECENT ACTIVITY
          ========================================== */}

                    <div className="mt-6 grid gap-6 lg:grid-cols-2">

                        {/* BUDGET STATUS */}

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.45 }}
                            className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
                        >

                            <div className="flex items-center gap-3">

                                <div className="rounded-xl bg-green-100 p-3 text-green-700">
                                    <Target size={20} />
                                </div>

                                <div>
                                    <h2 className="font-bold text-slate-900">
                                        Budget Status
                                    </h2>

                                    <p className="text-xs text-slate-400">
                                        Monitor your planned spending
                                    </p>
                                </div>

                            </div>

                            <div className="mt-6">

                                <div className="flex items-end justify-between">

                                    <div>
                                        <p className="text-xs text-slate-400">
                                            Planned Amount
                                        </p>

                                        <p className="mt-1 text-2xl font-bold text-slate-900">
                                            ₹
                                            {plannedBudget.toLocaleString(
                                                "en-IN"
                                            )}
                                        </p>
                                    </div>

                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${budgetExceeded
                                            ? "bg-red-50 text-red-600"
                                            : "bg-green-50 text-green-700"
                                            }`}
                                    >
                                        {budgetExceeded
                                            ? "Budget Exceeded"
                                            : "Within Budget"}
                                    </span>

                                </div>

                                <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">

                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{
                                            width: `${budgetProgress}%`,
                                        }}
                                        transition={{
                                            duration: 1,
                                            ease: "easeOut",
                                        }}
                                        className={`h-full rounded-full ${budgetExceeded
                                            ? "bg-red-500"
                                            : "bg-green-600"
                                            }`}
                                    />

                                </div>

                                <div className="mt-3 flex items-center justify-between text-xs">

                                    <span className="text-slate-400">
                                        Spent: ₹
                                        {totalExpenses.toLocaleString(
                                            "en-IN"
                                        )}
                                    </span>

                                    <span
                                        className={`font-semibold ${budgetExceeded
                                            ? "text-red-600"
                                            : "text-green-700"
                                            }`}
                                    >
                                        {Math.round(budgetUsage)}% used
                                    </span>

                                </div>

                            </div>

                        </motion.div>

                        {/* RECENT ACTIVITY */}

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.55 }}
                            className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
                        >

                            <div className="flex items-center gap-3">

                                <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                                    <BarChart3 size={20} />
                                </div>

                                <div>
                                    <h2 className="font-bold text-slate-900">
                                        Recent Activity
                                    </h2>

                                    <p className="text-xs text-slate-400">
                                        Your latest financial activity
                                    </p>
                                </div>

                            </div>

                            <div className="mt-6 space-y-3">

                                {/* RECENT INCOME */}

                                {dashboardData?.recentIncome?.map(
                                    (income) => (
                                        <motion.div
                                            key={`income-${income.id}`}
                                            initial={{
                                                opacity: 0,
                                                x: 15,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                x: 0,
                                            }}
                                            className="flex items-center gap-3 rounded-xl bg-green-50 p-3"
                                        >

                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-700">
                                                <Wallet size={18} />
                                            </div>

                                            <div className="min-w-0 flex-1">

                                                <p className="truncate text-sm font-semibold text-slate-800">
                                                    {income.crop_name}
                                                </p>

                                                <p className="text-xs text-slate-400">
                                                    Income •{" "}
                                                    {income.quantity}{" "}
                                                    {income.unit} •{" "}
                                                    {formatDate(
                                                        income.sale_date
                                                    )}
                                                </p>

                                            </div>

                                            <p className="text-sm font-bold text-green-700">
                                                +₹
                                                {Number(
                                                    income.total_amount
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}
                                            </p>

                                        </motion.div>
                                    )
                                )}

                                {/* RECENT EXPENSES */}

                                {dashboardData?.recentExpenses?.map(
                                    (expense) => (
                                        <motion.div
                                            key={`expense-${expense.id}`}
                                            initial={{
                                                opacity: 0,
                                                x: 15,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                x: 0,
                                            }}
                                            transition={{
                                                delay: 0.1,
                                            }}
                                            className="flex items-center gap-3 rounded-xl bg-orange-50 p-3"
                                        >

                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                                                <CircleDollarSign
                                                    size={18}
                                                />
                                            </div>

                                            <div className="min-w-0 flex-1">

                                                <p className="truncate text-sm font-semibold text-slate-800">
                                                    {expense.category}
                                                </p>

                                                <p className="text-xs text-slate-400">
                                                    {expense.crop_name ||
                                                        "Farm Expense"}{" "}
                                                    •{" "}
                                                    {formatDate(
                                                        expense.expense_date
                                                    )}
                                                </p>

                                            </div>

                                            <p className="text-sm font-bold text-orange-600">
                                                -₹
                                                {Number(
                                                    expense.amount
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}
                                            </p>

                                        </motion.div>
                                    )
                                )}

                                {/* EMPTY STATE */}

                                {!dashboardData?.recentIncome
                                    ?.length &&
                                    !dashboardData?.recentExpenses
                                        ?.length && (
                                        <div className="rounded-xl bg-slate-50 p-5 text-center">
                                            <p className="text-sm text-slate-500">
                                                No recent activity
                                            </p>

                                            <p className="mt-1 text-xs text-slate-400">
                                                Recent income and expenses
                                                will appear here.
                                            </p>
                                        </div>
                                    )}

                            </div>

                        </motion.div>

                    </div>

                    {/* ==========================================
              AI INSIGHT
          ========================================== */}

                    <div className="mt-6">
                        <AIInsightCard />
                    </div>

                </main>
            </div>
        </div>
    );
}

export default Dashboard;
