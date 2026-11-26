function SummaryCard({
    title,
    value,
    description,
    icon: Icon
}) {

    return (

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">

            <div className="flex items-center justify-between">

                <p className="text-sm text-slate-400">
                    {title}
                </p>

                <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400">

                    <Icon size={22} />

                </div>

            </div>

            <h3 className="mt-4 text-3xl font-bold text-white">
                {value}
            </h3>

            <p className="mt-2 text-xs text-slate-500">
                {description}
            </p>

        </div>

    );

}

export default SummaryCard;