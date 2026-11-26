import { useState } from "react";

import { Outlet } from "react-router-dom";

import Sidebar from "../components/dashboard/Sidebar";

import Header from "../components/dashboard/Header";


function DashboardLayout() {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (

        <div className="min-h-screen bg-slate-950 text-white">

            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <div className="min-h-screen lg:ml-64">

                <Header
                    onMenuClick={() => setIsSidebarOpen(true)}
                />

                <main className="p-4 sm:p-6 lg:p-8">

                    <Outlet />

                </main>

            </div>

        </div>

    );

}

export default DashboardLayout;