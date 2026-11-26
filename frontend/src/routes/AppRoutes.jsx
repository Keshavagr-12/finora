import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";

import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";

import DashboardLayout from "../layouts/DashboardLayout";


function AppRoutes() {

    return (

        <Routes>

            {/* Public Routes */}

            <Route path="/" element={<Home />} />


            {/* Guest Routes */}

            <Route element={<GuestRoute />}>

                <Route path="/login" element={<Login />} />

                <Route path="/register" element={<Register />} />

            </Route>


            {/* Protected Routes */}

            <Route element={<ProtectedRoute />}>

                <Route element={<DashboardLayout />}>

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/profile"
                        element={<Profile />}
                    />

                </Route>

            </Route>


            {/* Not Found */}

            <Route path="*" element={<NotFound />} />

        </Routes>

    );

}

export default AppRoutes;