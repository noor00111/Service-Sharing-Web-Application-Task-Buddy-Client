import { motion } from "framer-motion";
import { STATUSES, normalizeStatus } from "../../utils/format";

const DOT = {
    pending: "bg-stamp",
    working: "bg-plum",
    completed: "bg-deep",
};

const StatusTrack = ({ status, className = "" }) => {
    const current = STATUSES.indexOf(normalizeStatus(status));

    return (
        <div className={`w-full ${className}`}>
            <div className="relative mx-[5px] h-[2px] rounded bg-rule">
                <motion.div
                    className={`absolute inset-y-0 left-0 origin-left rounded ${DOT[STATUSES[current]]}`}
                    initial={false}
                    animate={{ width: `${(current / (STATUSES.length - 1)) * 100}%` }}
                    transition={{ type: "spring", stiffness: 160, damping: 26 }}
                />
                {STATUSES.map((s, i) => (
                    <motion.span
                        key={s}
                        className={`absolute top-1/2 h-[10px] w-[10px] rounded-full border-2 border-card ${i <= current ? DOT[STATUSES[current]] : "bg-rule"}`}
                        style={{ left: `${(i / (STATUSES.length - 1)) * 100}%`, x: "-50%", y: "-50%" }}
                        initial={false}
                        animate={{ scale: i === current ? 1.25 : 1 }}
                    />
                ))}
            </div>
            <div className="mt-2.5 flex justify-between font-mono text-[10px] uppercase tracking-[0.14em]">
                {STATUSES.map((s, i) => (
                    <span key={s} className={i === current ? "font-semibold text-ink" : "text-ink-soft/70"}>
                        {s}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default StatusTrack;
