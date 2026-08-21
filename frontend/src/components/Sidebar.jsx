// import { NavLink } from "react-router-dom";

// const Sidebar = () => {
//     const menuItems = [
//         {
//             name: "Dashboard",
//             path: "/dashboard",
//         },
//         {
//             name: "Farms",
//             path: "/farm",
//         },
//         {
//             name: "Crops",
//             path: "/crops",
//         },
//         {
//             name: "Income",
//             path: "/income",
//         },
//         {
//             name: "Expense",
//             path: "/expenses",
//         },
//         {
//             name: "Budget",
//             path: "/budget",
//         },
//         {
//             name: "Report",
//             path: "/reports",
//         },
//         {
//             name: "AI Assitant",
//             path: "/ai-assistance",
//         },
//     ];

//     return (
//         <aside className="sidebar">
//             {/* Logo */}
//             <div className="sidebar-logo">
//                 AgriTrack
//             </div>

//             {/* Navigation */}
//             <nav className="sidebar-nav">
//                 {menuItems.map((item) => (
//                     <NavLink
//                         key={item.path}
//                         to={item.path}
//                         className={({ isActive }) =>
//                             `sidebar-link ${isActive ? "active" : ""}`
//                         }
//                     >
//                         {item.name}
//                     </NavLink>
//                 ))}
//             </nav>
//         </aside>
//     );
// };

// export default Sidebar;

import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Sprout,
    Wheat,
    Receipt,
    WalletCards,
    Target,
    FileText,
    Bot,
    X,
    Leaf,
} from "lucide-react";

const Sidebar = ({ open, setOpen }) => {
    const menuItems = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            name: "Farms",
            path: "/farm",
            icon: Sprout,
        },
        {
            name: "Crops",
            path: "/crops",
            icon: Wheat,
        },
        {
            name: "Expenses",
            path: "/expenses",
            icon: Receipt,
        },
        {
            name: "Income",
            path: "/income",
            icon: WalletCards,
        },
        {
            name: "Budgets",
            path: "/budget",
            icon: Target,
        },
        {
            name: "Reports",
            path: "/reports",
            icon: FileText,
        },
        {
            name: "AI Assistant",
            path: "/ai-assistance",
            icon: Bot,
        },
    ];

    return (
        <>
            {/* ================= MOBILE OVERLAY ================= */}
            {open && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* ================= SIDEBAR ================= */}
            <aside
                className={`
                    fixed left-0 top-0 z-50
                    flex h-screen w-[280px] flex-col
                    border-r border-slate-100 bg-white
                    shadow-xl shadow-slate-200/30
                    transition-transform duration-300 ease-in-out
                    lg:translate-x-0 lg:shadow-none
                    ${open ? "translate-x-0" : "-translate-x-full"}
                `}
            >
                {/* ================= LOGO ================= */}
                <div className="flex h-[135px] items-center border-b border-slate-100 px-6">
                    <div className="flex items-center gap-4">

                        {/* Logo Icon */}
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-green-700 text-white shadow-lg shadow-green-100">
                            <Leaf
                                size={32}
                                strokeWidth={2}
                            />
                        </div>

                        {/* Logo Text */}
                        <div>
                            <h1 className="text-[22px] font-bold tracking-tight text-green-800">
                                AgriTrack
                            </h1>

                            <p className="mt-0.5 text-xs font-semibold tracking-[1.5px] text-slate-400">
                                SMART FARMING
                            </p>
                        </div>
                    </div>

                    {/* Mobile Close Button */}
                    <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="ml-auto rounded-xl p-2 text-slate-500 transition hover:bg-green-50 hover:text-green-700 lg:hidden"
                        aria-label="Close sidebar"
                    >
                        <X size={22} />
                    </button>
                </div>

                {/* ================= NAVIGATION ================= */}
                <nav className="flex-1 overflow-y-auto px-3 py-8">

                    {/* Main Menu Title */}
                    <p className="mb-4 px-4 text-xs font-bold tracking-wider text-slate-400">
                        MAIN MENU
                    </p>

                    <div className="space-y-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;

                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setOpen(false)}
                                    className={({ isActive }) =>
                                        `
                                        group flex items-center gap-4
                                        rounded-2xl px-5 py-4
                                        text-[17px] font-medium
                                        transition-all duration-200

                                        ${isActive
                                            ? "bg-green-700 text-white shadow-lg shadow-green-100"
                                            : "text-slate-600 hover:bg-green-50 hover:text-green-700"
                                        }
                                        `
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            <Icon
                                                size={24}
                                                strokeWidth={2}
                                                className={`
                                                    shrink-0
                                                    transition-colors duration-200
                                                    ${isActive
                                                        ? "text-white"
                                                        : "text-slate-500 group-hover:text-green-700"
                                                    }
                                                `}
                                            />

                                            <span>
                                                {item.name}
                                            </span>
                                        </>
                                    )}
                                </NavLink>
                            );
                        })}
                    </div>
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;