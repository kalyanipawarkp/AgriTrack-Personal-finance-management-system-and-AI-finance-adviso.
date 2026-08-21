import { motion } from "framer-motion";
import {
    AlertCircle,
    Bot,
    Lightbulb,
    RefreshCw,
    Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import api from "../services/api";

function AIInsightCard() {
    const [insight, setInsight] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchInsight = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            const response = await api.post(
                "/ai/insight",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setInsight(
                response.data?.insight ||
                response.data?.message ||
                "No insight available right now."
            );
        } catch (err) {
            console.error("AI insight error:", err);

            setError(
                err.response?.data?.message ||
                "Unable to generate AI insight."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInsight();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-3xl border border-green-100 bg-gradient-to-br from-green-50 via-white to-lime-50 p-6 shadow-sm"
        >
            {/* Decorative glow */}
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-green-200/30 blur-3xl" />

            <div className="relative">

                {/* Header */}
                <div className="flex items-start justify-between gap-4">

                    <div className="flex items-center gap-3">

                        <motion.div
                            animate={{
                                scale: [1, 1.05, 1],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                            }}
                            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-700 text-white shadow-lg shadow-green-700/20"
                        >
                            <Bot size={24} />
                        </motion.div>

                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="font-bold text-slate-900">
                                    AI Financial Insight
                                </h2>

                                <Sparkles
                                    size={16}
                                    className="text-green-600"
                                />
                            </div>

                            <p className="mt-1 text-xs text-slate-500">
                                Personalized insight based on your farm data
                            </p>
                        </div>

                    </div>

                    <button
                        onClick={fetchInsight}
                        disabled={loading}
                        className="rounded-xl p-2 text-slate-400 transition hover:bg-white hover:text-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                        title="Refresh insight"
                    >
                        <RefreshCw
                            size={18}
                            className={loading ? "animate-spin" : ""}
                        />
                    </button>

                </div>

                {/* Content */}
                <div className="mt-6">

                    {loading && (
                        <div className="space-y-3">
                            <div className="h-4 w-full animate-pulse rounded-lg bg-slate-200" />
                            <div className="h-4 w-11/12 animate-pulse rounded-lg bg-slate-200" />
                            <div className="h-4 w-8/12 animate-pulse rounded-lg bg-slate-200" />
                        </div>
                    )}

                    {!loading && error && (
                        <div className="flex gap-3 rounded-2xl border border-red-100 bg-red-50 p-4">

                            <AlertCircle
                                size={20}
                                className="mt-0.5 shrink-0 text-red-500"
                            />

                            <div>
                                <p className="text-sm font-semibold text-red-700">
                                    AI insight unavailable
                                </p>

                                <p className="mt-1 text-xs leading-5 text-red-600">
                                    {error}
                                </p>
                            </div>

                        </div>
                    )}

                    {!loading && !error && (
                        <div className="flex gap-4 rounded-2xl border border-green-100 bg-white/80 p-5">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700">
                                <Lightbulb size={20} />
                            </div>

                            <p className="whitespace-pre-line text-sm leading-7 text-slate-600">
                                {insight}
                            </p>

                        </div>
                    )}

                </div>

                {/* Footer */}
                {!loading && !error && (
                    <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                        <Sparkles size={13} className="text-green-600" />
                        Generated from your current financial data
                    </div>
                )}

            </div>
        </motion.div>
    );
}

export default AIInsightCard;