import useAuthStore from "../store/authStore";


function Dashboard() {

    const user = useAuthStore((state) => state.user);

    const isAuthenticated = useAuthStore(
        (state) => state.isAuthenticated
    );


    return (

        <div className="min-h-screen bg-slate-950 p-8 text-white">

            <h1 className="text-3xl font-bold">
                FINORA Dashboard
            </h1>

            <p className="mt-4 text-xl text-emerald-400">
                Welcome, {user?.name || "Guest"}
            </p>

            <div className="mt-6 space-y-3 rounded-xl border border-slate-800 bg-slate-900 p-6">

                <p>Email: {user?.email || "-"}</p>

                <p>Role: {user?.role || "-"}</p>

                <p>Currency: {user?.currency || "-"}</p>

                <p>Timezone: {user?.timezone || "-"}</p>

                <p>
                    Authentication Status:{" "}
                    {isAuthenticated
                        ? "Authenticated"
                        : "Not authenticated"}
                </p>

            </div>

        </div>

    );

}

export default Dashboard;