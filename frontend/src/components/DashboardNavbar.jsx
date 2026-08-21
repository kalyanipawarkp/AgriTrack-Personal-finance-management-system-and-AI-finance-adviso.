// import { Menu, Bell, UserCircle } from "lucide-react";

// function DashboardNavbar({ setSidebarOpen }) {
//     const user = JSON.parse(localStorage.getItem("user") || "{}");

//     return (
//         <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/80 backdrop-blur-xl">
//             <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">

//                 <button
//                     onClick={() => setSidebarOpen(true)}
//                     className="rounded-xl p-2 text-slate-600 transition hover:bg-green-50 hover:text-green-700 lg:hidden"
//                 >
//                     <Menu size={22} />
//                 </button>

//                 <div className="hidden lg:block">
//                     <p className="text-sm text-slate-500">
//                         Welcome back 👋
//                     </p>

//                     <h2 className="font-bold text-slate-900">
//                         {user.name || "Farmer"}
//                     </h2>
//                 </div>

//                 <div className="ml-auto flex items-center gap-3">

//                     <button className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-green-50 hover:text-green-700">
//                         <Bell size={21} />

//                         <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-green-600 ring-2 ring-white" />
//                     </button>

//                     <div className="hidden h-8 w-px bg-slate-200 sm:block" />

//                     <div className="flex items-center gap-2">
//                         <UserCircle
//                             size={34}
//                             className="text-green-700"
//                         />

//                         <div className="hidden sm:block">
//                             <p className="text-sm font-semibold text-slate-800">
//                                 {user.name || "Farmer"}
//                             </p>

//                             <p className="text-xs text-slate-400">
//                                 Farmer
//                             </p>
//                         </div>
//                     </div>

//                 </div>
//             </div>
//         </header>
//     );
// }

// export default DashboardNavbar;

import { Menu, Bell, UserCircle } from "lucide-react";

function DashboardNavbar({ setSidebarOpen }) {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    return (
        <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/90 backdrop-blur-xl">
            <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">

                {/* ================= MOBILE MENU ================= */}
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="rounded-xl p-2.5 text-slate-600 transition hover:bg-green-50 hover:text-green-700 lg:hidden"
                    aria-label="Open sidebar"
                >
                    <Menu size={24} />
                </button>

                {/* ================= DESKTOP WELCOME ================= */}
                <div className="hidden lg:block">
                    <p className="text-sm text-slate-500">
                        Welcome back 👋
                    </p>

                    <h2 className="text-lg font-bold text-slate-900">
                        {user.name || "Farmer"}
                    </h2>
                </div>

                {/* ================= RIGHT SIDE ================= */}
                <div className="ml-auto flex items-center gap-3">

                    {/* Notification */}
                    <button
                        className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-green-50 hover:text-green-700"
                        aria-label="Notifications"
                    >
                        <Bell size={21} />

                        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-green-600 ring-2 ring-white" />
                    </button>

                    {/* Divider */}
                    <div className="hidden h-8 w-px bg-slate-200 sm:block" />

                    {/* User */}
                    <div className="flex items-center gap-2">
                        <UserCircle
                            size={36}
                            strokeWidth={1.8}
                            className="text-green-700"
                        />

                        <div className="hidden sm:block">
                            <p className="text-sm font-semibold text-slate-800">
                                {user.name || "Farmer"}
                            </p>

                            <p className="text-xs text-slate-400">
                                Farmer
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default DashboardNavbar;