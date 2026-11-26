import { Navigate, Outlet } from "react-router-dom";

import useAuthStore from "../store/authStore";

import AppLoader from "../components/common/AppLoader";


function ProtectedRoute() {

    const isAuthenticated = useAuthStore(
        (state) => state.isAuthenticated
    );

    const isInitialized = useAuthStore(
        (state) => state.isInitialized
    );


    if (!isInitialized) {

        return <AppLoader />;

    }


    if (!isAuthenticated) {

        return <Navigate to="/login" replace />;

    }


    return <Outlet />;

}

export default ProtectedRoute;