import { LoaderCircle, Wallet } from "lucide-react";


function AppLoader() {

    return (

        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950">

            <div className="mb-6 flex items-center gap-3">

                <Wallet
                    size={40}
                    className="text-emerald-400"
                />

                <h1 className="text-4xl font-bold text-white">
                    FINORA
                </h1>

            </div>

            <LoaderCircle
                size={32}
                className="animate-spin text-emerald-400"
            />

            <p
                role="status"
                className="mt-4 text-slate-400"
            >
                Initializing your session...
            </p>

        </div>

    );

}

export default AppLoader;