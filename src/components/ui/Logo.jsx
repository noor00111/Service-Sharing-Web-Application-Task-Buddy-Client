import { motion } from "framer-motion";
import { LuTicketCheck } from "react-icons/lu";

const LogoMark = ({ className = "h-9 w-9" }) => (
    <span
        className={`${className} inline-flex shrink-0 items-center justify-center rounded-lg bg-ink text-paper`}
        aria-hidden
    >
        <motion.span
            className="inline-flex"
            variants={{ rest: { rotate: -10, scale: 1 }, hover: { rotate: 0, scale: 1.1 } }}
            transition={{ type: "spring", stiffness: 420, damping: 16 }}
        >
            <LuTicketCheck size={20} strokeWidth={2.2} />
        </motion.span>
    </span>
);

export default LogoMark;
