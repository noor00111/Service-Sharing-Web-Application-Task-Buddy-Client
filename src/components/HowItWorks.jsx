import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useScroll, useSpring } from "framer-motion";
import Stamp from "./ui/Stamp";
import StatusTrack from "./ui/StatusTrack";

const ease = [0.22, 1, 0.36, 1];

const stages = [
    {
        tag: "Browsing",
        title: "You find a service",
        body: "Search by skill, city or provider. The price in BDT and the person offering it are on every card.",
        log: "You’re looking at Web Development",
    },
    {
        tag: "Requested",
        title: "You pick a date and leave a note",
        body: "Tell the provider what you need. The booking goes straight to their desk, stamped Pending.",
        log: "Sent to Ayesha · Pending",
    },
    {
        tag: "In progress",
        title: "The provider gets to work",
        body: "When Ayesha starts, she switches the slip to Working. You see the change on My bookings.",
        log: "Ayesha marked it Working",
    },
    {
        tag: "Done",
        title: "It’s stamped Completed",
        body: "Finished work gets the last stamp. Both of you keep the slip as a record of the booking.",
        log: "Ayesha marked it Completed",
    },
];

const STATUS_FOR_STAGE = [null, "pending", "working", "completed"];

const Blank = ({ label }) => (
    <span className="inline-block min-w-[7rem] border-b border-dashed border-ink/25 text-right font-mono text-[11px] font-normal text-ink-soft/70">
        {label}
    </span>
);

