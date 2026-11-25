import { Link } from "react-router-dom";

function Home() {
    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center">

            <h1 className="text-5xl font-bold text-emerald-400">
                FINORA
            </h1>

            <p className="mt-4 text-slate-300 text-center">
                AI-Powered Personal Finance and
                Intelligent Debt Management
            </p>

            <Link
                to="/dashboard"
                className="mt-8 bg-emerald-500 px-6 py-3 rounded-lg text-white"
            >
                Get Started
            </Link>

        </div>
    );
}

export default Home;