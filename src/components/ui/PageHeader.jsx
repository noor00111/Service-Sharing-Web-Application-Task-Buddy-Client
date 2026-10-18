import { motion } from "framer-motion";

const PageHeader = ({ eyebrow, title, children, aside }) => (
    <header className="tb-container pb-8 pt-12 md:pt-16">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
                {eyebrow && <p className="tb-eyebrow">{eyebrow}</p>}
                <h1 className="mt-2 font-display text-4xl leading-[1.05] md:text-5xl">{title}</h1>
                {children && <p className="mt-3 max-w-xl text-lg text-ink-soft">{children}</p>}
            </motion.div>
            {aside && <div className="shrink-0">{aside}</div>}
        </div>
    </header>
);

export default PageHeader;
