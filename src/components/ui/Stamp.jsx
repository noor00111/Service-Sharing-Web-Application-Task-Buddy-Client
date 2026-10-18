import { AnimatePresence, motion } from "framer-motion";
import { normalizeStatus } from "../../utils/format";

const INK = {
    pending: "text-stamp",
    working: "text-plum",
    completed: "text-deep",
};

const SIZE = {
    sm: "px-2.5 py-1.5 text-[10px]",
    md: "px-3.5 py-2 text-xs",
    lg: "px-5 py-3 text-base",
};

const Stamp = ({ status, label, size = "md", tilt = -7, className = "", stampIn = false, delay = 0 }) => {
    const key = normalizeStatus(status);
    const text = label || key;

    return (
        <span className={`relative inline-grid ${className}`} aria-label={`Status: ${text}`} role="img">
            <AnimatePresence mode="popLayout" initial={stampIn}>
                <motion.span
                    key={text}
                    className={`tb-stamp ${INK[key]} ${SIZE[size]}`}
                    initial={{ scale: 1.9, opacity: 0, rotate: tilt - 10 }}
                    animate={{ scale: 1, opacity: 0.92, rotate: tilt }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.12 } }}
                    transition={{ type: "spring", stiffness: 560, damping: 24, mass: 0.7, delay }}
                >
                    {text}
                </motion.span>
            </AnimatePresence>
        </span>
    );
};

export default Stamp;
