import { Menu, UserRound } from "lucide-react";

import { Link } from "react-router-dom";

import useAuthStore from "../../store/authStore";


function Header({ onMenuClick }) {

    const user = useAuthStore((state) => state.user);

    return (

        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-800 bg-slate-900 px-4 sm:px-6">

            <div className="flex items-center gap-4">

                <button
                    type="button"
                    onClick={onMenuClick}
                    aria-label="Open navigation"
                    className="text-slate-300 lg:hidden"
                >
                    <Menu size={25} />
                </button>

                <div>

                    <h2 className="font-semibold text-white">
                        Financial Workspace
                    </h2>

                    <p className="hidden text-xs text-slate-400 sm:block">
                        Manage your finances intelligently
                    </p>

                </div>

            </div>


            <Link
                to="/profile"
                className="flex items-center gap-3"
            >

                <div className="hidden text-right sm:block">

                    <p className="text-sm font-medium text-white">
                        {user?.name}
                    </p>

                    <p className="text-xs text-slate-400">
                        {user?.email}
                    </p>

                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">

                    <UserRound size={22} />

                </div>

            </Link>

        </header>

    );

}

export default Header;