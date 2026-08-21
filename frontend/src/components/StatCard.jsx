import { motion } from "framer-motion";

function StatCard({
    title,
    value,
    icon: Icon,
    description,
    iconStyle = "bg-green-100 text-green-700",
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-lg"
        >
            <div className="flex items-start justify-between">

                <div>
                    <p className="text-sm font-medium text-slate-500">
                        {title}
                    </p>

                    <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                        {value}
                    </h3>
                </div>

                <div className={`rounded-xl p-3 ${iconStyle}`}>
                    <Icon size={21} />
                </div>

            </div>

            {description && (
                <p className="mt-4 text-xs text-slate-400">
                    {description}
                </p>
            )}
        </motion.div>
    );
}

export default StatCard;