const JourneySlip = ({ stage }) => {
    const status = STATUS_FOR_STAGE[stage];
    const booked = stage >= 1;

    return (
        <div className="tb-slip text-ink shadow-[0_40px_80px_-36px_rgb(var(--ink)/0.4)]">
            <div className="flex items-center justify-between px-6 pt-5">
                <p className="tb-eyebrow">Booking slip</p>
                <p className="font-mono text-[11px] text-ink-soft">No. 04B7C</p>
            </div>

            <div className="px-6 pb-6 pt-3">
                <p className="font-display text-2xl leading-tight">Web Development</p>
                <dl className="mt-4 space-y-2.5 text-sm">
                    <div className="flex justify-between gap-4 border-b border-dotted border-rule pb-2">
                        <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-soft">
                            Provider
                        </dt>
                        <dd className="font-bold">Ayesha Islam</dd>
                    </div>
                    <div className="flex justify-between gap-4 border-b border-dotted border-rule pb-2">
                        <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-soft">
                            Area
                        </dt>
                        <dd className="text-right font-bold">Dhaka Metropolitan Region</dd>
                    </div>
                    <div className="flex items-end justify-between gap-4 border-b border-dotted border-rule pb-2">
                        <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-soft">
                            Date
                        </dt>
                        <dd className="font-bold">
                            <AnimatePresence mode="wait" initial={false}>
                                {booked ? (
                                    <motion.span
                                        key="d"
                                        className="inline-block"
                                        initial={{ opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}>
                                        Sat, 14 Nov
                                    </motion.span>
                                ) : (
                                    <motion.span
                                        key="b"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}>
                                        <Blank label="pick a date" />
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </dd>
                    </div>
                </dl>

                <div className="relative mt-4 min-h-[2.75rem] border-l-2 border-marker pl-3">
                    <motion.p
                        className="text-[15px] italic text-ink-soft"
                        initial={false}
                        animate={{ clipPath: booked ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)" }}
                        transition={{ duration: booked ? 1.1 : 0.3, ease: "easeInOut" }}>
                        “A portfolio site with a blog section, please.”
                    </motion.p>
                    {!booked && (
                        <span className="absolute left-3 top-1 font-mono text-[11px] text-ink-soft/60">
                            Your note goes here
                        </span>
                    )}
                </div>
            </div>

            <div className="tb-perf px-6 pb-6 pt-6">
                <div className="flex min-h-[3.5rem] items-end justify-between gap-4">
                    <div>
                        <p className="tb-eyebrow">Price</p>
                        <p className="mt-1 font-mono text-2xl font-semibold">
                            5,500 <span className="text-xs text-ink-soft">BDT</span>
                        </p>
                    </div>
                    {status ? (
                        <Stamp status={status} size="lg" stampIn delay={0.15} />
                    ) : (
                        <span className="rounded-[5px] border-2 border-dashed border-rule px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft/70">
                            Not booked
                        </span>
                    )}
                </div>
                <div className={`mt-6 transition-opacity duration-500 ${booked ? "opacity-100" : "opacity-40"}`}>
                    <StatusTrack status={status || "pending"} />
                </div>
            </div>

            <div className="flex items-center gap-2.5 rounded-b-xl border-t border-rule bg-paper/70 px-6 py-3.5">
                <span className="relative flex h-2 w-2" aria-hidden>
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-stamp opacity-60 motion-reduce:animate-none" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-stamp" />
                </span>
                <AnimatePresence mode="wait" initial={false}>
                    <motion.p
                        key={stage}
                        className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-soft"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.25 }}
                    >
                        {stages[stage].log}
                    </motion.p>
                </AnimatePresence>
            </div>
        </div>
    );
};

const StageBlock = ({ stage, index, active, onActive }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { margin: "-48% 0px -48% 0px" });

    useEffect(() => {
        if (inView) onActive(index);
    }, [inView, index, onActive]);

    return (
        <li ref={ref} className="flex min-h-[58vh] items-center">
            <motion.div
                aria-current={active ? "step" : undefined}
                animate={{ opacity: active ? 1 : 0.35, x: active ? 0 : -6 }}
                whileHover={{ opacity: active ? 1 : 0.6 }}
                transition={{ duration: 0.45, ease }}>
                <span className={`inline-flex items-center rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors ${active ? "border-ink bg-ink text-paper" : "border-rule text-ink-soft"}`}>
                    {stage.tag}
                </span>
                <h3 className="mt-5 font-display text-[clamp(2rem,3.4vw,3rem)] leading-[1.05] text-ink">
                    {stage.title}
                </h3>
                <p className="mt-4 max-w-md text-lg leading-relaxed text-ink-soft">{stage.body}</p>
            </motion.div>
        </li>
    );
};

const HowItWorks = () => {
    const [stage, setStage] = useState(0);
    const listRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: listRef, offset: ["start center", "end center"] });
    const rail = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

    return (
        <section id="how-it-works" className="scroll-mt-16" aria-labelledby="how-title">
            <div className="tb-container py-16 md:py-24">
                <div className="max-w-2xl">
                    <p className="flex items-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-plum">
                        <span className="h-px w-8 bg-stamp" aria-hidden /> How a booking moves
                    </p>
                    <h2 id="how-title"
                        className="mt-4 font-display text-4xl leading-[1.05] text-ink md:text-[3.25rem]">
                        Follow one slip from request to done.
                    </h2>
                    <p className="mt-4 max-w-lg text-lg text-ink-soft">
                        The slip below is what you and the provider both see. Watch it fill in as the booking
                        moves along.
                    </p>
                </div>

                <div className="mt-10 lg:hidden">
                    <div className="flex gap-2 overflow-x-auto pb-1"
                        role="tablist"
                        aria-label="Booking stages">
                        {stages.map((s, i) => (
                            <button
                                key={s.tag}
                                type="button"
                                role="tab"
                                id={`stage-tab-${i}`}
                                aria-selected={stage === i}
                                aria-controls="stage-panel"
                                onClick={() => setStage(i)}
                                className={`shrink-0 rounded-full border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors ${stage === i ? "border-ink bg-ink text-paper" : "border-rule text-ink-soft hover:border-ink/40 hover:text-ink"}`}>
                                {s.tag}
                            </button>
                        ))}
                    </div>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={stage}
                            id="stage-panel"
                            role="tabpanel"
                            aria-labelledby={`stage-tab-${stage}`}
                            className="mt-6"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.25 }}>
                            <h3 className="font-display text-3xl leading-tight text-ink">
                                {stages[stage].title}
                            </h3>
                            <p className="mt-3 text-ink-soft">{stages[stage].body}</p>
                        </motion.div>
                    </AnimatePresence>
                    <div className="mx-auto mt-8 max-w-md">
                        <JourneySlip stage={stage} />
                    </div>
                </div>

                <div className="mt-6 hidden gap-16 lg:grid lg:grid-cols-[minmax(0,1fr)_420px]">
                    <div className="relative pl-10">
                        <div
                            aria-hidden
                            className="absolute bottom-[29vh] left-0 top-[29vh] w-[3px] overflow-hidden rounded-full bg-rule">
                            <motion.div
                                className="h-full w-full origin-top rounded-full bg-gradient-to-b from-[#F8B2B2] via-[#AF719D] to-[#8B639B]"
                                style={{ scaleY: rail }}
                            />
                        </div>
                        <ol ref={listRef}>
                            {stages.map((s, i) => (
                                <StageBlock
                                    key={s.tag}
                                    stage={s}
                                    index={i}
                                    active={stage === i}
                                    onActive={setStage}
                                />
                            ))}
                        </ol>
                    </div>
                    <div className="relative">
                        <div className="sticky top-[calc(50vh-17rem)]">
                            <motion.div
                                initial={{ opacity: 0, y: 30, rotate: 3 }}
                                whileInView={{ opacity: 1, y: 0, rotate: 1.5 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.8, ease }}>
                                <JourneySlip stage={stage} />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
