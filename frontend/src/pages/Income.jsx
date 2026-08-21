

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
    TrendingUp,
    Wheat,
    Wallet,
    CircleDollarSign,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import Sidebar from "../components/Sidebar";
import DashboardNavbar from "../components/DashboardNavbar";
import api from "../services/api";

function Income() {
    // =========================================================
    // STATE
    // =========================================================

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [income, setIncome] = useState([]);
    const [crops, setCrops] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [search, setSearch] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [editingIncome, setEditingIncome] = useState(null);
    const [deletingIncome, setDeletingIncome] = useState(null);

    const [formData, setFormData] = useState({
        crop_id: "",
        quantity: "",
        unit: "",
        selling_price: "",
        sale_date: "",
    });

    // =========================================================
    // AUTH CONFIG
    // =========================================================

    const getConfig = () => {
        const token = localStorage.getItem("token");

        return {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    };

    // =========================================================
    // FETCH INCOME
    // =========================================================

    const fetchIncome = async () => {
        try {
            setLoading(true);

            const response = await api.get(
                "/income",
                getConfig()
            );

            setIncome(response.data?.income || []);
        } catch (error) {
            console.error(
                "Fetch income error:",
                error.response?.data || error
            );

            alert(
                error.response?.data?.message ||
                "Unable to fetch income."
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
        fetchIncome();
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
        setEditingIncome(null);

        setFormData({
            crop_id: crops.length > 0 ? crops[0].id : "",
            quantity: "",
            unit: "",
            selling_price: "",
            sale_date: "",
        });

        setShowModal(true);
    };

    // =========================================================
    // OPEN EDIT MODAL
    // =========================================================

    const openEditModal = (item) => {
        setEditingIncome(item);

        setFormData({
            crop_id: item.crop_id || "",
            quantity: item.quantity || "",
            unit: item.unit || "",
            selling_price: item.selling_price || "",
            sale_date: item.sale_date
                ? item.sale_date.substring(0, 10)
                : "",
        });

        setShowModal(true);
    };

    // =========================================================
    // CLOSE MODAL
    // =========================================================

    const closeModal = () => {
        if (saving) return;

        setShowModal(false);
        setEditingIncome(null);

        setFormData({
            crop_id: "",
            quantity: "",
            unit: "",
            selling_price: "",
            sale_date: "",
        });
    };

    // =========================================================
    // CREATE / UPDATE INCOME
    // =========================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.crop_id) {
            alert("Please select a crop.");
            return;
        }

        if (!formData.quantity) {
            alert("Quantity is required.");
            return;
        }

        if (!formData.unit.trim()) {
            alert("Unit is required.");
            return;
        }

        if (!formData.selling_price) {
            alert("Selling price is required.");
            return;
        }

        if (!formData.sale_date) {
            alert("Sale date is required.");
            return;
        }

        try {
            setSaving(true);

            const data = {
                crop_id: Number(formData.crop_id),
                quantity: Number(formData.quantity),
                unit: formData.unit,
                selling_price: Number(formData.selling_price),
                sale_date: formData.sale_date,
            };

            if (editingIncome) {
                await api.put(
                    `/income/${editingIncome.id}`,
                    data,
                    getConfig()
                );
            } else {
                await api.post(
                    "/income",
                    data,
                    getConfig()
                );
            }

            closeModal();

            await fetchIncome();
        } catch (error) {
            console.error("FULL INCOME ERROR:", error);
            console.error("STATUS:", error.response?.status);
            console.error("RESPONSE DATA:", error.response?.data);
            console.error("MESSAGE:", error.response?.data?.message);

            alert(
                error.response?.data?.message ||
                "Failed to save income"
            );
        } finally {
            setSaving(false);
        }
    };

    // =========================================================
    // DELETE
    // =========================================================

    const openDeleteModal = (item) => {
        setDeletingIncome(item);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        if (saving) return;

        setShowDeleteModal(false);
        setDeletingIncome(null);
    };

    const handleDelete = async () => {
        if (!deletingIncome) return;

        try {
            setSaving(true);

            await api.delete(
                `/income/${deletingIncome.id}`,
                getConfig()
            );

            closeDeleteModal();

            await fetchIncome();
        } catch (error) {
            console.error(
                "Delete income error:",
                error.response?.data || error
            );

            alert(
                error.response?.data?.message ||
                "Unable to delete income."
            );
        } finally {
            setSaving(false);
        }
    };

    // =========================================================
    // SEARCH
    // =========================================================

    const filteredIncome = income.filter((item) => {
        const value = search.toLowerCase();

        return (
            item.crop_name
                ?.toLowerCase()
                .includes(value) ||
            item.unit
                ?.toLowerCase()
                .includes(value) ||
            String(item.quantity || "")
                .toLowerCase()
                .includes(value) ||
            String(item.selling_price || "")
                .toLowerCase()
                .includes(value) ||
            String(item.total_amount || "")
                .toLowerCase()
                .includes(value)
        );
    });

    // =========================================================
    // TOTAL INCOME
    // =========================================================

    const totalIncome = useMemo(() => {
        return income.reduce((total, item) => {
            const amount =
                Number(item.total_amount) ||
                Number(item.quantity || 0) *
                Number(item.selling_price || 0);

            return total + amount;
        }, 0);
    }, [income]);

    // =========================================================
    // TOTAL SALES
    // =========================================================

    const totalSales = income.length;

    // =========================================================
    // TOTAL QUANTITY
    // =========================================================

    const totalQuantity = useMemo(() => {
        return income.reduce(
            (total, item) =>
                total + Number(item.quantity || 0),
            0
        );
    }, [income]);

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

                                <div className="flex items-center gap-2 text-sm font-semibold text-green-700">
                                    <TrendingUp size={16} />

                                    Income Management
                                </div>

                                <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                                    My Income
                                </h1>

                                <p className="mt-2 text-sm text-slate-500">
                                    Track crop sales, quantities,
                                    selling prices and total income.
                                </p>

                            </div>

                            <div className="flex gap-2">

                                <button
                                    onClick={fetchIncome}
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

                                    Add Income
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
                                    Income must be linked to a
                                    crop. Add a crop before
                                    recording your first sale.
                                </p>
                            </div>

                        </motion.div>
                    )}

                    {/* =================================================
                        SUMMARY CARDS
                    ================================================= */}

                    <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

                        {/* TOTAL INCOME */}

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
                                        Total Income
                                    </p>

                                    <p className="mt-2 text-2xl font-bold text-slate-900">
                                        {formatCurrency(
                                            totalIncome
                                        )}
                                    </p>
                                </div>

                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                                    <IndianRupee size={23} />
                                </div>

                            </div>

                            <div className="mt-4 flex items-center gap-2 text-xs text-green-700">
                                <TrendingUp size={14} />

                                Total recorded sales income
                            </div>

                        </motion.div>

                        {/* TOTAL SALES */}

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
                                        Total Sales
                                    </p>

                                    <p className="mt-2 text-2xl font-bold text-slate-900">
                                        {totalSales}
                                    </p>
                                </div>

                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                                    <CircleDollarSign
                                        size={23}
                                    />
                                </div>

                            </div>

                            <div className="mt-4 text-xs text-slate-500">
                                Recorded income transactions
                            </div>

                        </motion.div>

                        {/* TOTAL QUANTITY */}

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
                                        Total Quantity
                                    </p>

                                    <p className="mt-2 text-2xl font-bold text-slate-900">
                                        {totalQuantity}
                                    </p>
                                </div>

                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                                    <Wheat size={23} />
                                </div>

                            </div>

                            <div className="mt-4 text-xs text-slate-500">
                                Across all recorded sales
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
                                placeholder="Search by crop, quantity, unit or price..."
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
                        filteredIncome.length === 0 && (
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

                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                                    <Wallet size={30} />
                                </div>

                                <h2 className="mt-5 text-lg font-bold text-slate-900">
                                    {search
                                        ? "No matching income"
                                        : "No income found"}
                                </h2>

                                <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                                    {search
                                        ? "Try a different search term."
                                        : "Record your first crop sale to start tracking your income."}
                                </p>

                                {!search &&
                                    crops.length > 0 && (
                                        <button
                                            onClick={
                                                openAddModal
                                            }
                                            className="mt-6 rounded-xl bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800"
                                        >
                                            Add Your First Income
                                        </button>
                                    )}

                            </motion.div>
                        )}

                    {/* =================================================
                        INCOME CARDS
                    ================================================= */}

                    {!loading &&
                        filteredIncome.length > 0 && (
                            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

                                <AnimatePresence>

                                    {filteredIncome.map(
                                        (item, index) => {

                                            const totalAmount =
                                                Number(
                                                    item.total_amount
                                                ) ||
                                                Number(
                                                    item.quantity ||
                                                    0
                                                ) *
                                                Number(
                                                    item.selling_price ||
                                                    0
                                                );

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

                                                    <div className="relative h-32 overflow-hidden bg-gradient-to-br from-green-700 via-emerald-600 to-lime-500">

                                                        <div className="absolute -right-8 -top-12 h-36 w-36 rounded-full bg-white/10" />

                                                        <div className="absolute -bottom-16 -left-8 h-36 w-36 rounded-full bg-lime-300/10" />

                                                        <div className="relative flex h-full items-center justify-between p-6">

                                                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur">

                                                                <IndianRupee
                                                                    size={28}
                                                                />

                                                            </div>

                                                            <span className="rounded-full border border-white/30 bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                                                                Income
                                                            </span>

                                                        </div>

                                                    </div>

                                                    {/* CARD BODY */}

                                                    <div className="p-5">

                                                        <div className="flex items-start justify-between gap-3">

                                                            <div className="min-w-0">

                                                                <h2 className="truncate text-lg font-bold text-slate-900">
                                                                    {item.crop_name ||
                                                                        `Crop #${item.crop_id}`}
                                                                </h2>

                                                                <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">

                                                                    <Wheat
                                                                        size={
                                                                            13
                                                                        }
                                                                        className="text-green-600"
                                                                    />

                                                                    <span className="truncate">
                                                                        Crop
                                                                        Sale
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
                                                                    title="Edit income"
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
                                                                    title="Delete income"
                                                                >
                                                                    <Trash2
                                                                        size={
                                                                            16
                                                                        }
                                                                    />
                                                                </button>

                                                            </div>

                                                        </div>

                                                        {/* TOTAL AMOUNT */}

                                                        <div className="mt-5 rounded-xl bg-green-50 p-4">

                                                            <div className="flex items-center gap-2 text-xs text-green-600">
                                                                <IndianRupee
                                                                    size={
                                                                        14
                                                                    }
                                                                />

                                                                Total Income
                                                            </div>

                                                            <p className="mt-1 text-xl font-bold text-green-800">
                                                                {formatCurrency(
                                                                    totalAmount
                                                                )}
                                                            </p>

                                                        </div>

                                                        {/* DETAILS */}

                                                        <div className="mt-3 grid grid-cols-2 gap-3">

                                                            <div className="rounded-xl bg-slate-50 p-3">

                                                                <div className="text-xs text-slate-400">
                                                                    Quantity
                                                                </div>

                                                                <p className="mt-1 text-sm font-bold text-slate-700">
                                                                    {
                                                                        item.quantity
                                                                    }{" "}
                                                                    {
                                                                        item.unit
                                                                    }
                                                                </p>

                                                            </div>

                                                            <div className="rounded-xl bg-slate-50 p-3">

                                                                <div className="text-xs text-slate-400">
                                                                    Price
                                                                </div>

                                                                <p className="mt-1 text-sm font-bold text-slate-700">
                                                                    {formatCurrency(
                                                                        item.selling_price
                                                                    )}
                                                                </p>

                                                            </div>

                                                        </div>

                                                        {/* DATE */}

                                                        <div className="mt-4 flex items-center justify-between text-xs">

                                                            <span className="flex items-center gap-2 text-slate-400">

                                                                <CalendarDays
                                                                    size={
                                                                        14
                                                                    }
                                                                />

                                                                Sale Date

                                                            </span>

                                                            <span className="font-medium text-slate-600">
                                                                {formatDate(
                                                                    item.sale_date
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

                                    <div className="flex items-center gap-2 text-green-700">

                                        <TrendingUp
                                            size={19}
                                        />

                                        <span className="text-sm font-semibold">
                                            Income Management
                                        </span>

                                    </div>

                                    <h2 className="mt-1 text-xl font-bold text-slate-900">
                                        {editingIncome
                                            ? "Edit Income"
                                            : "Add New Income"}
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
                                                        `Crop #${crop.id}`}
                                                </option>
                                            )
                                        )}

                                    </select>

                                </div>

                                {/* QUANTITY */}

                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Quantity
                                    </label>

                                    <input
                                        type="number"
                                        name="quantity"
                                        value={
                                            formData.quantity
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="e.g. 100"
                                        min="0"
                                        step="0.01"
                                        required
                                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                    />

                                </div>

                                {/* UNIT */}

                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Unit
                                    </label>

                                    <select
                                        name="unit"
                                        value={
                                            formData.unit
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                    >

                                        <option value="">
                                            Select unit
                                        </option>

                                        <option value="kg">
                                            Kilogram (kg)
                                        </option>

                                        <option value="quintal">
                                            Quintal
                                        </option>

                                        <option value="ton">
                                            Ton
                                        </option>

                                        <option value="bag">
                                            Bag
                                        </option>

                                        <option value="piece">
                                            Piece
                                        </option>

                                    </select>

                                </div>

                                {/* SELLING PRICE */}

                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Selling Price
                                    </label>

                                    <div className="relative">

                                        <IndianRupee
                                            size={17}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                        />

                                        <input
                                            type="number"
                                            name="selling_price"
                                            value={
                                                formData.selling_price
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

                                    <p className="mt-1 text-xs text-slate-400">
                                        Price per selected
                                        unit
                                    </p>

                                </div>

                                {/* SALE DATE */}

                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Sale Date
                                    </label>

                                    <input
                                        type="date"
                                        name="sale_date"
                                        value={
                                            formData.sale_date
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                    />

                                </div>

                                {/* PREVIEW */}

                                {formData.quantity &&
                                    formData.selling_price && (
                                        <div className="rounded-xl bg-green-50 p-4">

                                            <div className="flex items-center justify-between">

                                                <span className="text-sm font-medium text-green-700">
                                                    Estimated
                                                    Total
                                                </span>

                                                <span className="text-lg font-bold text-green-800">

                                                    {formatCurrency(
                                                        Number(
                                                            formData.quantity
                                                        ) *
                                                        Number(
                                                            formData.selling_price
                                                        )
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

                                        {editingIncome
                                            ? "Update Income"
                                            : "Add Income"}

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
                    deletingIncome && (
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
                                    Delete Income?
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-slate-500">

                                    Are you sure you want to
                                    delete this income record?

                                    {deletingIncome.crop_name && (
                                        <>
                                            {" "}
                                            for{" "}
                                            <span className="font-semibold text-slate-700">
                                                {
                                                    deletingIncome.crop_name
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

                                        Delete Income

                                    </button>

                                </div>

                            </motion.div>

                        </motion.div>
                    )}

            </AnimatePresence>

        </div>
    );
}

export default Income;