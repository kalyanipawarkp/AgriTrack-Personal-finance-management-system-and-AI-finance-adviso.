
import { motion, AnimatePresence } from "framer-motion";
import {
    Sprout,
    Plus,
    Search,
    RefreshCw,
    MapPin,
    CalendarDays,
    Ruler,
    Pencil,
    Trash2,
    X,
    Leaf,
    Wheat,
    AlertTriangle,
} from "lucide-react";
import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import DashboardNavbar from "../components/DashboardNavbar";
import api from "../services/api";

function Crops() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [crops, setCrops] = useState([]);
    const [farms, setFarms] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [search, setSearch] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [editingCrop, setEditingCrop] = useState(null);
    const [deletingCrop, setDeletingCrop] = useState(null);

    const [formData, setFormData] = useState({
        farm_id: "",
        crop_name: "",
        area: "",
        sowing_date: "",
        harvest_date: "",
        status: "Planned",
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
    // FETCH CROPS
    // =========================================================

    const fetchCrops = async () => {
        try {
            setLoading(true);

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

            alert(
                error.response?.data?.message ||
                "Unable to fetch crops."
            );
        } finally {
            setLoading(false);
        }
    };

    // =========================================================
    // FETCH FARMS
    // =========================================================

    const fetchFarms = async () => {
        try {
            const response = await api.get(
                "/farm",
                getConfig()
            );

            setFarms(response.data?.farms || []);
        } catch (error) {
            console.error(
                "Fetch farms error:",
                error.response?.data || error
            );
        }
    };

    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {
        fetchCrops();
        fetchFarms();
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
        setEditingCrop(null);

        setFormData({
            farm_id: farms.length > 0 ? farms[0].id : "",
            crop_name: "",
            area: "",
            sowing_date: "",
            harvest_date: "",
            status: "Planned",
        });

        setShowModal(true);
    };

    // =========================================================
    // OPEN EDIT MODAL
    // =========================================================

    const openEditModal = (crop) => {
        setEditingCrop(crop);

        setFormData({
            farm_id: crop.farm_id || "",
            crop_name: crop.crop_name || "",
            area: crop.area || "",
            sowing_date: crop.sowing_date
                ? crop.sowing_date.substring(0, 10)
                : "",
            harvest_date: crop.harvest_date
                ? crop.harvest_date.substring(0, 10)
                : "",
            status: crop.status || "Planned",
        });

        setShowModal(true);
    };

    // =========================================================
    // CLOSE MODAL
    // =========================================================

    const closeModal = () => {
        if (saving) return;

        setShowModal(false);
        setEditingCrop(null);

        setFormData({
            farm_id: "",
            crop_name: "",
            area: "",
            sowing_date: "",
            harvest_date: "",
            status: "Planned",
        });
    };

    // =========================================================
    // CREATE / UPDATE CROP
    // =========================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!editingCrop && !formData.farm_id) {
            alert("Please select a farm.");
            return;
        }

        if (!formData.crop_name.trim()) {
            alert("Crop name is required.");
            return;
        }

        if (!formData.area) {
            alert("Crop area is required.");
            return;
        }

        try {
            setSaving(true);

            if (editingCrop) {
                await api.put(
                    `/crop/${editingCrop.id} `,
                    {
                        crop_name: formData.crop_name,
                        area: formData.area,
                        sowing_date:
                            formData.sowing_date || null,
                        harvest_date:
                            formData.harvest_date || null,
                        status: formData.status,
                    },
                    getConfig()
                );
            } else {
                await api.post(
                    "/crop",
                    {
                        farm_id: formData.farm_id,
                        crop_name: formData.crop_name,
                        area: formData.area,
                        sowing_date:
                            formData.sowing_date || null,
                        harvest_date:
                            formData.harvest_date || null,
                        status: formData.status,
                    },
                    getConfig()
                );
            }

            closeModal();

            await fetchCrops();

        } catch (error) {
            console.error("FULL CREATE CROP ERROR:", error);
            console.error("STATUS:", error.response?.status);
            console.error("DATA:", error.response?.data);

            alert(
                error.response?.data?.message ||
                "Unable to create crop."
            );
        } finally {
            setSaving(false);
        }
    };

    // =========================================================
    // DELETE
    // =========================================================

    const openDeleteModal = (crop) => {
        setDeletingCrop(crop);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setDeletingCrop(null);
    };

    const handleDelete = async () => {
        if (!deletingCrop) return;

        try {
            setSaving(true);

            await api.delete(
                `/crop/${deletingCrop.id} `,
                getConfig()
            );

            closeDeleteModal();

            await fetchCrops();

        } catch (error) {
            console.error(
                "Delete crop error:",
                error.response?.data || error
            );

            alert(
                error.response?.data?.message ||
                "Unable to delete crop."
            );
        } finally {
            setSaving(false);
        }
    };

    // =========================================================
    // SEARCH
    // =========================================================

    const filteredCrops = crops.filter((crop) => {
        const value = search.toLowerCase();

        return (
            crop.crop_name
                ?.toLowerCase()
                .includes(value) ||
            crop.farm_name
                ?.toLowerCase()
                .includes(value) ||
            crop.status
                ?.toLowerCase()
                .includes(value)
        );
    });

    // =========================================================
    // STATUS STYLE
    // =========================================================

    const getStatusStyle = (status) => {
        switch (status) {
            case "Growing":
                return "bg-blue-50 text-blue-700 border-blue-100";

            case "Harvested":
                return "bg-amber-50 text-amber-700 border-amber-100";

            case "Planned":
            default:
                return "bg-green-50 text-green-700 border-green-100";
        }
    };

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <div className="min-h-screen bg-slate-50">

            {/* SIDEBAR */}

            <Sidebar
                open={sidebarOpen}
                setOpen={setSidebarOpen}
            />

            {/* MAIN */}

            <div className="lg:pl-72">

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
                                    <Leaf size={16} />
                                    Crop Management
                                </div>

                                <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                                    My Crops
                                </h1>

                                <p className="mt-2 text-sm text-slate-500">
                                    Track crops, growing periods, areas and harvest status.
                                </p>

                            </div>

                            <div className="flex gap-2">

                                <button
                                    onClick={fetchCrops}
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
                                    disabled={farms.length === 0}
                                    className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-green-700/20 transition-all hover:-translate-y-0.5 hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
                                >

                                    <Plus size={17} />

                                    Add Crop

                                </button>

                            </div>

                        </div>

                    </motion.div>

                    {/* =================================================
              NO FARMS WARNING
          ================================================= */}

                    {!loading && farms.length === 0 && (

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

                                <AlertTriangle size={20} />

                            </div>

                            <div>

                                <h3 className="font-semibold text-amber-900">
                                    Add a farm first
                                </h3>

                                <p className="mt-1 text-sm text-amber-700">
                                    A crop must belong to a farm. Add a farm before creating your first crop.
                                </p>

                            </div>

                        </motion.div>

                    )}

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
                                placeholder="Search by crop, farm or status..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
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
                        filteredCrops.length === 0 && (

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

                                    <Wheat size={30} />

                                </div>

                                <h2 className="mt-5 text-lg font-bold text-slate-900">

                                    {search
                                        ? "No matching crops"
                                        : "No crops found"}

                                </h2>

                                <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">

                                    {search
                                        ? "Try a different search term."
                                        : "Add your first crop to start tracking your cultivation."}

                                </p>

                                {!search &&
                                    farms.length > 0 && (

                                        <button
                                            onClick={openAddModal}
                                            className="mt-6 rounded-xl bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800"
                                        >
                                            Add Your First Crop
                                        </button>

                                    )}

                            </motion.div>

                        )}

                    {/* =================================================
              CROP CARDS
          ================================================= */}

                    {!loading &&
                        filteredCrops.length > 0 && (

                            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

                                <AnimatePresence>

                                    {filteredCrops.map(
                                        (crop, index) => (

                                            <motion.div
                                                key={crop.id}
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
                                                    delay: index * 0.05,
                                                }}
                                                className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                                            >

                                                {/* CARD TOP */}

                                                <div className="relative h-32 overflow-hidden bg-gradient-to-br from-green-700 via-emerald-600 to-lime-500">

                                                    <div className="absolute -right-8 -top-12 h-36 w-36 rounded-full bg-white/10" />

                                                    <div className="absolute -bottom-16 -left-8 h-36 w-36 rounded-full bg-lime-300/10" />

                                                    <div className="relative flex h-full items-center justify-between p-6">

                                                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur">

                                                            <Sprout size={28} />

                                                        </div>

                                                        <span
                                                            className={`rounded - full border px - 3 py - 1.5 text - xs font - semibold ${getStatusStyle(
                                                                crop.status
                                                            )
                                                                } `}
                                                        >

                                                            {crop.status || "Planned"}

                                                        </span>

                                                    </div>

                                                </div>

                                                {/* BODY */}

                                                <div className="p-5">

                                                    <div className="flex items-start justify-between gap-3">

                                                        <div className="min-w-0">

                                                            <h2 className="truncate text-lg font-bold text-slate-900">

                                                                {crop.crop_name}

                                                            </h2>

                                                            <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">

                                                                <MapPin
                                                                    size={13}
                                                                    className="text-green-600"
                                                                />

                                                                <span className="truncate">

                                                                    {crop.farm_name ||
                                                                        `Farm #${crop.farm_id} `}

                                                                </span>

                                                            </div>

                                                        </div>

                                                        <div className="flex shrink-0 gap-1">

                                                            <button
                                                                onClick={() =>
                                                                    openEditModal(crop)
                                                                }
                                                                className="rounded-lg p-2 text-slate-400 transition hover:bg-green-50 hover:text-green-700"
                                                                title="Edit crop"
                                                            >

                                                                <Pencil size={16} />

                                                            </button>

                                                            <button
                                                                onClick={() =>
                                                                    openDeleteModal(crop)
                                                                }
                                                                className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                                                                title="Delete crop"
                                                            >

                                                                <Trash2 size={16} />

                                                            </button>

                                                        </div>

                                                    </div>

                                                    {/* AREA */}

                                                    <div className="mt-5 grid grid-cols-2 gap-3">

                                                        <div className="rounded-xl bg-slate-50 p-3">

                                                            <div className="flex items-center gap-2 text-xs text-slate-400">

                                                                <Ruler size={14} />

                                                                Area

                                                            </div>

                                                            <p className="mt-1 text-sm font-bold text-slate-700">

                                                                {crop.area}

                                                            </p>

                                                        </div>

                                                        <div className="rounded-xl bg-slate-50 p-3">

                                                            <div className="flex items-center gap-2 text-xs text-slate-400">

                                                                <Leaf size={14} />

                                                                Crop ID

                                                            </div>

                                                            <p className="mt-1 text-sm font-bold text-slate-700">

                                                                #{crop.id}

                                                            </p>

                                                        </div>

                                                    </div>

                                                    {/* DATES */}

                                                    <div className="mt-3 space-y-2">

                                                        <div className="flex items-center justify-between text-xs">

                                                            <span className="flex items-center gap-2 text-slate-400">

                                                                <CalendarDays size={14} />

                                                                Sowing

                                                            </span>

                                                            <span className="font-medium text-slate-600">

                                                                {crop.sowing_date
                                                                    ? new Date(
                                                                        crop.sowing_date
                                                                    ).toLocaleDateString(
                                                                        "en-IN"
                                                                    )
                                                                    : "Not set"}

                                                            </span>

                                                        </div>

                                                        <div className="flex items-center justify-between text-xs">

                                                            <span className="flex items-center gap-2 text-slate-400">

                                                                <CalendarDays size={14} />

                                                                Harvest

                                                            </span>

                                                            <span className="font-medium text-slate-600">

                                                                {crop.harvest_date
                                                                    ? new Date(
                                                                        crop.harvest_date
                                                                    ).toLocaleDateString(
                                                                        "en-IN"
                                                                    )
                                                                    : "Not set"}

                                                            </span>

                                                        </div>

                                                    </div>

                                                </div>

                                            </motion.div>

                                        )
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

                                        <Sprout size={19} />

                                        <span className="text-sm font-semibold">
                                            Crop Management
                                        </span>

                                    </div>

                                    <h2 className="mt-1 text-xl font-bold text-slate-900">

                                        {editingCrop
                                            ? "Edit Crop"
                                            : "Add New Crop"}

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

                                {/* FARM */}

                                {!editingCrop && (

                                    <div>

                                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                                            Farm
                                        </label>

                                        <select
                                            name="farm_id"
                                            value={formData.farm_id}
                                            onChange={handleChange}
                                            required
                                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                        >

                                            <option value="">
                                                Select a farm
                                            </option>

                                            {farms.map((farm) => (

                                                <option
                                                    key={farm.id}
                                                    value={farm.id}
                                                >

                                                    {farm.farm_name}

                                                </option>

                                            ))}

                                        </select>

                                    </div>

                                )}

                                {/* CROP NAME */}

                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Crop Name
                                    </label>

                                    <input
                                        type="text"
                                        name="crop_name"
                                        value={formData.crop_name}
                                        onChange={handleChange}
                                        placeholder="e.g. Cotton"
                                        required
                                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                    />

                                </div>

                                {/* AREA */}

                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Crop Area
                                    </label>

                                    <div className="relative">

                                        <Ruler
                                            size={17}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                        />

                                        <input
                                            type="number"
                                            name="area"
                                            value={formData.area}
                                            onChange={handleChange}
                                            placeholder="e.g. 5"
                                            min="0"
                                            step="0.01"
                                            required
                                            className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                        />

                                    </div>

                                </div>

                                {/* DATES */}

                                <div className="grid gap-4 sm:grid-cols-2">

                                    <div>

                                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                                            Sowing Date
                                        </label>

                                        <input
                                            type="date"
                                            name="sowing_date"
                                            value={formData.sowing_date}
                                            onChange={handleChange}
                                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                        />

                                    </div>

                                    <div>

                                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                                            Harvest Date
                                        </label>

                                        <input
                                            type="date"
                                            name="harvest_date"
                                            value={formData.harvest_date}
                                            onChange={handleChange}
                                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                        />

                                    </div>

                                </div>

                                {/* STATUS */}

                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Status
                                    </label>

                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                    >

                                        <option value="Planned">
                                            Planned
                                        </option>

                                        <option value="Growing">
                                            Growing
                                        </option>

                                        <option value="Harvested">
                                            Harvested
                                        </option>

                                    </select>

                                </div>

                                {/* BUTTONS */}

                                <div className="flex gap-3 pt-3">

                                    <button
                                        type="button"
                                        onClick={closeModal}
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

                                        {editingCrop
                                            ? "Update Crop"
                                            : "Add Crop"}

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

                {showDeleteModal && deletingCrop && (

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
                        onClick={closeDeleteModal}
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
                                Delete Crop?
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-slate-500">

                                Are you sure you want to delete{" "}

                                <span className="font-semibold text-slate-700">

                                    {deletingCrop.crop_name}

                                </span>

                                ? This action cannot be undone.

                            </p>

                            <div className="mt-6 flex gap-3">

                                <button
                                    onClick={closeDeleteModal}
                                    disabled={saving}
                                    className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={handleDelete}
                                    disabled={saving}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
                                >

                                    {saving && (
                                        <RefreshCw
                                            size={16}
                                            className="animate-spin"
                                        />
                                    )}

                                    Delete Crop

                                </button>

                            </div>

                        </motion.div>

                    </motion.div>

                )}

            </AnimatePresence>

        </div>
    );
}

export default Crops;

