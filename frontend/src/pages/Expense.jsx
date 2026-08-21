import { motion, AnimatePresence } from "framer-motion";

import {
    IndianRupee,
    Plus,
    Search,
    RefreshCw,
    CalendarDays,
    Pencil,
    Trash2,
    X,
    TrendingDown,
    Wheat,
    Wallet,
    CircleDollarSign,
    Receipt,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import Sidebar from "../components/Sidebar";
import DashboardNavbar from "../components/DashboardNavbar";
import api from "../services/api";

function Expense() {
    // =========================================================
    // STATE
    // =========================================================

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [expenses, setExpenses] = useState([]);
    const [crops, setCrops] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [search, setSearch] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [editingExpense, setEditingExpense] = useState(null);
    const [deletingExpense, setDeletingExpense] = useState(null);

    const [formData, setFormData] = useState({
        crop_id: "",
        category: "",
        amount: "",
        expense_date: "",
        description: "",
    });

    // =========================================================
    // AUTH CONFIG
    // =========================================================

    const getConfig = () => {
        const token = localStorage.getItem("token");

        return {
            headers: {
                Authorization: `Bearer ${token} `,
            },
        };
    };

    // =========================================================
    // FETCH EXPENSES
    // =========================================================

    const fetchExpenses = async () => {
        try {
            setLoading(true);

            // IMPORTANT:
            // Backend route is /api/expenses
            const response = await api.get(
                "/expenses",
                getConfig()
            );

            setExpenses(response.data?.expenses || []);
        } catch (error) {
            console.error(
                "Fetch expenses error:",
                error.response?.data || error
            );

            alert(
                error.response?.data?.message ||
                "Unable to fetch expenses."
            );
        } finally {
            setLoading(false);
        }
    };

    // =========================================================
    // FETCH CROPS
    // =========================================================

    const fetchCrops = async () => {
        try {
            const response = await api.get(
                "/crop",
                getConfig()
            );

            setCrops(response.data?.crops || []);
        } catch (error) {
            console.error(
                "Fetch crops error:",
                error.response?.data || error
            );
        }
    };

    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {
        fetchExpenses();
        fetchCrops();
    }, []);

    // =========================================================
    // FORM CHANGE
    // =========================================================

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // =========================================================
    // OPEN ADD MODAL
    // =========================================================

    const openAddModal = () => {
        setEditingExpense(null);

        setFormData({
            crop_id: crops.length > 0 ? crops[0].id : "",
            category: "",
            amount: "",
            expense_date: "",
            description: "",
        });

        setShowModal(true);
    };

    // =========================================================
    // OPEN EDIT MODAL
    // =========================================================

    const openEditModal = (item) => {
        setEditingExpense(item);

        setFormData({
            crop_id: item.crop_id || "",
            category: item.category || "",
            amount: item.amount || "",
            expense_date: item.expense_date
                ? item.expense_date.substring(0, 10)
                : "",
            description: item.description || "",
        });

        setShowModal(true);
    };

    // =========================================================
    // CLOSE MODAL
    // =========================================================

    const closeModal = () => {
        if (saving) return;

        setShowModal(false);
        setEditingExpense(null);

        setFormData({
            crop_id: "",
            category: "",
            amount: "",
            expense_date: "",
            description: "",
        });
    };

    // =========================================================
    // CREATE / UPDATE EXPENSE
    // =========================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.crop_id) {
            alert("Please select a crop.");
            return;
        }

        if (!formData.category.trim()) {
            alert("Expense category is required.");
            return;
        }

        if (!formData.amount) {
            alert("Amount is required.");
            return;
        }

        if (!formData.expense_date) {
            alert("Expense date is required.");
            return;
        }

        try {
            setSaving(true);

            const data = {
                crop_id: Number(formData.crop_id),
                category: formData.category.trim(),
                amount: Number(formData.amount),
                expense_date: formData.expense_date,
                description: formData.description.trim(),
            };

            if (editingExpense) {
                await api.put(
                    `/expenses/${editingExpense.id} `,
                    data,
                    getConfig()
                );
            } else {
                await api.post(
                    "/expenses",
                    data,
                    getConfig()
                );
            }

            closeModal();

            await fetchExpenses();
        } catch (error) {
            console.error(
                "Expense save error:",
                error.response?.data || error
            );

            alert(
                error.response?.data?.message ||
                "Unable to save expense."
            );
        } finally {
            setSaving(false);
        }
    };

    // =========================================================
    // DELETE
    // =========================================================

    const openDeleteModal = (item) => {
        setDeletingExpense(item);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        if (saving) return;

        setShowDeleteModal(false);
        setDeletingExpense(null);
    };

    const handleDelete = async () => {
        if (!deletingExpense) return;

        try {
            setSaving(true);

            await api.delete(
                `/expenses/${deletingExpense.id} `,
                getConfig()
            );

            closeDeleteModal();

            await fetchExpenses();
        } catch (error) {
            console.error(
                "Delete expense error:",
                error.response?.data || error
            );

            alert(
                error.response?.data?.message ||
                "Unable to delete expense."
            );
        } finally {
            setSaving(false);
        }
    };

    // =========================================================
    // SEARCH
    // =========================================================

    const filteredExpenses = expenses.filter((item) => {
        const value = search.toLowerCase();

        return (
            item.crop_name
                ?.toLowerCase()
                .includes(value) ||
            item.category
                ?.toLowerCase()
                .includes(value) ||
            item.description
                ?.toLowerCase()
                .includes(value) ||
            String(item.amount || "")
                .toLowerCase()
                .includes(value)
        );
    });

    // =========================================================
    // TOTAL EXPENSE
    // =========================================================

    const totalExpense = useMemo(() => {
        return expenses.reduce(
            (total, item) =>
                total + Number(item.amount || 0),
            0
        );
    }, [expenses]);

    // =========================================================
    // TOTAL RECORDS
    // =========================================================

    const totalRecords = expenses.length;

    // =========================================================
    // INR FORMAT
    // =========================================================

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2,
        }).format(Number(amount || 0));
    };

    // =========================================================
    // DATE FORMAT
    // =========================================================

    const formatDate = (date) => {
        if (!date) return "Not set";

        return new Date(date).toLocaleDateString(
            "en-IN"
        );
    };

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <div className="min-h-screen bg-slate-50">

            {/* =================================================
                SIDEBAR
            ================================================= */}

            <Sidebar
                open={sidebarOpen}
                setOpen={setSidebarOpen}
            />

            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <div className="lg:pl-72">

                {/* =================================================
                    NAVBAR
                ================================================= */}

                <DashboardNavbar
                    setSidebarOpen={setSidebarOpen}
                />

                <main className="p-4 sm:p-6 lg:p-8">

                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 15,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        className="mb-8"
                    >
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

                            <div>

                                <div className="flex items-center gap-2 text-sm font-semibold text-red-600">

                                    <TrendingDown size={16} />

                                    Expense Management

                                </div>

                                <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                                    My Expenses
                                </h1>

                                <p className="mt-2 text-sm text-slate-500">
                                    Track your farm expenses,
                                    categories, amounts and dates.
                                </p>

                            </div>

                            <div className="flex gap-2">

                                <button
                                    onClick={fetchExpenses}
                                    disabled={loading}
                                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
                                >

                                    <RefreshCw
                                        size={16}
                                        className={
                                            loading
                                                ? "animate-spin"
                                                : ""
                                        }
                                    />

                                    Refresh

                                </button>

                                <button
                                    onClick={openAddModal}
                                    disabled={
                                        crops.length === 0
                                    }
                                    className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-green-700/20 transition-all hover:-translate-y-0.5 hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
                                >

                                    <Plus size={17} />

                                    Add Expense

                                </button>

                            </div>

                        </div>
                    </motion.div>

                    {/* =================================================
                        NO CROPS WARNING
                    ================================================= */}

                    {!loading && crops.length === 0 && (
                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 10,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            className="mb-6 flex items-start gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5"
                        >

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                                <Wheat size={20} />
                            </div>

                            <div>

                                <h3 className="font-semibold text-amber-900">
                                    Add a crop first
                                </h3>

                                <p className="mt-1 text-sm text-amber-700">
                                    Expenses must be linked to a
                                    crop. Add a crop before
                                    recording your first expense.
                                </p>

                            </div>

                        </motion.div>
                    )}

                    {/* =================================================
                        SUMMARY CARDS
                    ================================================= */}

                    <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

                        {/* TOTAL EXPENSE */}

                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 15,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
                        >

                            <div className="flex items-center justify-between">

                                <div>

                                    <p className="text-sm font-medium text-slate-500">
                                        Total Expenses
                                    </p>

                                    <p className="mt-2 text-2xl font-bold text-slate-900">
                                        {formatCurrency(
                                            totalExpense
                                        )}
                                    </p>

                                </div>

                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">

                                    <IndianRupee size={23} />

                                </div>

                            </div>

                            <div className="mt-4 flex items-center gap-2 text-xs text-red-600">

                                <TrendingDown size={14} />

                                Total recorded farm expenses

                            </div>

                        </motion.div>

                        {/* TOTAL RECORDS */}

                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 15,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            transition={{
                                delay: 0.05,
                            }}
                            className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
                        >

                            <div className="flex items-center justify-between">

                                <div>

                                    <p className="text-sm font-medium text-slate-500">
                                        Expense Records
                                    </p>

                                    <p className="mt-2 text-2xl font-bold text-slate-900">
                                        {totalRecords}
                                    </p>

                                </div>

                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">

                                    <Receipt size={23} />

                                </div>

                            </div>

                            <div className="mt-4 text-xs text-slate-500">
                                Recorded expense transactions
                            </div>

                        </motion.div>

                        {/* AVERAGE EXPENSE */}

                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 15,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            transition={{
                                delay: 0.1,
                            }}
                            className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
                        >

                            <div className="flex items-center justify-between">

                                <div>

                                    <p className="text-sm font-medium text-slate-500">
                                        Average Expense
                                    </p>

                                    <p className="mt-2 text-2xl font-bold text-slate-900">

                                        {formatCurrency(
                                            totalRecords
                                                ? totalExpense /
                                                totalRecords
                                                : 0
                                        )}

                                    </p>

                                </div>

                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">

                                    <CircleDollarSign
                                        size={23}
                                    />

                                </div>

                            </div>

                            <div className="mt-4 text-xs text-slate-500">
                                Average amount per record
                            </div>

                        </motion.div>

                    </div>

                    {/* =================================================
                        SEARCH
                    ================================================= */}

                    <div className="mb-6 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">

                        <div className="relative">

                            <Search
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type="text"
                                placeholder="Search by crop, category, description or amount..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
                            />

                        </div>

                    </div>

                    {/* =================================================
                        LOADING
                    ================================================= */}

                    {loading && (
                        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

                            {[1, 2, 3].map((item) => (
                                <div
                                    key={item}
                                    className="h-72 animate-pulse rounded-2xl bg-white shadow-sm"
                                />
                            ))}

                        </div>
                    )}

                    {/* =================================================
                        EMPTY
                    ================================================= */}

                    {!loading &&
                        filteredExpenses.length === 0 && (
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    scale: 0.97,
                                }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                }}
                                className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center"
                            >

                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-600">

                                    <Wallet size={30} />

                                </div>

                                <h2 className="mt-5 text-lg font-bold text-slate-900">

                                    {search
                                        ? "No matching expenses"
                                        : "No expenses found"}

                                </h2>

                                <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">

                                    {search
                                        ? "Try a different search term."
                                        : "Record your first farm expense to start tracking your spending."}

                                </p>

                                {!search &&
                                    crops.length > 0 && (
                                        <button
                                            onClick={
                                                openAddModal
                                            }
                                            className="mt-6 rounded-xl bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800"
                                        >
                                            Add Your First Expense
                                        </button>
                                    )}

                            </motion.div>
                        )}

                    {/* =================================================
                        EXPENSE CARDS
                    ================================================= */}

                    {!loading &&
                        filteredExpenses.length > 0 && (
                            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

                                <AnimatePresence>

                                    {filteredExpenses.map(
                                        (item, index) => {

                                            return (
                                                <motion.div
                                                    key={item.id}
                                                    layout
                                                    initial={{
                                                        opacity: 0,
                                                        y: 20,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        y: 0,
                                                    }}
                                                    exit={{
                                                        opacity: 0,
                                                        scale: 0.95,
                                                    }}
                                                    transition={{
                                                        delay:
                                                            index *
                                                            0.05,
                                                    }}
                                                    className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                                                >

                                                    {/* CARD HEADER */}

                                                    <div className="relative h-32 overflow-hidden bg-gradient-to-br from-red-600 via-orange-500 to-amber-400">

                                                        <div className="absolute -right-8 -top-12 h-36 w-36 rounded-full bg-white/10" />

                                                        <div className="absolute -bottom-16 -left-8 h-36 w-36 rounded-full bg-yellow-300/10" />

                                                        <div className="relative flex h-full items-center justify-between p-6">

                                                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur">

                                                                <IndianRupee
                                                                    size={28}
                                                                />

                                                            </div>

                                                            <span className="rounded-full border border-white/30 bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">

                                                                Expense

                                                            </span>

                                                        </div>

                                                    </div>

                                                    {/* CARD BODY */}

                                                    <div className="p-5">

                                                        <div className="flex items-start justify-between gap-3">

                                                            <div className="min-w-0">

                                                                <h2 className="truncate text-lg font-bold text-slate-900">

                                                                    {item.category ||
                                                                        "Farm Expense"}

                                                                </h2>

                                                                <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">

                                                                    <Wheat
                                                                        size={
                                                                            13
                                                                        }
                                                                        className="text-green-600"
                                                                    />

                                                                    <span className="truncate">

                                                                        {item.crop_name ||
                                                                            `Crop #${item.crop_id} `}

                                                                    </span>

                                                                </div>

                                                            </div>

                                                            <div className="flex shrink-0 gap-1">

                                                                <button
                                                                    onClick={() =>
                                                                        openEditModal(
                                                                            item
                                                                        )
                                                                    }
                                                                    className="rounded-lg p-2 text-slate-400 transition hover:bg-green-50 hover:text-green-700"
                                                                    title="Edit expense"
                                                                >

                                                                    <Pencil
                                                                        size={
                                                                            16
                                                                        }
                                                                    />

                                                                </button>

                                                                <button
                                                                    onClick={() =>
                                                                        openDeleteModal(
                                                                            item
                                                                        )
                                                                    }
                                                                    className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                                                                    title="Delete expense"
                                                                >

                                                                    <Trash2
                                                                        size={
                                                                            16
                                                                        }
                                                                    />

                                                                </button>

                                                            </div>

                                                        </div>

                                                        {/* AMOUNT */}

                                                        <div className="mt-5 rounded-xl bg-red-50 p-4">

                                                            <div className="flex items-center gap-2 text-xs text-red-600">

                                                                <IndianRupee
                                                                    size={
                                                                        14
                                                                    }
                                                                />

                                                                Expense Amount

                                                            </div>

                                                            <p className="mt-1 text-xl font-bold text-red-800">

                                                                {formatCurrency(
                                                                    item.amount
                                                                )}

                                                            </p>

                                                        </div>

                                                        {/* DETAILS */}

                                                        <div className="mt-3 grid grid-cols-2 gap-3">

                                                            <div className="rounded-xl bg-slate-50 p-3">

                                                                <div className="text-xs text-slate-400">
                                                                    Category
                                                                </div>

                                                                <p className="mt-1 truncate text-sm font-bold text-slate-700">

                                                                    {item.category ||
                                                                        "—"}

                                                                </p>

                                                            </div>

                                                            <div className="rounded-xl bg-slate-50 p-3">

                                                                <div className="text-xs text-slate-400">
                                                                    Crop
                                                                </div>

                                                                <p className="mt-1 truncate text-sm font-bold text-slate-700">

                                                                    {item.crop_name ||
                                                                        `Crop #${item.crop_id} `}

                                                                </p>

                                                            </div>

                                                        </div>

                                                        {/* DESCRIPTION */}

                                                        {item.description && (
                                                            <div className="mt-3 rounded-xl bg-slate-50 p-3">

                                                                <div className="text-xs text-slate-400">
                                                                    Description
                                                                </div>

                                                                <p className="mt-1 line-clamp-2 text-sm text-slate-600">

                                                                    {
                                                                        item.description
                                                                    }

                                                                </p>

                                                            </div>
                                                        )}

                                                        {/* DATE */}

                                                        <div className="mt-4 flex items-center justify-between text-xs">

                                                            <span className="flex items-center gap-2 text-slate-400">

                                                                <CalendarDays
                                                                    size={
                                                                        14
                                                                    }
                                                                />

                                                                Expense Date

                                                            </span>

                                                            <span className="font-medium text-slate-600">

                                                                {formatDate(
                                                                    item.expense_date
                                                                )}

                                                            </span>

                                                        </div>

                                                    </div>

                                                </motion.div>
                                            );
                                        }
                                    )}

                                </AnimatePresence>

                            </div>
                        )}

                </main>

            </div>

            {/* =====================================================
                ADD / EDIT MODAL
            ===================================================== */}

            <AnimatePresence>

                {showModal && (
                    <motion.div
                        initial={{
                            opacity: 0,
                        }}
                        animate={{
                            opacity: 1,
                        }}
                        exit={{
                            opacity: 0,
                        }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
                        onClick={closeModal}
                    >

                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 30,
                                scale: 0.96,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                scale: 1,
                            }}
                            exit={{
                                opacity: 0,
                                y: 20,
                                scale: 0.96,
                            }}
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"
                        >

                            {/* HEADER */}

                            <div className="flex items-start justify-between">

                                <div>

                                    <div className="flex items-center gap-2 text-red-600">

                                        <TrendingDown
                                            size={19}
                                        />

                                        <span className="text-sm font-semibold">
                                            Expense Management
                                        </span>

                                    </div>

                                    <h2 className="mt-1 text-xl font-bold text-slate-900">

                                        {editingExpense
                                            ? "Edit Expense"
                                            : "Add New Expense"}

                                    </h2>

                                </div>

                                <button
                                    onClick={closeModal}
                                    className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                                >

                                    <X size={20} />

                                </button>

                            </div>

                            {/* FORM */}

                            <form
                                onSubmit={handleSubmit}
                                className="mt-6 space-y-4"
                            >

                                {/* CROP */}

                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Crop
                                    </label>

                                    <select
                                        name="crop_id"
                                        value={
                                            formData.crop_id
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                    >

                                        <option value="">
                                            Select a crop
                                        </option>

                                        {crops.map(
                                            (crop) => (
                                                <option
                                                    key={
                                                        crop.id
                                                    }
                                                    value={
                                                        crop.id
                                                    }
                                                >

                                                    {crop.crop_name ||
                                                        `Crop #${crop.id} `}

                                                </option>
                                            )
                                        )}

                                    </select>

                                </div>

                                {/* CATEGORY */}

                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Expense Category
                                    </label>

                                    <select
                                        name="category"
                                        value={
                                            formData.category
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                    >

                                        <option value="">
                                            Select category
                                        </option>

                                        <option value="Seeds">
                                            Seeds
                                        </option>

                                        <option value="Fertilizer">
                                            Fertilizer
                                        </option>

                                        <option value="Pesticide">
                                            Pesticide
                                        </option>

                                        <option value="Labor">
                                            Labor
                                        </option>

                                        <option value="Irrigation">
                                            Irrigation
                                        </option>

                                        <option value="Machinery">
                                            Machinery
                                        </option>

                                        <option value="Transportation">
                                            Transportation
                                        </option>

                                        <option value="Fuel">
                                            Fuel
                                        </option>

                                        <option value="Other">
                                            Other
                                        </option>

                                    </select>

                                </div>

                                {/* AMOUNT */}

                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Amount
                                    </label>

                                    <div className="relative">

                                        <IndianRupee
                                            size={17}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                        />

                                        <input
                                            type="number"
                                            name="amount"
                                            value={
                                                formData.amount
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="e.g. 2500"
                                            min="0"
                                            step="0.01"
                                            required
                                            className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                        />

                                    </div>

                                </div>

                                {/* EXPENSE DATE */}

                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Expense Date
                                    </label>

                                    <input
                                        type="date"
                                        name="expense_date"
                                        value={
                                            formData.expense_date
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                    />

                                </div>

                                {/* DESCRIPTION */}

                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Description
                                    </label>

                                    <textarea
                                        name="description"
                                        value={
                                            formData.description
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter expense details..."
                                        rows="3"
                                        className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                    />

                                </div>

                                {/* PREVIEW */}

                                {formData.amount && (
                                    <div className="rounded-xl bg-red-50 p-4">

                                        <div className="flex items-center justify-between">

                                            <span className="text-sm font-medium text-red-700">
                                                Expense Amount
                                            </span>

                                            <span className="text-lg font-bold text-red-800">

                                                {formatCurrency(
                                                    formData.amount
                                                )}

                                            </span>

                                        </div>

                                    </div>
                                )}

                                {/* BUTTONS */}

                                <div className="flex gap-3 pt-3">

                                    <button
                                        type="button"
                                        onClick={
                                            closeModal
                                        }
                                        disabled={saving}
                                        className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-700 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-green-700/20 transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
                                    >

                                        {saving && (
                                            <RefreshCw
                                                size={16}
                                                className="animate-spin"
                                            />
                                        )}

                                        {editingExpense
                                            ? "Update Expense"
                                            : "Add Expense"}

                                    </button>

                                </div>

                            </form>

                        </motion.div>

                    </motion.div>
                )}

            </AnimatePresence>

            {/* =====================================================
                DELETE CONFIRMATION
            ===================================================== */}

            <AnimatePresence>

                {showDeleteModal &&
                    deletingExpense && (
                        <motion.div
                            initial={{
                                opacity: 0,
                            }}
                            animate={{
                                opacity: 1,
                            }}
                            exit={{
                                opacity: 0,
                            }}
                            className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
                            onClick={
                                closeDeleteModal
                            }
                        >

                            <motion.div
                                initial={{
                                    opacity: 0,
                                    scale: 0.95,
                                    y: 20,
                                }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    y: 0,
                                }}
                                exit={{
                                    opacity: 0,
                                    scale: 0.95,
                                }}
                                onClick={(e) =>
                                    e.stopPropagation()
                                }
                                className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
                            >

                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">

                                    <Trash2 size={22} />

                                </div>

                                <h2 className="mt-5 text-xl font-bold text-slate-900">
                                    Delete Expense?
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-slate-500">

                                    Are you sure you want to
                                    delete this expense record?

                                    {deletingExpense.category && (
                                        <>
                                            {" "}
                                            for{" "}
                                            <span className="font-semibold text-slate-700">
                                                {
                                                    deletingExpense.category
                                                }
                                            </span>
                                        </>
                                    )}

                                    ? This action cannot be
                                    undone.

                                </p>

                                <div className="mt-6 flex gap-3">

                                    <button
                                        onClick={
                                            closeDeleteModal
                                        }
                                        disabled={saving}
                                        className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        onClick={
                                            handleDelete
                                        }
                                        disabled={saving}
                                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
                                    >

                                        {saving && (
                                            <RefreshCw
                                                size={16}
                                                className="animate-spin"
                                            />
                                        )}

                                        Delete Expense

                                    </button>

                                </div>

                            </motion.div>

                        </motion.div>
                    )}

            </AnimatePresence>

        </div>
    );
}

export default Expense;
