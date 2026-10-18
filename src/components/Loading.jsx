import { motion } from "framer-motion";

const Loading = ({ label = "Loading" }) => {
    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5"
            role="status"
            aria-live="polite">
            <div className="flex gap-2" aria-hidden>
                {[0, 1, 2].map((i) => (
                    <motion.span
                        key={i}
                        className={`h-3 w-3 rounded-full ${["bg-stamp", "bg-plum", "bg-deep"][i]}`}
                        animate={{ y: [0, -8, 0], scale: [1, 0.85, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.14, ease: "easeInOut" }}
                    />
                ))}
            </div>
            <p className="tb-eyebrow">{label}…</p>
        </div>
    );
};

export default Loading;
