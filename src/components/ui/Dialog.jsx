import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { IoClose } from "react-icons/io5";

const Dialog = ({ open, onClose, title, description, children, width = "max-w-lg" }) => {
    const titleId = useId();
    const panelRef = useRef(null);

    useEffect(() => {
        if (!open) return;
        const onKey = (e) => e.key === "Escape" && onClose();
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        document.addEventListener("keydown", onKey);
        const t = setTimeout(() => {
            panelRef.current?.querySelector("input, textarea, button:not([data-close])")?.focus();
        }, 60);
        return () => {
            document.body.style.overflow = prevOverflow;
            document.removeEventListener("keydown", onKey);
            clearTimeout(t);
        };
    }, [open, onClose]);

    return createPortal(
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-4">
                    <motion.div
                        className="absolute inset-0 bg-[#1A1838]/55 backdrop-blur-[2px]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                    <motion.div
                        ref={panelRef}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={titleId}
                        className={`tb-card relative w-full ${width} max-h-[90vh] overflow-y-auto rounded-b-none p-6 shadow-2xl sm:rounded-xl sm:p-7`}
                        initial={{ opacity: 0, y: 40, rotate: -1 }}
                        animate={{ opacity: 1, y: 0, rotate: 0 }}
                        exit={{ opacity: 0, y: 24, transition: { duration: 0.15 } }}
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    >
                        <button
                            data-close
                            type="button"
                            onClick={onClose}
                            aria-label="Close"
                            className="absolute right-4 top-4 rounded-md p-1.5 text-ink-soft transition-colors hover:bg-paper hover:text-ink"
                        >
                            <IoClose size={20} />
                        </button>
                        <h2 id={titleId} className="pr-8 font-display text-2xl">
                            {title}
                        </h2>
                        {description && <p className="mt-1.5 text-ink-soft">{description}</p>}
                        <div className="mt-6">{children}</div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default Dialog;
