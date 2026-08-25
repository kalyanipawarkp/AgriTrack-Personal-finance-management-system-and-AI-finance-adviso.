
import { motion, AnimatePresence } from "framer-motion";
import {
    MapPin,
    Plus,
    RefreshCw,
    Sprout,
    X,
    Ruler,
    Search,
} from "lucide-react";
import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import DashboardNavbar from "../components/DashboardNavbar";
import api from "../services/api";

function Farms() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [farms, setFarms] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);

    const [search, setSearch] = useState("");

    const [formData, setFormData] = useState({
        farm_name: "",
        location: "",
        land_area: "",
    });

    // --------------------------------------------------
    // FETCH FARMS
    // --------------------------------------------------

    const fetchFarms = async () => {
        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            const response = await api.get("/farm", {
                headers: {
                    Authorization: `Bearer ${token} `,
                },
            });

            setFarms(response.data?.farms || []);
        } catch (error) {
            console.error(
                "Fetch farms error:",
                error.response?.data || error
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFarms();
    }, []);

    // --------------------------------------------------
    // INPUT CHANGE
    // --------------------------------------------------

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // --------------------------------------------------
    // OPEN ADD MODAL
    // --------------------------------------------------

    const openAddModal = () => {
        setFormData({
            farm_name: "",
            location: "",
            land_area: "",
        });

        setShowModal(true);
    };

    // --------------------------------------------------
    // CREATE FARM
    // --------------------------------------------------

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");

            await api.post(
                "/farm",
                {
                    farm_name: formData.farm_name,
                    location: formData.location,
                    land_area: formData.land_area,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token} `,
                    },
                }
            );

            setShowModal(false);

            setFormData({
                farm_name: "",
                location: "",
                land_area: "",
            });

            await fetchFarms();

        } catch (error) {
            console.error(
                "Create farm error:",
                error.response?.data || error
            );

            alert(
                error.response?.data?.message ||
                "Unable to create farm."
            );
        }
    };

    // --------------------------------------------------
    // SEARCH
    // --------------------------------------------------

    const filteredFarms = farms.filter((farm) => {
        const searchValue = search.toLowerCase();

        return (
            farm.farm_name
                ?.toLowerCase()
                .includes(searchValue) ||
            farm.location
                ?.toLowerCase()
                .includes(searchValue)
        );
    });

    // --------------------------------------------------
    // RENDER
    // --------------------------------------------------

    return (
        <div className="min-h-screen font-serif bg-slate-50">

            {/* SIDEBAR */}

            <Sidebar
                open={sidebarOpen}
                setOpen={setSidebarOpen}
            />

            {/* MAIN CONTENT */}

            <div className="lg:pl-72">

                <DashboardNavbar
                    setSidebarOpen={setSidebarOpen}
                />

                <main className="p-4 sm:p-6 lg:p-8">

                    {/* ==========================================
              HEADER
          ========================================== */}

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

                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

                            <div>

                                <div className="flex items-center gap-2 text-sm font-medium text-green-700">
                                    <Sprout size={16} />
                                    Farm Management
                                </div>

                                <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                                    My Farms
                                </h1>

                                <p className="mt-2 text-sm text-slate-500">
                                    Manage and monitor your registered farms.
                                </p>

                            </div>

                            <div className="flex gap-2">

                                {/* REFRESH */}

                                <button
                                    onClick={fetchFarms}
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

                                {/* ADD FARM */}

                                <button
                                    onClick={openAddModal}
                                    className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-green-700/20 transition-all hover:-translate-y-0.5 hover:bg-green-800"
                                >

                                    <Plus size={17} />

                                    Add Farm

                                </button>

                            </div>

                        </div>

                    </motion.div>

                    {/* ==========================================
              SEARCH
          ========================================== */}

                    <div className="mb-6 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">

                        <div className="relative">

                            <Search
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type="text"
                                placeholder="Search farms by name or location..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
                            />

                        </div>

                    </div>

                    {/* ==========================================
              LOADING
          ========================================== */}

                    {loading && (

                        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

                            {[1, 2, 3].map((item) => (

                                <div
                                    key={item}
                                    className="h-64 animate-pulse rounded-2xl bg-white shadow-sm"
                                />

                            ))}

                        </div>

                    )}

                    {/* ==========================================
              EMPTY STATE
          ========================================== */}

                    {!loading &&
                        filteredFarms.length === 0 && (

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
                                    <Sprout size={30} />
                                </div>

                                <h2 className="mt-5 text-lg font-bold text-slate-900">
                                    {search
                                        ? "No matching farms"
                                        : "No farms found"}
                                </h2>

                                <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">

                                    {search
                                        ? "Try searching with a different farm name or location."
                                        : "Add your first farm to start managing your agricultural data."}

                                </p>

                                {!search && (

                                    <button
                                        onClick={openAddModal}
                                        className="mt-6 rounded-xl bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800"
                                    >
                                        Add Your First Farm
                                    </button>

                                )}

                            </motion.div>

                        )}

                    {/* ==========================================
              FARM CARDS
          ========================================== */}

                    {!loading &&
                        filteredFarms.length > 0 && (

                            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

                                <AnimatePresence>

                                    {filteredFarms.map(
                                        (farm, index) => (

                                            <motion.div
                                                key={farm.id}
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

                                                {/* CARD HEADER */}

                                                <div className="relative h-32 overflow-hidden bg-gradient-to-br from-green-700 via-green-600 to-lime-500">

                                                    <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10" />

                                                    <div className="absolute -bottom-12 -left-8 h-32 w-32 rounded-full bg-lime-300/10" />

                                                    <div className="relative flex h-full items-center justify-between p-6">

                                                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur">

                                                            <Sprout size={28} />

                                                        </div>

                                                        <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur">

                                                            Farm #{farm.id}

                                                        </span>

                                                    </div>

                                                </div>

                                                {/* CARD BODY */}

                                                <div className="p-5">

                                                    <h2 className="truncate text-lg font-bold text-slate-900">

                                                        {farm.farm_name}

                                                    </h2>

                                                    {/* LOCATION */}

                                                    <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">

                                                        <MapPin
                                                            size={16}
                                                            className="shrink-0 text-green-600"
                                                        />

                                                        <span className="truncate">

                                                            {farm.location ||
                                                                "Location not specified"}

                                                        </span>

                                                    </div>

                                                    {/* LAND AREA */}

                                                    <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 p-3">

                                                        <Ruler
                                                            size={17}
                                                            className="text-green-700"
                                                        />

                                                        <div>

                                                            <p className="text-xs text-slate-400">
                                                                Land Area
                                                            </p>

                                                            <p className="text-sm font-semibold text-slate-700">

                                                                {farm.land_area}

                                                            </p>

                                                        </div>

                                                    </div>

                                                    {/* STATUS */}

                                                    <div className="mt-4 flex items-center justify-between">

                                                        <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">

                                                            <span className="h-2 w-2 rounded-full bg-green-500" />

                                                            Active Farm

                                                        </span>

                                                        <span className="text-xs text-slate-400">

                                                            ID: {farm.id}

                                                        </span>

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

            {/* ==========================================
          ADD FARM MODAL
      ========================================== */}

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
                        onClick={() =>
                            setShowModal(false)
                        }
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
                            transition={{
                                duration: 0.25,
                            }}
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                            className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl"
                        >

                            {/* MODAL HEADER */}

                            <div className="flex items-start justify-between">

                                <div>

                                    <div className="flex items-center gap-2 text-green-700">

                                        <Sprout size={19} />

                                        <span className="text-sm font-semibold">
                                            Farm Management
                                        </span>

                                    </div>

                                    <h2 className="mt-1 text-xl font-bold text-slate-900">
                                        Add New Farm
                                    </h2>

                                </div>

                                <button
                                    onClick={() =>
                                        setShowModal(false)
                                    }
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

                                {/* FARM NAME */}

                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Farm Name
                                    </label>

                                    <input
                                        type="text"
                                        name="farm_name"
                                        value={formData.farm_name}
                                        onChange={handleChange}
                                        placeholder="e.g. Green Valley Farm"
                                        required
                                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                    />

                                </div>

                                {/* LOCATION */}

                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Location
                                    </label>

                                    <div className="relative">

                                        <MapPin
                                            size={17}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                        />

                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            placeholder="e.g. Pune, Maharashtra"
                                            className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                        />

                                    </div>

                                </div>

                                {/* LAND AREA */}

                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Land Area
                                    </label>

                                    <div className="relative">

                                        <Ruler
                                            size={17}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                        />

                                        <input
                                            type="number"
                                            name="land_area"
                                            value={formData.land_area}
                                            onChange={handleChange}
                                            placeholder="e.g. 5"
                                            min="0"
                                            step="0.01"
                                            required
                                            className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                        />

                                    </div>

                                    <p className="mt-1.5 text-xs text-slate-400">
                                        Enter the land area according to the unit used in your database.
                                    </p>

                                </div>

                                {/* BUTTONS */}

                                <div className="flex gap-3 pt-3">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowModal(false)
                                        }
                                        className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="flex-1 rounded-xl bg-green-700 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-green-700/20 transition hover:bg-green-800"
                                    >
                                        Add Farm
                                    </button>

                                </div>

                            </form>

                        </motion.div>

                    </motion.div>

                )}

            </AnimatePresence>

        </div>
    );
}

export default Farms;
