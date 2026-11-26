import {
    Wallet,
    TrendingUp,
    TrendingDown,
    CalendarClock,
    ChartNoAxesCombined,
    Bot
} from "lucide-react";

import useAuthStore from "../store/authStore";

import SummaryCard from "../components/dashboard/SummaryCard";


function Dashboard() {

    const user = useAuthStore((state) => state.user);

    return (

        <div className="space-y-8">

            <div>

                <h1 className="text-3xl font-bold text-white">
                    Welcome, {user?.name?.split(" ")[0]}
                </h1>

                <p className="mt-2 text-slate-400">
                    Here is your personal financial overview.
                </p>

            </div>


            {/* Financial Summary */}

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

                <SummaryCard
                    title="Total Balance"
                    value="—"
                    description="Connect or create an account"
                    icon={Wallet}
                />

                <SummaryCard
                    title="Monthly Income"
                    value="—"
                    description="No income records yet"
                    icon={TrendingUp}
                />

                <SummaryCard
                    title="Monthly Expenses"
                    value="—"
                    description="No expense records yet"
                    icon={TrendingDown}
                />

                <SummaryCard
                    title="Upcoming EMIs"
                    value="—"
                    description="No EMI records yet"
                    icon={CalendarClock}
                />

            </div>


            {/* Analytics and AI Insights */}

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

                <section className="rounded-xl border border-slate-800 bg-slate-900 p-6 xl:col-span-2">

                    <h2 className="text-xl font-semibold">
                        Financial Analytics
                    </h2>

                    <div className="flex min-h-64 flex-col items-center justify-center text-slate-500">

                        <ChartNoAxesCombined size={48} />

                        <p className="mt-4">
                            Your financial analytics will appear here.
                        </p>

                    </div>

                </section>


                <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">

                    <div className="flex items-center gap-2">

                        <Bot className="text-emerald-400" />

                        <h2 className="text-xl font-semibold">
                            AI Insights
                        </h2>

                    </div>

                    <div className="flex min-h-64 flex-col items-center justify-center text-center text-slate-500">

                        <Bot size={48} />

                        <p className="mt-4">
                            Personalized financial insights will
                            appear after the AI modules are integrated.
                        </p>

                    </div>

                </section>

            </div>


            {/* Recent Transactions */}

            <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">

                <h2 className="text-xl font-semibold">
                    Recent Transactions
                </h2>

                <div className="py-12 text-center text-slate-500">
                    No transaction records available.
                </div>

            </section>

        </div>

    );

}

export default Dashboard;