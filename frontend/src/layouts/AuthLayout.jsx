import { Link } from "react-router-dom";
import { Wallet } from "lucide-react";

function AuthLayout({ title, subtitle, children }) {

    return (

        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-10">

            <div className="w-full max-w-md">

                <Link
                    to="/"
                    className="flex items-center justify-center gap-2 mb-8"
                >
                    <Wallet
                        className="text-emerald-400"
                        size={32}
                    />

                    <span className="text-3xl font-bold text-white">
                        FINORA
                    </span>

                </Link>

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">

                    <h1 className="text-2xl font-bold text-white">
                        {title}
                    </h1>

                    <p className="mt-2 mb-6 text-sm text-slate-400">
                        {subtitle}
                    </p>

                    {children}

                </div>

                <p className="mt-6 text-center text-sm text-slate-500">
                    Intelligent Personal Finance Management
                </p>

            </div>

        </div>

    );

}

export default AuthLayout;