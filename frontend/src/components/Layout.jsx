import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import DashboardNavbar from "../components/DashboardNavbar";

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50">

            {/* Sidebar */}
            <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            {/* Main Area */}
            <div className="lg:ml-[280px]">

                {/* Navbar */}
                <DashboardNavbar
                    setSidebarOpen={setSidebarOpen}
                />

                {/* Page Content */}
                <main>
                    <Outlet />
                </main>

            </div>
        </div>
    );
};

export default Layout;