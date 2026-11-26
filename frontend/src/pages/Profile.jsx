import { useState } from "react";

import { UserRound, RefreshCw } from "lucide-react";

import useAuthStore from "../store/authStore";

import { getMeAPI } from "../api/auth.api";

import { getErrorMessage } from "../utils/getErrorMessage";


function Profile() {

    const user = useAuthStore((state) => state.user);

    const setUser = useAuthStore((state) => state.setUser);

    const [isRefreshing, setIsRefreshing] = useState(false);

    const [error, setError] = useState("");


    const refreshProfile = async () => {

        if (isRefreshing) return;

        setIsRefreshing(true);
        setError("");

        try {

            const response = await getMeAPI();

            setUser(response.data);

        } catch (error) {

            setError(getErrorMessage(error));

        } finally {

            setIsRefreshing(false);

        }

    };


    const profileFields = [
        {
            label: "Full Name",
            value: user?.name
        },
        {
            label: "Email Address",
            value: user?.email
        },
        {
            label: "Account Role",
            value: user?.role
        },
        {
            label: "Preferred Currency",
            value: user?.currency
        },
        {
            label: "Timezone",
            value: user?.timezone
        },
        {
            label: "Email Verification",
            value: user?.isEmailVerified
                ? "Verified"
                : "Not verified"
        },
        {
            label: "Account Status",
            value: user?.isActive
                ? "Active"
                : "Inactive"
        },
        {
            label: "Member Since",
            value: user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-IN")
                : "-"
        }
    ];


    return (

        <div className="mx-auto max-w-4xl space-y-6">

            <div>

                <h1 className="text-3xl font-bold">
                    My Profile
                </h1>

                <p className="mt-2 text-slate-400">
                    View your account information and preferences.
                </p>

            </div>


            {error && (

                <div
                    role="alert"
                    className="rounded-lg border border-red-800 bg-red-950/50 p-4 text-red-400"
                >
                    {error}
                </div>

            )}


            <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">

                <div className="flex flex-wrap items-center justify-between gap-4">

                    <div className="flex items-center gap-4">

                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">

                            <UserRound size={32} />

                        </div>

                        <div>

                            <h2 className="text-xl font-semibold">
                                {user?.name}
                            </h2>

                            <p className="text-sm text-slate-400">
                                {user?.email}
                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        onClick={refreshProfile}
                        disabled={isRefreshing}
                        className="flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm hover:bg-slate-800 disabled:opacity-50"
                    >

                        <RefreshCw
                            size={16}
                            className={isRefreshing ? "animate-spin" : ""}
                        />

                        Refresh Profile

                    </button>

                </div>


                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">

                    {profileFields.map((field) => (

                        <div key={field.label}>

                            <p className="text-sm text-slate-400">
                                {field.label}
                            </p>

                            <p className="mt-2 break-words font-medium text-white">
                                {field.value || "-"}
                            </p>

                        </div>

                    ))}

                </div>

            </section>

        </div>

    );

}

export default Profile;