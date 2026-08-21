
import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import DashboardNavbar from "../components/DashboardNavbar";

const API_URL = "http://localhost:5000/api";

const initialForm = {
    crop_id: "",
    category: "",
    planned_amount: "",
};

const categories = [
    "Seeds",
    "Fertilizer",
    "Pesticides",
    "Labor",
    "Irrigation",
    "Equipment",
    "Fuel",
    "Transportation",
    "Other",
];

const getToken = () => localStorage.getItem("token");

const getAuthConfig = () => ({
    headers: {
        Authorization: `Bearer ${getToken()} `,
    },
});

const formatCurrency = (value) => {
    const number = Number(value || 0);

    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(number);
};

const getStatusClasses = (status) => {
    switch (status) {
        case "OVER BUDGET":
            return {
                badge: "bg-red-100 text-red-700 border-red-200",
                bar: "bg-red-500",
            };

        case "NEAR LIMIT":
            return {
                badge: "bg-amber-100 text-amber-700 border-amber-200",
                bar: "bg-amber-500",
            };

        default:
            return {
                badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
                bar: "bg-emerald-500",
            };
    }
};

export default function Budget() {
    // --------------------------------------------------
    // SIDEBAR STATE
    // --------------------------------------------------

    const [sidebarOpen, setSidebarOpen] = useState(false);

    // --------------------------------------------------
    // BUDGET STATE
    // --------------------------------------------------

    const [budgets, setBudgets] = useState([]);
    const [crops, setCrops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingBudget, setEditingBudget] = useState(null);
    const [form, setForm] = useState(initialForm);
    const [statusData, setStatusData] = useState({});
    const [statusLoading, setStatusLoading] = useState({});
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // --------------------------------------------------
    // FETCH BUDGETS
    // --------------------------------------------------

    const fetchBudgets = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                `${API_URL}/budget`,
                getAuthConfig()
            );

            setBudgets(response.data.budgets || []);
        } catch (err) {
            console.error("Fetch budgets error:", err);

            setError(
                err.response?.data?.message ||
                "Unable to fetch budgets."
            );
        } finally {
            setLoading(false);
        }
    };

    // --------------------------------------------------
    // FETCH CROPS
    // --------------------------------------------------

    const fetchCrops = async () => {
        try {
            const response = await axios.get(
                `${API_URL}/crop`,
                getAuthConfig()
            );

            setCrops(response.data.crops || []);
        } catch (err) {
            console.error("Fetch crops error:", err);

            setError(
                err.response?.data?.message ||
                "Unable to fetch crops."
            );
        }
    };

    // --------------------------------------------------
    // FETCH BUDGET STATUS
    // --------------------------------------------------

    const fetchBudgetStatus = async (budgetId) => {
        try {
            setStatusLoading((prev) => ({
                ...prev,
                [budgetId]: true,
            }));

            const response = await axios.get(
                `${API_URL}/budget/${budgetId}/status`,
                getAuthConfig()
            );

            setStatusData((prev) => ({
                ...prev,
                [budgetId]: response.data,
            }));
        } catch (err) {
            console.error(
                `Fetch budget status ${budgetId} error:`,
                err
            );
        } finally {
            setStatusLoading((prev) => ({
                ...prev,
                [budgetId]: false,
            }));
        }
    };

    // --------------------------------------------------
    // INITIAL LOAD
    // --------------------------------------------------

    useEffect(() => {
        fetchBudgets();
        fetchCrops();
    }, []);

    // --------------------------------------------------
    // LOAD STATUS AFTER BUDGETS
    // --------------------------------------------------

    useEffect(() => {
        if (!budgets.length) return;

        budgets.forEach((budget) => {
            fetchBudgetStatus(budget.id);
        });
    }, [budgets]);

    // --------------------------------------------------
    // FORM CHANGE
    // --------------------------------------------------

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // --------------------------------------------------
    // OPEN ADD MODAL
    // --------------------------------------------------

    const openAddModal = () => {
        setEditingBudget(null);

        setForm({
            crop_id: "",
            category: "",
            planned_amount: "",
        });

        setError("");
        setSuccess("");
        setShowModal(true);
    };

    // --------------------------------------------------
    // OPEN EDIT MODAL
    // --------------------------------------------------

    const openEditModal = (budget) => {
        setEditingBudget(budget);

        setForm({
            crop_id: budget.crop_id,
            category: budget.category,
            planned_amount: budget.planned_amount,
        });

        setError("");
        setSuccess("");
        setShowModal(true);
    };

    // --------------------------------------------------
    // CLOSE MODAL
    // --------------------------------------------------

    const closeModal = () => {
        if (saving) return;

        setShowModal(false);
        setEditingBudget(null);
        setForm(initialForm);
    };

    // --------------------------------------------------
    // SAVE BUDGET
    // --------------------------------------------------

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!form.category || !form.planned_amount) {
            setError(
                "Category and planned amount are required."
            );
            return;
        }

        if (!editingBudget && !form.crop_id) {
            setError("Please select a crop.");
            return;
        }

        if (Number(form.planned_amount) <= 0) {
            setError(
                "Planned amount must be greater than zero."
            );
            return;
        }

        try {
            setSaving(true);

            if (editingBudget) {
                await axios.put(
                    `${API_URL}/budget/${editingBudget.id}`,
                    {
                        category: form.category,
                        planned_amount: Number(
                            form.planned_amount
                        ),
                    },
                    getAuthConfig()
                );

                setSuccess(
                    "Budget updated successfully."
                );
            } else {
                await axios.post(
                    `${API_URL}/budget`,
                    {
                        crop_id: Number(form.crop_id),
                        category: form.category,
                        planned_amount: Number(
                            form.planned_amount
                        ),
                    },
                    getAuthConfig()
                );

                setSuccess(
                    "Budget created successfully."
                );
            }

            setShowModal(false);
            setEditingBudget(null);
            setForm(initialForm);

            await fetchBudgets();
        } catch (err) {
            console.error(
                "Save budget error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to save budget."
            );
        } finally {
            setSaving(false);
        }
    };

    // --------------------------------------------------
    // DELETE BUDGET
    // --------------------------------------------------

    const handleDelete = async (budgetId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this budget?"
        );

        if (!confirmed) return;

        try {
            setError("");
            setSuccess("");

            await axios.delete(
                `${API_URL}/budget/${budgetId}`,
                getAuthConfig()
            );

            setSuccess(
                "Budget deleted successfully."
            );

            setBudgets((prev) =>
                prev.filter(
                    (budget) => budget.id !== budgetId
                )
            );

            setStatusData((prev) => {
                const updated = { ...prev };

                delete updated[budgetId];

                return updated;
            });
        } catch (err) {
            console.error(
                "Delete budget error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to delete budget."
            );
        }
    };

    // --------------------------------------------------
    // SUMMARY
    // --------------------------------------------------

    const summary = useMemo(() => {
        let planned = 0;
        let actual = 0;

        budgets.forEach((budget) => {
            planned += Number(
                budget.planned_amount || 0
            );

            actual += Number(
                statusData[budget.id]?.actualSpent || 0
            );
        });

        const remaining = planned - actual;

        const percentage =
            planned > 0
                ? (actual / planned) * 100
                : 0;

        return {
            planned,
            actual,
            remaining,
            percentage: Math.min(
                Math.max(percentage, 0),
                100
            ),
        };
    }, [budgets, statusData]);

    // --------------------------------------------------
    // RENDER
    // --------------------------------------------------

    return (
        <div className="min-h-screen bg-slate-50">

            {/* ==================================================
                SAME SIDEBAR AS EXPENSE / REPORTS
            ================================================== */}

            <Sidebar
                open={sidebarOpen}
                setOpen={setSidebarOpen}
            />

            {/* ==================================================
                MAIN CONTENT AREA
            ================================================== */}

            <div className="lg:pl-72">

                {/* SAME NAVBAR AS EXPENSE / REPORTS */}

                <DashboardNavbar
                    setSidebarOpen={setSidebarOpen}
                />

                <main className="p-4 sm:p-6 lg:p-8">

                    {/* ==================================================
                        BUDGET CONTENT
                    ================================================== */}

                    <div className="mx-auto max-w-7xl">

                        {/* HEADER */}

                        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                            <div>
                                <p className="mb-1 text-sm font-medium text-emerald-600">
                                    Financial Planning
                                </p>

                                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                                    Budget Management
                                </h1>

                                <p className="mt-2 text-sm text-slate-500">
                                    Plan your farming expenses and keep
                                    spending under control.
                                </p>
                            </div>

                            <button
                                onClick={openAddModal}
                                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-xl active:translate-y-0"
                            >
                                <span className="text-lg transition-transform duration-300 group-hover:rotate-90">
                                    +
                                </span>

                                Add Budget
                            </button>
                        </div>

                        {/* ALERTS */}

                        {error && (
                            <div className="mb-6 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                <span>{error}</span>

                                <button
                                    onClick={() => setError("")}
                                    className="ml-4 font-bold"
                                >
                                    ×
                                </button>
                            </div>
                        )}

                        {success && (
                            <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                                {success}
                            </div>
                        )}

                        {/* SUMMARY CARDS */}

                        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

                            <SummaryCard
                                title="Total Planned"
                                value={formatCurrency(
                                    summary.planned
                                )}
                                icon="₹"
                                description="Your total budget"
                            />

                            <SummaryCard
                                title="Actual Spent"
                                value={formatCurrency(
                                    summary.actual
                                )}
                                icon="↗"
                                description="Based on expenses"
                            />

                            <SummaryCard
                                title="Remaining"
                                value={formatCurrency(
                                    summary.remaining
                                )}
                                icon="✓"
                                description={
                                    summary.remaining >= 0
                                        ? "Available budget"
                                        : "Budget exceeded"
                                }
                                negative={
                                    summary.remaining < 0
                                }
                            />

                            <SummaryCard
                                title="Utilization"
                                value={`${summary.percentage.toFixed(
                                    1
                                )}%`}
                                icon="%"
                                description="Overall spending"
                            />

                        </div>

                        {/* OVERALL PROGRESS */}

                        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-md">

                            <div className="mb-3 flex items-center justify-between">

                                <div>
                                    <h2 className="font-semibold text-slate-900">
                                        Overall Budget Usage
                                    </h2>

                                    <p className="text-sm text-slate-500">
                                        Actual spending compared with planned
                                        spending
                                    </p>
                                </div>

                                <span className="text-sm font-bold text-slate-700">
                                    {summary.percentage.toFixed(1)}%
                                </span>

                            </div>

                            <div className="h-3 overflow-hidden rounded-full bg-slate-100">

                                <div
                                    className={`h-full rounded-full transition-all duration-700 ${summary.percentage >= 100
                                        ? "bg-red-500"
                                        : summary.percentage >= 80
                                            ? "bg-amber-500"
                                            : "bg-emerald-500"
                                        }`}
                                    style={{
                                        width: `${Math.min(
                                            summary.percentage,
                                            100
                                        )}%`,
                                    }}
                                />

                            </div>
                        </div>

                        {/* BUDGET LIST */}

                        <div className="mb-4 flex items-center justify-between">

                            <div>
                                <h2 className="text-xl font-bold text-slate-900">
                                    Your Budgets
                                </h2>

                                <p className="text-sm text-slate-500">
                                    {budgets.length} budget
                                    {budgets.length !== 1
                                        ? "s"
                                        : ""}{" "}
                                    created
                                </p>
                            </div>

                        </div>

                        {loading ? (
                            <BudgetSkeleton />
                        ) : budgets.length === 0 ? (
                            <EmptyBudgetState
                                onAdd={openAddModal}
                            />
                        ) : (
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

                                {budgets.map((budget) => {

                                    const status =
                                        statusData[budget.id];

                                    const planned =
                                        Number(
                                            budget.planned_amount || 0
                                        );

                                    const actual =
                                        Number(
                                            status?.actualSpent || 0
                                        );

                                    const percentage =
                                        status
                                            ? Number(
                                                status.percentageUsed || 0
                                            )
                                            : 0;

                                    const statusName =
                                        status?.status ||
                                        "ON TRACK";

                                    const statusClasses =
                                        getStatusClasses(
                                            statusName
                                        );

                                    return (
                                        <div
                                            key={budget.id}
                                            className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                                        >

                                            {/* CARD HEADER */}

                                            <div className="border-b border-slate-100 p-5">

                                                <div className="mb-4 flex items-start justify-between">

                                                    <div className="min-w-0">

                                                        <p className="mb-1 text-xs font-medium uppercase tracking-wider text-emerald-600">
                                                            {budget.farm_name ||
                                                                "Farm"}
                                                        </p>

                                                        <h3 className="truncate text-lg font-bold text-slate-900">
                                                            {budget.crop_name ||
                                                                "Crop"}
                                                        </h3>

                                                    </div>

                                                    <span className="ml-3 shrink-0 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                                                        #{budget.id}
                                                    </span>

                                                </div>

                                                <div className="flex items-center justify-between">

                                                    <span className="rounded-lg bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700">
                                                        {budget.category}
                                                    </span>

                                                    <span
                                                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusClasses.badge}`}
                                                    >
                                                        {statusName}
                                                    </span>

                                                </div>

                                            </div>

                                            {/* CARD BODY */}

                                            <div className="p-5">

                                                <div className="mb-5 grid grid-cols-2 gap-4">

                                                    <div>
                                                        <p className="text-xs text-slate-500">
                                                            Planned
                                                        </p>

                                                        <p className="mt-1 text-lg font-bold text-slate-900">
                                                            {formatCurrency(
                                                                planned
                                                            )}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="text-xs text-slate-500">
                                                            Spent
                                                        </p>

                                                        <p className="mt-1 text-lg font-bold text-slate-900">
                                                            {formatCurrency(
                                                                actual
                                                            )}
                                                        </p>
                                                    </div>

                                                </div>

                                                {/* PROGRESS */}

                                                <div className="mb-3 flex items-center justify-between text-xs">

                                                    <span className="text-slate-500">
                                                        Spending progress
                                                    </span>

                                                    <span className="font-semibold text-slate-700">
                                                        {percentage.toFixed(1)}%
                                                    </span>

                                                </div>

                                                <div className="mb-5 h-2.5 overflow-hidden rounded-full bg-slate-100">

                                                    <div
                                                        className={`h-full rounded-full transition-all duration-1000 ${statusClasses.bar}`}
                                                        style={{
                                                            width: `${Math.min(
                                                                percentage,
                                                                100
                                                            )}%`,
                                                        }}
                                                    />

                                                </div>

                                                {/* REMAINING */}

                                                <div className="mb-5 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">

                                                    <span className="text-sm text-slate-500">
                                                        Remaining
                                                    </span>

                                                    <span
                                                        className={`text-sm font-bold ${planned - actual < 0
                                                            ? "text-red-600"
                                                            : "text-emerald-600"
                                                            }`}
                                                    >
                                                        {formatCurrency(
                                                            planned - actual
                                                        )}
                                                    </span>

                                                </div>

                                                {/* ACTIONS */}

                                                <div className="flex gap-2">

                                                    <button
                                                        onClick={() =>
                                                            openEditModal(
                                                                budget
                                                            )
                                                        }
                                                        className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-200 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                budget.id
                                                            )
                                                        }
                                                        className="flex-1 rounded-xl border border-red-100 px-4 py-2.5 text-sm font-semibold text-red-600 transition-all duration-200 hover:bg-red-50"
                                                    >
                                                        Delete
                                                    </button>

                                                </div>

                                                {statusLoading[
                                                    budget.id
                                                ] && (
                                                        <p className="mt-3 text-center text-xs text-slate-400">
                                                            Updating spending status...
                                                        </p>
                                                    )}

                                            </div>
                                        </div>
                                    );
                                })}

                            </div>
                        )}

                    </div>
                </main>
            </div>

            {/* ==================================================
                ADD / EDIT MODAL
            ================================================== */}

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">

                    <div className="w-full max-w-lg animate-[fadeIn_0.2s_ease-out] rounded-2xl bg-white p-6 shadow-2xl">

                        <div className="mb-6 flex items-start justify-between">

                            <div>
                                <h2 className="text-xl font-bold text-slate-900">
                                    {editingBudget
                                        ? "Edit Budget"
                                        : "Create Budget"}
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    {editingBudget
                                        ? "Update your budget details."
                                        : "Set a spending limit for a crop."}
                                </p>
                            </div>

                            <button
                                onClick={closeModal}
                                className="rounded-lg p-2 text-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                            >
                                ×
                            </button>

                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >

                            {/* CROP */}

                            {!editingBudget && (
                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Crop
                                    </label>

                                    <select
                                        name="crop_id"
                                        value={form.crop_id}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                                    >
                                        <option value="">
                                            Select a crop
                                        </option>

                                        {crops.map((crop) => (
                                            <option
                                                key={crop.id}
                                                value={crop.id}
                                            >
                                                {crop.crop_name}

                                                {crop.farm_name
                                                    ? ` — ${crop.farm_name}`
                                                    : ""}
                                            </option>
                                        ))}
                                    </select>

                                </div>
                            )}

                            {/* CATEGORY */}

                            <div>

                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Expense Category
                                </label>

                                <select
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                                >
                                    <option value="">
                                        Select category
                                    </option>

                                    {categories.map(
                                        (category) => (
                                            <option
                                                key={category}
                                                value={category}
                                            >
                                                {category}
                                            </option>
                                        )
                                    )}
                                </select>

                            </div>

                            {/* AMOUNT */}

                            <div>

                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Planned Amount
                                </label>

                                <div className="relative">

                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-slate-400">
                                        ₹
                                    </span>

                                    <input
                                        type="number"
                                        name="planned_amount"
                                        value={
                                            form.planned_amount
                                        }
                                        onChange={handleChange}
                                        min="1"
                                        step="0.01"
                                        placeholder="5000"
                                        className="w-full rounded-xl border border-slate-200 py-3 pl-9 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                                    />

                                </div>
                            </div>

                            {error && (
                                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    {error}
                                </div>
                            )}

                            {/* BUTTONS */}

                            <div className="flex gap-3 pt-2">

                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={saving}
                                    className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-100 transition-all duration-300 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingBudget
                                            ? "Update Budget"
                                            : "Create Budget"}
                                </button>

                            </div>

                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

// --------------------------------------------------
// SUMMARY CARD
// --------------------------------------------------

function SummaryCard({
    title,
    value,
    icon,
    description,
    negative = false,
}) {
    return (
        <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

            <div className="flex items-start justify-between">

                <div>

                    <p className="text-sm font-medium text-slate-500">
                        {title}
                    </p>

                    <p
                        className={`mt-2 text-2xl font-bold ${negative
                            ? "text-red-600"
                            : "text-slate-900"
                            }`}
                    >
                        {value}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                        {description}
                    </p>

                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 font-bold text-emerald-600 transition-transform duration-300 group-hover:scale-110">
                    {icon}
                </div>

            </div>
        </div>
    );
}

// --------------------------------------------------
// EMPTY STATE
// --------------------------------------------------

function EmptyBudgetState({ onAdd }) {
    return (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-3xl text-emerald-600">
                ₹
            </div>

            <h3 className="text-lg font-bold text-slate-900">
                No budgets yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                Create your first crop budget to start
                tracking planned and actual farming
                expenses.
            </p>

            <button
                onClick={onAdd}
                className="mt-6 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-100 transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-700"
            >
                Create Your First Budget
            </button>

        </div>
    );
}

// --------------------------------------------------
// LOADING SKELETON
// --------------------------------------------------

function BudgetSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

            {[1, 2, 3].map((item) => (
                <div
                    key={item}
                    className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5"
                >

                    <div className="mb-5 flex justify-between">

                        <div>
                            <div className="h-3 w-20 rounded bg-slate-200" />

                            <div className="mt-3 h-5 w-32 rounded bg-slate-200" />
                        </div>

                        <div className="h-6 w-10 rounded bg-slate-200" />

                    </div>

                    <div className="mb-6 h-7 w-full rounded bg-slate-100" />

                    <div className="grid grid-cols-2 gap-4">

                        <div className="h-12 rounded bg-slate-100" />

                        <div className="h-12 rounded bg-slate-100" />

                    </div>

                    <div className="mt-5 h-3 rounded-full bg-slate-100" />

                    <div className="mt-5 h-12 rounded-xl bg-slate-100" />

                    <div className="mt-5 flex gap-2">

                        <div className="h-10 flex-1 rounded-xl bg-slate-100" />

                        <div className="h-10 flex-1 rounded-xl bg-slate-100" />

                    </div>

                </div>
            ))}

        </div>
    );
}

