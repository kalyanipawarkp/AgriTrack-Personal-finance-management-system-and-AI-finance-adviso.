import { useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

const API_URL = "http://localhost:5000/api";

const getToken = () => {
    return localStorage.getItem("token");
};

const getAuthConfig = () => ({
    headers: {
        Authorization: `Bearer ${getToken()}`,
    },
});

const suggestedQuestions = [
    "Analyze my farming finances",
    "Which crop is most profitable?",
    "Where am I spending too much?",
    "How can I reduce my farming expenses?",
    "Am I exceeding any of my budgets?",
];

function AIAssistance() {
    const [question, setQuestion] = useState("");
    const [insight, setInsight] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // ==================================================
    // ASK AI
    // ==================================================

    const askAI = async (customQuestion = null) => {
        const selectedQuestion =
            customQuestion !== null
                ? customQuestion
                : question.trim();

        if (!selectedQuestion) {
            setError("Please enter a question.");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setInsight("");

            const response = await axios.post(
                `${API_URL}/ai/insight`,
                {
                    question: selectedQuestion,
                },
                getAuthConfig()
            );

            setInsight(
                response.data.insight ||
                "No insight was generated."
            );

            setQuestion(selectedQuestion);
        } catch (err) {
            console.error("AI assistance error:", err);

            setError(
                err.response?.data?.message ||
                "Unable to generate AI insight. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // ==================================================
    // FORM SUBMIT
    // ==================================================

    const handleSubmit = (e) => {
        e.preventDefault();
        askAI();
    };

    // ==================================================
    // SUGGESTION
    // ==================================================

    const handleSuggestion = (suggestion) => {
        setQuestion(suggestion);
        askAI(suggestion);
    };

    // ==================================================
    // CLEAR
    // ==================================================

    const clearConversation = () => {
        setQuestion("");
        setInsight("");
        setError("");
    };

    return (
        <div className="min-h-screen font-serif bg-slate-50">

            {/* ==================================================
                SIDEBAR
            ================================================== */}

            <Sidebar />

            {/* ==================================================
                MAIN CONTENT
            ================================================== */}

            <main className="ml-64 min-h-screen px-6 py-8 lg:px-8">

                <div className="mx-auto max-w-7xl">

                    {/* ==================================================
                        PAGE HEADER
                    ================================================== */}

                    <div className="mb-8">

                        <div className="flex items-start justify-between gap-6">

                            <div>

                                <div className="mb-2 flex items-center gap-2">
                                    <span className="text-sm font-semibold text-emerald-600">
                                        Smart Farming
                                    </span>

                                    <span className="h-1 w-1 rounded-full bg-slate-300"></span>

                                    <span className="text-sm text-slate-400">
                                        AI Assistance
                                    </span>
                                </div>

                                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                                    AI Farming Assistant
                                </h1>

                                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                                    Get intelligent financial insights and
                                    practical recommendations based on your
                                    farm's income, expenses, crops, and budgets.
                                </p>

                            </div>

                            {(insight || question) && (
                                <button
                                    onClick={clearConversation}
                                    className="flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                                >
                                    <span>↻</span>
                                    New Analysis
                                </button>
                            )}

                        </div>

                    </div>

                    {/* ==================================================
                        ERROR
                    ================================================== */}

                    {error && (
                        <div className="mb-6 flex items-center justify-between rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">

                            <div className="flex items-center gap-3">

                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 font-bold">
                                    !
                                </div>

                                <span>{error}</span>

                            </div>

                            <button
                                onClick={() => setError("")}
                                className="text-lg font-bold text-red-400 hover:text-red-600"
                            >
                                ×
                            </button>

                        </div>
                    )}

                    {/* ==================================================
                        AI ASSISTANT CARD
                    ================================================== */}

                    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

                        {/* ==================================================
                            AI CARD HEADER
                        ================================================== */}

                        <div className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-br from-emerald-50 via-white to-white px-7 py-7">

                            {/* Decorative background */}
                            <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-emerald-100/40 blur-3xl"></div>

                            <div className="relative flex items-center gap-4">

                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-2xl text-white shadow-lg shadow-emerald-200">
                                    ✦
                                </div>

                                <div>

                                    <div className="flex items-center gap-3">

                                        <h2 className="text-lg font-bold text-slate-900">
                                            Your AI Financial Assistant
                                        </h2>

                                        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                                            AI Powered
                                        </span>

                                    </div>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Ask questions and get insights from
                                        your actual farming data.
                                    </p>

                                </div>

                            </div>

                        </div>

                        {/* ==================================================
                            SUGGESTED QUESTIONS
                        ================================================== */}

                        <div className="px-7 py-6">

                            <div className="mb-4">

                                <h3 className="text-sm font-bold text-slate-800">
                                    What would you like to know?
                                </h3>

                                <p className="mt-1 text-xs text-slate-400">
                                    Select a suggestion or ask your own question.
                                </p>

                            </div>

                            <div className="flex flex-wrap gap-2.5">

                                {suggestedQuestions.map((suggestion) => (
                                    <button
                                        key={suggestion}
                                        onClick={() =>
                                            handleSuggestion(suggestion)
                                        }
                                        disabled={loading}
                                        className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {suggestion}
                                    </button>
                                ))}

                            </div>

                        </div>

                        {/* ==================================================
                            QUESTION INPUT
                        ================================================== */}

                        <div className="border-t border-slate-100 bg-slate-50/50 px-7 py-6">

                            <form onSubmit={handleSubmit}>

                                <label className="mb-2.5 block text-sm font-bold text-slate-700">
                                    Ask your question
                                </label>

                                <div className="flex flex-col gap-3 sm:flex-row">

                                    <div className="relative flex-1">

                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500">
                                            ✦
                                        </span>

                                        <input
                                            type="text"
                                            value={question}
                                            onChange={(e) =>
                                                setQuestion(e.target.value)
                                            }
                                            placeholder="e.g. Which crop is giving me the highest profit?"
                                            disabled={loading}
                                            className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 disabled:bg-slate-100"
                                        />

                                    </div>

                                    <button
                                        type="submit"
                                        disabled={
                                            loading ||
                                            !question.trim()
                                        }
                                        className="rounded-xl bg-emerald-600 px-7 py-3.5 text-sm font-bold text-white shadow-md shadow-emerald-100 transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <span className="flex items-center gap-2">
                                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
                                                Analyzing...
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                Ask AI
                                                <span>→</span>
                                            </span>
                                        )}
                                    </button>

                                </div>

                            </form>

                        </div>

                        {/* ==================================================
                            LOADING STATE
                        ================================================== */}

                        {loading && (
                            <div className="border-t border-slate-100 px-7 py-7">

                                <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/70 to-white p-6">

                                    <div className="flex items-center gap-4">

                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-lg text-emerald-600">
                                            ✦
                                        </div>

                                        <div className="flex-1">

                                            <div className="flex items-center justify-between">

                                                <p className="text-sm font-bold text-slate-800">
                                                    Analyzing your farm data
                                                </p>

                                                <span className="text-xs font-medium text-emerald-600">
                                                    Processing
                                                </span>

                                            </div>

                                            <p className="mt-1 text-xs text-slate-400">
                                                Reviewing income, expenses,
                                                crops, and budgets to prepare
                                                your recommendations.
                                            </p>

                                        </div>

                                    </div>

                                    <div className="mt-6 space-y-3">

                                        <div className="h-3 w-full animate-pulse rounded-full bg-slate-200"></div>

                                        <div className="h-3 w-11/12 animate-pulse rounded-full bg-slate-200"></div>

                                        <div className="h-3 w-4/5 animate-pulse rounded-full bg-slate-200"></div>

                                        <div className="h-3 w-2/3 animate-pulse rounded-full bg-slate-200"></div>

                                    </div>

                                </div>

                            </div>
                        )}

                        {/* ==================================================
                            PROFESSIONAL AI RESPONSE
                        ================================================== */}

                        {insight && !loading && (
                            <div className="border-t border-slate-100 px-7 py-7">

                                {/* Response heading */}

                                <div className="mb-5 flex items-center justify-between">

                                    <div className="flex items-center gap-3">

                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-lg text-emerald-600">
                                            ✦
                                        </div>

                                        <div>

                                            <div className="flex items-center gap-2">

                                                <h3 className="text-base font-bold text-slate-900">
                                                    AI Financial Insight
                                                </h3>

                                                <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-600">
                                                    Generated
                                                </span>

                                            </div>

                                            <p className="mt-1 text-xs text-slate-400">
                                                Analysis based on your AgriTrack
                                                financial data
                                            </p>

                                        </div>

                                    </div>

                                </div>

                                {/* Question being answered */}

                                <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 px-5 py-4">

                                    <div className="mb-1 flex items-center gap-2">

                                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                            Your question
                                        </span>

                                    </div>

                                    <p className="text-sm font-medium leading-6 text-slate-700">
                                        {question}
                                    </p>

                                </div>

                                {/* Main response */}

                                <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/70 via-white to-white">

                                    {/* Accent line */}

                                    <div className="absolute left-0 top-0 h-full w-1 bg-emerald-500"></div>

                                    <div className="p-6 pl-7">

                                        <div className="mb-4 flex items-center gap-2">

                                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-sm text-emerald-600">
                                                ✓
                                            </span>

                                            <span className="text-sm font-bold text-slate-800">
                                                Recommendation
                                            </span>

                                        </div>

                                        <div className="whitespace-pre-wrap text-sm font-bold leading-7 text-slate-900">
                                            {insight}
                                        </div>

                                    </div>

                                </div>

                                {/* Response footer */}

                                <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">

                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100">
                                        i
                                    </span>

                                    <span>
                                        AI recommendations are generated
                                        from the financial information
                                        available in your account.
                                    </span>

                                </div>

                            </div>
                        )}

                    </div>

                    {/* ==================================================
                        INFORMATION CARDS
                    ================================================== */}

                    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">

                        <InfoCard
                            icon="₹"
                            title="Financial Analysis"
                            description="Understand your income, expenses, and overall profit or loss."
                        />

                        <InfoCard
                            icon="🌱"
                            title="Crop Insights"
                            description="Compare crop profitability and identify your strongest crops."
                        />

                        <InfoCard
                            icon="📊"
                            title="Budget Monitoring"
                            description="Identify budget problems and control unnecessary spending."
                        />

                    </div>

                    {/* ==================================================
                        DISCLAIMER
                    ================================================== */}

                    <div className="mt-6 flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4">

                        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-400">
                            i
                        </div>

                        <p className="text-xs leading-5 text-slate-400">
                            AI recommendations are based on the financial data
                            available in your AgriTrack account. Always verify
                            important financial decisions with your own records
                            and judgment.
                        </p>

                    </div>

                </div>

            </main>

        </div>
    );
}


// ==================================================
// INFORMATION CARD
// ==================================================

function InfoCard({ icon, title, description }) {

    return (
        <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">

            <div className="flex items-start gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 font-bold text-emerald-600 transition-transform duration-300 group-hover:scale-110">
                    {icon}
                </div>

                <div>

                    <h3 className="font-semibold text-slate-900">
                        {title}
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-slate-900">
                        {description}
                    </p>

                </div>

            </div>

        </div>
    );
}


// ==================================================
// EXPORT
// ==================================================

export default AIAssistance;