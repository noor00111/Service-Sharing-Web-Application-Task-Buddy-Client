import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

const sides = [
    {
        who: "If you want to learn",
        title: "Book the help you need",
        points: [
            "Browse every service in one list",
            "Sort by price, search by skill",
            "Track each booking's status",
        ],
        cta: { to: "/services", label: "Browse services" },
        tone: "bg-card",
    },
    {
        who: "If you can teach",
        title: "List what you offer",
        points: [
            "Add a service with your price and area",
            "See every booking request in one place",
            "Mark work as Working or Completed",
        ],
        cta: { to: "/AddService", label: "Add a service" },
        tone: "bg-ink text-paper",
    },
];

const TwoSides = () => (
    <section className="tb-container py-20" aria-label="For learners and providers">
        <div className="grid gap-6 md:grid-cols-2">
            {sides.map((s, i) => (
                <motion.div
                    key={s.who}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className={`rounded-2xl border border-rule p-8 md:p-10 ${s.tone}`}>
                    <p className={`font-mono text-[11px] font-medium uppercase tracking-[0.18em] ${i ? "text-paper/70" : "text-ink-soft"}`}>
                        {s.who}
                    </p>
                    <h2 className="mt-3 font-display text-3xl">{s.title}</h2>
                    <ul className="mt-6 space-y-3">
                        {s.points.map((p) => (
                            <li key={p} className="flex gap-3">
                                <span
                                    aria-hidden
                                    className={`mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full ${i ? "bg-marker" : "bg-stamp"}`}
                                />
                                <span className={i ? "text-paper/85" : "text-ink-soft"}>{p}</span>
                            </li>
                        ))}
                    </ul>
                    <Link to={s.cta.to}
                        className={`group mt-8 inline-flex h-11 items-center gap-2 rounded-md px-5 text-sm font-bold transition-colors ${i ? "bg-paper text-ink hover:bg-marker hover:text-[#403D88]" : "bg-ink text-paper hover:bg-stamp"}`}>
                        {s.cta.label}
                        <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
                    </Link>
                </motion.div>
            ))}
        </div>
    </section>
);

export default TwoSides;
