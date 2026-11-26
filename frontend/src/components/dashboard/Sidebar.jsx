import { NavLink } from "react-router-dom";

import {
    Wallet,
    LayoutDashboard,
    Landmark,
    ArrowLeftRight,
    Banknote,
    CalendarClock,
    CreditCard,
    ChartPie,
    FileText,
    Bot,
    UserRound,
    X
} from "lucide-react";


const navigation = [
    {
        name: "Overview",
        path: "/dashboard",
        icon: LayoutDashboard,
        available: true
    },
    {
        name: "Accounts",
        path: "/accounts",
        icon: Landmark
    },
    {
        name: "Transactions",
        path: "/transactions",
        icon: ArrowLeftRight
    },
    {
        name: "Loans",
        path: "/loans",
        icon: Banknote
    },
    {
        name: "EMI Management",
        path: "/emi",
        icon: CalendarClock
    },
    {
        name: "Credit Cards",
        path: "/credit-cards",
        icon: CreditCard
    },
    {
        name: "Budgets",
        path: "/budgets",
        icon: ChartPie
    },
    {
        name: "Documents",
        path: "/documents",
        icon: FileText
    },
    {
        name: "AI Assistant",
        path: "/assistant",
        icon: Bot
    },
    {
        name: "Profile",
        path: "/profile",
        icon: UserRound,
        available: true
    }
];


function Sidebar({ isOpen, onClose }) {

    return (

        <>

            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 lg:hidden"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-64
                    flex-col border-r border-slate-800 bg-slate-900
                    transition-transform duration-300
                    lg:translate-x-0
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                `}
            >

                <div className="flex h-20 items-center justify-between px-6">

                    <div className="flex items-center gap-3">

                        <Wallet
                            size={30}
                            className="text-emerald-400"
                        />

                        <span className="text-2xl font-bold text-white">
                            FINORA
                        </span>

                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close navigation"
                        className="text-slate-400 lg:hidden"
                    >
                        <X size={24} />
                    </button>

                </div>


                <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-4">

                    {navigation.map((item) => {

                        const Icon = item.icon;

                        if (!item.available) {

                            return (

                                <div
                                    key={item.path}
                                    aria-disabled="true"
                                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-500"
                                >

                                    <Icon size={20} />

                                    <span className="text-sm">
                                        {item.name}
                                    </span>

                                </div>

                            );

                        }

                        return (

                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={onClose}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition ${
                                        isActive
                                            ? "bg-emerald-500/10 text-emerald-400"
                                            : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                    }`
                                }
                            >

                                <Icon size={20} />

                                {item.name}

                            </NavLink>

                        );

                    })}

                </nav>


                <div className="border-t border-slate-800 p-5">

                    <p className="text-xs text-slate-500">
                        Intelligent Personal Finance
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                        FINORA
                    </p>

                </div>

            </aside>

        </>

    );

}

export default Sidebar;