import { motion } from "framer-motion";
import {
    ArrowRight,
    BarChart3,
    Bot,
    Leaf,
    ShieldCheck,
    Sprout,
    WalletCards,
} from "lucide-react";
import { Link } from "react-router-dom";
const features = [
    {
        icon: Sprout,
        title: "Manage Your Crops",
        description:
            "Keep your farms and crops organized and track your agricultural activities easily.",
    },
    {
        icon: WalletCards,
        title: "Track Expenses",
        description:
            "Record farming expenses and understand exactly where your money is going.",
    },
    {
        icon: BarChart3,
        title: "Understand Your Profit",
        description:
            "Analyze income, expenses and crop performance with clear financial insights.",
    },
    {
        icon: Bot,
        title: "AI Financial Assistant",
        description:
            "Get intelligent recommendations based on your actual farming financial data.",
    },
];

const stats = [
    { value: "100%", label: "Expense Tracking" },
    { value: "24/7", label: "Financial Insights" },
    { value: "AI", label: "Smart Recommendations" },
];

function Home() {
    return (
        <div className="min-h-screen overflow-hidden bg-white text-slate-800">

            {/* NAVBAR */}
            <nav className="fixed left-0 right-0 top-0 z-50 border-b border-green-100/70 bg-white/80 backdrop-blur-xl">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2"
                    >


                        <div>
                            <h1 className="text-xl font-bold tracking-tight font-serif text-green-800">
                                AgriTrack
                            </h1>
                            <p className="text-[10px] font-medium uppercase tracking-widest text-slate-500">
                                Smart Farming
                            </p>
                        </div>
                    </motion.div>

                    <div className="hidden items-center gap-8 md:flex">
                        <a
                            href="#home"
                            className="text-sm font-medium text-green-700 font-serif transition-colors hover:text-green-900"
                        >
                            Home
                        </a>

                        <a
                            href="#features"
                            className="text-sm font-medium text-slate-600 font-serif transition-colors hover:text-green-700"
                        >
                            Features
                        </a>

                        <a
                            href="#about"
                            className="text-sm font-medium text-slate-600 font-serif transition-colors hover:text-green-700"
                        >
                            About
                        </a>
                    </div>

                    {/* <div className="flex items-center gap-3">
                        <button className="hidden rounded-xl px-4 py-2 text-sm font-semibold text-green-700 transition hover:bg-green-50 sm:block">
                            Login
                        </button>

                        <button className="rounded-xl bg-green-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-green-700/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-green-800 hover:shadow-xl">
                            Get Started
                        </button>
                    </div> */}

                    <div className="flex items-center gap-3">
                        <Link
                            to="/login"
                            className="hidden font-serif rounded-xl px-4 py-2 text-sm font-semibold text-green-700 transition hover:bg-green-50 sm:block"
                        >
                            Login
                        </Link>

                        <Link
                            to="/register"
                            className="font-serif rounded-xl bg-green-700 px-5 py-2.5 text-sm font-semibold text-white  transition-all duration-300 hover:-translate-y-0.5  hover:shadow-xl"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* HERO */}
            <section
                id="home"
                className="relative min-h-screen overflow-hidden bg-gradient-to-br from-green-50 via-white to-lime-50 pt-28"
            >

                {/* Decorative background circles */}
                <div className="absolute -left-32 top-40 h-72 w-72 rounded-full bg-green-200/30 blur-3xl" />

                <div className="absolute -right-32 top-20 h-96 w-96 rounded-full bg-lime-200/30 blur-3xl" />

                <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">

                    {/* HERO TEXT */}
                    <motion.div
                        initial={{ opacity: 0, y: 35 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                    >

                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-200 bg-white/80 px-4 py-2 text-sm font-medium text-green-700 shadow-sm"
                        >
                            <Leaf size={16} />
                            Smart Financial Management for Farmers
                        </motion.div>


                        <h2 className="font-serif max-w-2xl text-5xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-6xl ">
                            Grow Your Farm.
                            <span className="block text-green-700 font-serif">
                                Manage Smarter.
                            </span>
                        </h2>

                        <p className="font-serif mt-6 max-w-xl text-lg leading-8 text-slate-600">
                            AgriTrack helps farmers manage crops, track expenses,
                            monitor income, control budgets and make smarter
                            financial decisions—all in one place.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-4">

                            <button className="font-serif group flex items-center gap-2 rounded-xl bg-green-700 px-6 py-3.5 font-semibold text-white shadow-xl shadow-green-700/20 transition-all duration-300 hover:-translate-y-1 hover:bg-green-800">
                                Start Managing

                                <ArrowRight
                                    size={18}
                                    className="transition-transform duration-300 group-hover:translate-x-1"
                                />
                            </button>

                            <button className="font-serif rounded-xl border border-green-200 bg-white px-6 py-3.5 font-semibold text-green-700 transition-all duration-300 hover:-translate-y-1 hover:border-green-300 hover:bg-green-50">
                                Explore Features
                            </button>

                        </div>

                        {/* MINI STATS */}
                        <div className="mt-12 grid max-w-xl grid-cols-3 gap-4">

                            {stats.map((stat, index) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        delay: 0.4 + index * 0.1,
                                    }}
                                    className="rounded-2xl border border-green-100 bg-white/80 p-4 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                                >
                                    <p className="text-xl font-bold text-green-700">
                                        {stat.value}
                                    </p>

                                    <p className="mt-1 text-xs leading-4 text-slate-500">
                                        {stat.label}
                                    </p>
                                </motion.div>
                            ))}

                        </div>
                    </motion.div>

                    {/* HERO VISUAL */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative mx-auto w-full max-w-lg"
                    >

                        {/* Main dashboard card */}
                        <div className="relative rounded-[2rem] border border-green-100 bg-white p-6 shadow-2xl shadow-green-900/10">

                            <div className="flex items-center justify-between">

                                <div>
                                    <p className="font-serif text-sm font-medium text-slate-500">
                                        Farm Overview
                                    </p>

                                    <h3 className="font-serif mt-1 text-2xl font-bold text-slate-900">
                                        Your Farm
                                    </h3>
                                </div>

                                <div className="font-serif flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                                    <Sprout size={25} />
                                </div>

                            </div>

                            {/* Fake chart */}
                            <div className="mt-8 flex h-48 items-end gap-3 rounded-2xl bg-green-50 p-5">

                                {[45, 65, 50, 80, 68, 92, 78].map(
                                    (height, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ height: 0 }}
                                            animate={{ height: `${height}%` }}
                                            transition={{
                                                duration: 0.7,
                                                delay: 0.5 + index * 0.08,
                                            }}
                                            className="flex-1 rounded-t-lg bg-green-600/80"
                                        />
                                    )
                                )}

                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-4">

                                <div className="rounded-2xl bg-slate-50 p-4">
                                    <p className="font-serif text-xs text-slate-500">
                                        Total Income
                                    </p>

                                    <p className="font-serif mt-1 text-xl font-bold text-slate-900">
                                        ₹1,50,000
                                    </p>
                                </div>

                                <div className="font-serif rounded-2xl bg-green-50 p-4">
                                    <p className=" text-xs text-slate-500">
                                        Profit
                                    </p>

                                    <p className="mt-1 text-xl font-bold text-green-700">
                                        ₹65,000
                                    </p>
                                </div>

                            </div>
                        </div>

                        {/* Floating AI card */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="absolute -right-5 -top-6 rounded-2xl border border-green-100 bg-white p-4 shadow-xl sm:-right-10"
                        >
                            <div className="font-serif flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-700">
                                    <Bot size={20} />
                                </div>

                                <div>
                                    <p className="text-xs font-medium text-slate-500">
                                        AI Assistant
                                    </p>

                                    <p className="text-sm font-bold text-green-700">
                                        Smart insights ready
                                    </p>
                                </div>

                            </div>
                        </motion.div>

                        {/* Floating security card */}
                        <motion.div
                            animate={{ y: [0, 8, 0] }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="absolute -bottom-5 -left-5 rounded-2xl border border-green-100 bg-white p-4 shadow-xl sm:-left-10"
                        >
                            <div className="font-serif flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-700">
                                    <ShieldCheck size={20} />
                                </div>

                                <div>
                                    <p className="text-xs text-slate-500">
                                        Your Data
                                    </p>

                                    <p className="text-sm font-bold text-slate-800">
                                        Secure & Private
                                    </p>
                                </div>

                            </div>
                        </motion.div>

                    </motion.div>

                </div>
            </section>

            {/* FEATURES */}
            <section
                id="features"
                className="bg-white px-6 py-24 lg:px-8"
            >
                <div className="font-serif mx-auto max-w-7xl">

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="mx-auto max-w-2xl text-center"
                    >

                        <p className="text-sm font-bold uppercase tracking-widest text-green-700">
                            Everything in one place
                        </p>

                        <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
                            Built for smarter farm management
                        </h2>

                        <p className="mt-4 text-slate-600">
                            From everyday expenses to AI-powered financial insights,
                            AgriTrack brings your farm's important information together.
                        </p>

                    </motion.div>

                    <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

                        {features.map((feature, index) => {

                            const Icon = feature.icon;

                            return (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        duration: 0.5,
                                        delay: index * 0.1,
                                    }}
                                    whileHover={{ y: -8 }}
                                    className="group rounded-3xl border border-slate-100 bg-white p-7 shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-green-900/10"
                                >

                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-green-700 transition-all duration-300 group-hover:bg-green-700 group-hover:text-white">
                                        <Icon size={25} />
                                    </div>

                                    <h3 className="mt-6 text-xl font-bold text-slate-900">
                                        {feature.title}
                                    </h3>

                                    <p className="mt-3 text-sm leading-6 text-slate-500">
                                        {feature.description}
                                    </p>

                                </motion.div>
                            );
                        })}

                    </div>
                </div>
            </section>

            {/* ABOUT */}
            <section
                id="about"
                className="bg-green-50 px-6 py-24 lg:px-8"
            >
                <div className="font-serif mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">

                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >

                        <p className="text-sm font-bold uppercase tracking-widest text-green-700">
                            Why AgriTrack?
                        </p>

                        <h2 className="mt-3 text-4xl font-bold text-slate-900">
                            Make better decisions with your farm's numbers.
                        </h2>

                        <p className="mt-5 max-w-xl leading-7 text-slate-600">
                            Farming involves many expenses, crops, budgets and
                            income sources. AgriTrack brings these details together
                            so farmers can understand their financial performance
                            and make more informed decisions.
                        </p>

                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="grid grid-cols-2 gap-4"
                    >

                        {[
                            ["🌱", "Crop Tracking"],
                            ["💰", "Expense Control"],
                            ["📊", "Financial Reports"],
                            ["🤖", "AI Insights"],
                        ].map(([icon, title]) => (
                            <div
                                key={title}
                                className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                            >
                                <div className="text-3xl">{icon}</div>
                                <p className="mt-4 font-bold text-slate-800">
                                    {title}
                                </p>
                            </div>
                        ))}

                    </motion.div>

                </div>
            </section>

            {/* FOOTER */}
            <footer className="bg-slate-950 px-6 py-10 text-white lg:px-8">

                <div className="font-serif mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">

                    <div className="flex items-center gap-2">
                        <Leaf size={20} className="text-green-400" />
                        <span className="font-bold">
                            AgriTrack
                        </span>
                    </div>

                    <p className="text-sm text-slate-400">
                        Smart farming. Smarter financial decisions.
                    </p>

                </div>

            </footer>

        </div>
    );
}

export default Home;