import { motion } from "framer-motion";
import { ArrowLeft, Leaf, Lock, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await api.post("/auth/login", formData);

            const { token, user } = response.data;

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            navigate("/dashboard");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Login failed. Please check your credentials."
            );
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-lime-50">

            <div className="font-serif mx-auto grid min-h-screen max-w-7xl lg:grid-cols-2">

                {/* LEFT SIDE */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="hidden items-center justify-center p-12 lg:flex"
                >
                    <div className="max-w-md">

                        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-700 text-white shadow-lg">
                            <Leaf size={28} />
                        </div>

                        <h1 className="text-5xl font-extrabold leading-tight text-slate-900">
                            Welcome back to
                            <span className="block text-green-700">
                                AgriTrack 🌾
                            </span>
                        </h1>

                        <p className="mt-6 leading-7 text-slate-600">
                            Manage your farm, track your finances and make
                            smarter decisions with powerful financial insights.
                        </p>

                        <div className="mt-10 space-y-4">

                            {[
                                "Track your farming expenses",
                                "Monitor income and budgets",
                                "Get AI-powered financial insights",
                            ].map((item) => (
                                <div
                                    key={item}
                                    className="flex items-center gap-3 text-sm font-medium text-slate-700"
                                >
                                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-100 text-green-700">
                                        ✓
                                    </div>

                                    {item}
                                </div>
                            ))}

                        </div>
                    </div>
                </motion.div>

                {/* LOGIN CARD */}
                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex items-center justify-center px-6 py-12"
                >
                    <div className="w-full max-w-md">

                        <Link
                            to="/"
                            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-green-700"
                        >
                            <ArrowLeft size={17} />
                            Back to home
                        </Link>

                        <div className="rounded-3xl border border-green-100 bg-white p-8 shadow-xl shadow-green-900/5 sm:p-10">

                            <div className="mb-8">
                                <h2 className="text-3xl font-bold text-slate-900">
                                    Sign in
                                </h2>

                                <p className="mt-2 text-sm text-slate-500">
                                    Access your AgriTrack account.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">

                                {/* EMAIL */}
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Email
                                    </label>

                                    <div className="relative">
                                        <Mail
                                            size={18}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                        />

                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Enter your email"
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10"
                                        />
                                    </div>
                                </div>

                                {/* PASSWORD */}
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Password
                                    </label>

                                    <div className="relative">
                                        <Lock
                                            size={18}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                        />

                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Enter your password"
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                                        {error}
                                    </div>
                                )}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full rounded-xl bg-green-700 py-3.5 font-semibold text-white shadow-lg shadow-green-700/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-green-800 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {loading ? "Signing in..." : "Sign in"}
                                </button>

                            </form>

                            <p className="mt-7 text-center text-sm text-slate-500">
                                Don't have an account?{" "}
                                <Link
                                    to="/register"
                                    className="font-semibold text-green-700 hover:text-green-800"
                                >
                                    Create one
                                </Link>
                            </p>

                        </div>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}

export default Login;