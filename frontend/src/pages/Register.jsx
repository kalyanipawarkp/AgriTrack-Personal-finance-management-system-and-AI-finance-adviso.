import { useState } from "react";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Leaf,
    Lock,
    Mail,
    User,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        const {
            name,
            email,
            password,
            confirmPassword,
        } = formData;

        // Basic validation
        if (!name.trim() || !email.trim() || !password) {
            setError("Please fill in all required fields.");
            return;
        }

        // Password confirmation
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        // Password length
        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post(
                `${API_URL}/auth/register`,
                {
                    name: name.trim(),
                    email: email.trim(),
                    password,
                }
            );

            setSuccess(
                response.data?.message ||
                "Account created successfully!"
            );

            // Clear form
            setFormData({
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
            });

            // Redirect to login after successful registration
            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (err) {
            console.error("Registration error:", err);

            setError(
                err.response?.data?.message ||
                "Unable to create account. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-lime-50">
            <div className="font-serif mx-auto flex min-h-screen max-w-2xl items-center justify-center px-6 py-12">

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full"
                >

                    {/* BACK TO HOME */}
                    <Link
                        to="/"
                        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-green-700"
                    >
                        <ArrowLeft size={17} />
                        Back to home
                    </Link>

                    {/* REGISTER CARD */}
                    <div className="rounded-3xl border border-green-100 bg-white p-8 shadow-xl shadow-green-900/5 sm:p-10">

                        {/* HEADER */}
                        <div className="mb-8 text-center">

                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-700 text-white shadow-lg">
                                <Leaf size={27} />
                            </div>

                            <h1 className="mt-5 text-3xl font-bold text-slate-900">
                                Create your account
                            </h1>

                            <p className="mt-2 text-sm text-slate-500">
                                Start managing your farm smarter with AgriTrack.
                            </p>

                        </div>

                        {/* ERROR MESSAGE */}
                        {error && (
                            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                                {error}
                            </div>
                        )}

                        {/* SUCCESS MESSAGE */}
                        {success && (
                            <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                                {success}
                                <p className="mt-1 text-xs text-green-600">
                                    Redirecting you to login...
                                </p>
                            </div>
                        )}

                        {/* FORM */}
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >

                            {/* NAME */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Full Name
                                </label>

                                <div className="relative">
                                    <User
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter your name"
                                        disabled={loading}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                                    />
                                </div>
                            </div>

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
                                        disabled={loading}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10 disabled:cursor-not-allowed disabled:opacity-60"
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
                                        placeholder="Create a password"
                                        disabled={loading}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                                    />
                                </div>
                            </div>

                            {/* CONFIRM PASSWORD */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Confirm Password
                                </label>

                                <div className="relative">
                                    <Lock
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Confirm your password"
                                        disabled={loading}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                                    />
                                </div>
                            </div>

                            {/* SUBMIT BUTTON */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-xl bg-green-700 py-3.5 font-semibold text-white shadow-lg shadow-green-700/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-green-800 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                            >
                                {loading
                                    ? "Creating Account..."
                                    : "Create Account"}
                            </button>

                        </form>

                        {/* LOGIN LINK */}
                        <p className="mt-7 text-center text-sm text-slate-500">
                            Already have an account?{" "}

                            <Link
                                to="/login"
                                className="font-semibold text-green-700 hover:text-green-800"
                            >
                                Sign in
                            </Link>
                        </p>

                    </div>

                </motion.div>
            </div>
        </div>
    );
}

export default Register;