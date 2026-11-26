import { useEffect } from "react";

import AppRoutes from "./routes/AppRoutes";

import useAuthStore from "./store/authStore";

import AppLoader from "./components/common/AppLoader";


function App() {

    const initializeAuth = useAuthStore(
        (state) => state.initializeAuth
    );

    const isInitialized = useAuthStore(
        (state) => state.isInitialized
    );

    const initializationError = useAuthStore(
        (state) => state.initializationError
    );


    useEffect(() => {

        initializeAuth();

    }, [initializeAuth]);


    if (initializationError) {

        return (

            <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-white">

                <h1 className="text-2xl font-bold">
                    Unable to connect to FINORA
                </h1>

                <p className="mt-3 text-center text-slate-400">
                    {initializationError}
                </p>

                <button
                    onClick={() => initializeAuth()}
                    className="mt-6 rounded-lg bg-emerald-500 px-6 py-3 font-semibold text-slate-950"
                >
                    Try Again
                </button>

            </div>

        );

    }


    if (!isInitialized) {

        return <AppLoader />;

    }


    return <AppRoutes />;

}

export default App;