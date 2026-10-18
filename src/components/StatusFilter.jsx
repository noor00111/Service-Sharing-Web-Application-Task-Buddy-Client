import { motion } from "framer-motion";
import { STATUSES, normalizeStatus } from "../utils/format";

const LABELS = { all: "All", pending: "Pending", working: "Working", completed: "Completed" };

const StatusFilter = ({ bookings, value, onChange, id }) => {
    const counts = bookings.reduce(
        (acc, b) => ({...acc,
            [normalizeStatus(b.serviceStatus)]: acc[normalizeStatus(b.serviceStatus)] + 1,
        }),
        { pending: 0, working: 0, completed: 0 }
    );
    const options = ["all", ...STATUSES];

    return (
        <div className="flex gap-1 overflow-x-auto rounded-lg border border-rule bg-card p-1"
            role="tablist"
            aria-label="Filter by status">
            {options.map((s) => {
                const active = value === s;
                const count = s === "all" ? bookings.length : counts[s];
                return (
                    <button
                        key={s}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => onChange(s)}
                        className={`relative flex shrink-0 items-center gap-2 rounded-md px-3.5 py-1.5 text-sm font-bold transition-colors ${active ? "text-paper" : "text-ink-soft hover:text-ink"}`}>
                        {active && (
                            <motion.span
                                layoutId={`status-filter-${id}`}
                                className="absolute inset-0 rounded-md bg-ink"
                                transition={{ type: "spring", stiffness: 500, damping: 38 }}
                            />
                        )}
                        <span className="relative">{LABELS[s]}</span>
                        <span
                            className={`relative font-mono text-[11px] ${active ? "text-paper/70" : "text-ink-soft/70"}`}>
                            {count}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};

export default StatusFilter;
