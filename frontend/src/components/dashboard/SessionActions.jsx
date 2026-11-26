import { useState } from "react";

import {
    LogOut,
    ShieldAlert,
    LoaderCircle
} from "lucide-react";

import useAuthStore from "../../store/authStore";


function SessionActions() {

    const logout = useAuthStore((state) => state.logout);

    const logoutAll = useAuthStore((state) => state.logoutAll);

    const isLoading = useAuthStore((state) => state.isLoading);

    const error = useAuthStore((state) => state.error);

    const clearError = useAuthStore((state) => state.clearError);


    const [activeAction, setActiveAction] = useState(null);


    const handleLogout = async (allDevices = false) => {

        if (isLoading) return;

        clearError();

        const message = allDevices
            ? "Are you sure you want to log out from all devices?"
            : "Are you sure you want to log out?";

        if (!window.confirm(message)) {
            return;
        }

        setActiveAction(allDevices ? "all" : "current");

        try {

            if (allDevices) {

                await logoutAll();

            } else {

                await logout();

            }

        } catch {

            // API errors are handled by Zustand.

        } finally {

            setActiveAction(null);

        }

    };


    return (

        <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">

            <h2 className="text-xl font-semibold text-white">
                Account Security
            </h2>

            <p className="mt-2 text-sm text-slate-400">
                Manage your authenticated sessions.
            </p>


            {error && (

                <div
                    role="alert"
                    className="mt-4 rounded-lg border border-red-800 bg-red-950/50 p-3 text-sm text-red-400"
                >
                    {error}
                </div>

            )}


            <div className="mt-6 space-y-6">

                {/* Current Session */}

                <div className="flex flex-wrap items-center justify-between gap-4">

                    <div>

                        <h3 className="font-medium text-white">
                            Current Session
                        </h3>

                        <p className="mt-1 text-sm text-slate-400">
                            Log out from this device.
                        </p>

                    </div>

                    <button
                        type="button"
                        disabled={isLoading}
                        onClick={() => handleLogout(false)}
                        className="flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm text-white hover:bg-slate-800 disabled:opacity-50"
                    >

                        {activeAction === "current"
                            ? <LoaderCircle size={18} className="animate-spin" />
                            : <LogOut size={18} />
                        }

                        Log Out

                    </button>

                </div>


                <div className="border-t border-slate-800" />


                {/* All Sessions */}

                <div className="flex flex-wrap items-center justify-between gap-4">

                    <div>

                        <h3 className="font-medium text-white">
                            All Devices
                        </h3>

                        <p className="mt-1 text-sm text-slate-400">
                            Revoke all refresh sessions associated
                            with your account.
                        </p>

                    </div>

                    <button
                        type="button"
                        disabled={isLoading}
                        onClick={() => handleLogout(true)}
                        className="flex items-center gap-2 rounded-lg border border-red-800 bg-red-950/40 px-4 py-2 text-sm text-red-400 hover:bg-red-950 disabled:opacity-50"
                    >

                        {activeAction === "all"
                            ? <LoaderCircle size={18} className="animate-spin" />
                            : <ShieldAlert size={18} />
                        }

                        Log Out All Devices

                    </button>

                </div>

            </div>

        </section>

    );

}

export default SessionActions;