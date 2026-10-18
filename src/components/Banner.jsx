import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import groupStudy from "../assets/images/about.jpg";

const ease = [0.22, 1, 0.36, 1];
const SLIDE_MS = 6500;

const slides = [
    {
        image: groupStudy,
        alt: "A tutor leaning over three learners as they work at a desk",
        tab: "Learn",
        title: ["Book a skill from", "someone who has it."],
        body: "Web development, tutoring, design, writing and more, offered by real people in cities across Bangladesh.",
        cta: { to: "/services", label: "Browse services" },
        focus: "50% 35%",
    },
    {
        image: "https://i.ibb.co.com/H7mRptk/2148203776.jpg",
        alt: "A smiling learner with headphones taking notes beside a laptop",
        tab: "Book",
        title: ["Pick a date.", "Leave a note. Done."],
        body: "Your booking lands on the provider's desk as Pending, and you see every status change after that.",
        cta: { href: "#how-it-works", label: "See how a booking moves" },
        focus: "35% 30%",
    },
    {
        image: "https://i.ibb.co.com/PQYqBjC/2148756604.jpg",
        alt: "School supplies, a globe and a graduation cap laid out on a wooden desk",
        tab: "Teach",
        title: ["Teach what you know.", "Get booked for it."],
        body: "List a service with your price and area. Requests come to you, and you mark them Working and Completed.",
        cta: { to: "/AddService", label: "Offer a service" },
        focus: "50% 50%",
    },
];

const CtaButton = ({ cta }) => {
    const className =
        "group inline-flex h-12 items-center gap-2 rounded-md bg-[#F8B2B2] px-6 text-[15px] font-bold text-[#403D88] transition-colors hover:bg-white";
    const content = (
        <>
            {cta.label}
            <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" aria-hidden />
        </>
    );
    return cta.to ? (
        <Link to={cta.to} className={className}>
            {content}
        </Link>
    ) : (
        <a
            href={cta.href}
            className={className}
            onClick={(e) => {
                const target = document.querySelector(cta.href);
                if (!target) return;
                e.preventDefault();
                const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
            }}>
            {content}
        </a>
    );
};

const Banner = () => {
    const reduce = useReducedMotion();
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const slide = slides[index];

    const go = (i) => setIndex((i + slides.length) % slides.length);

    const onKeyDown = (e) => {
        if (e.key === "ArrowRight") go(index + 1);
        if (e.key === "ArrowLeft") go(index - 1);
    };

    return (
        <section className="px-3 pt-3 sm:px-4 sm:pt-4"
            aria-roledescription="carousel"
            aria-label="Task Buddy highlights">
            <h1 className="sr-only">Task Buddy: book skill services from providers across Bangladesh</h1>

            <div className="relative h-[min(86vh,720px)] min-h-[560px] overflow-hidden rounded-[22px] bg-[#403D88] sm:rounded-[28px]"
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
                onFocusCapture={() => setPaused(true)}
                onBlurCapture={() => setPaused(false)}
                onKeyDown={onKeyDown}>
                <AnimatePresence initial={false}>
                    <motion.div
                        key={index}
                        className="absolute inset-0"
                        style={{ zIndex: 1 }}
                        initial={reduce ? { opacity: 0 } : { clipPath: "inset(0 0 0 100%)" }}
                        animate={reduce ? { opacity: 1 } : { clipPath: "inset(0 0 0 0%)" }}
                        exit={{ zIndex: 0, transition: { duration: 1.1 } }}
                        transition={{ duration: 1.1, ease }}>
                        <motion.img
                            src={slide.image}
                            alt={slide.alt}
                            className="h-full w-full object-cover"
                            style={{ objectPosition: slide.focus }}
                            initial={{ scale: reduce ? 1 : 1.12 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: SLIDE_MS / 1000 + 1.5, ease: "linear" }}
                        />
                    </motion.div>
                </AnimatePresence>

                <div aria-hidden className="pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(0deg,rgba(64,61,136,0.96)_0%,rgba(64,61,136,0.7)_38%,rgba(139,99,155,0.25)_65%,rgba(64,61,136,0.15)_100%)] md:bg-[linear-gradient(90deg,rgba(64,61,136,0.95)_0%,rgba(64,61,136,0.78)_34%,rgba(175,113,157,0.3)_62%,rgba(248,178,178,0)_85%)]"/>
                <div className="absolute inset-x-0 bottom-0 z-[3] p-6 pb-28 sm:p-10 sm:pb-32 md:inset-y-0 md:flex md:max-w-[52rem] md:flex-col md:justify-center md:p-14 md:pb-14 lg:p-16">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={index}
                            initial="hidden"
                            animate="show"
                            exit="leave"
                            variants={{
                                show: { transition: { staggerChildren: 0.08, delayChildren: 0.25 } },
                                leave: { opacity: 0, y: -10, transition: { duration: 0.25 } },
                            }}
                            aria-live={paused ? "polite" : "off"}>
                            <h2 className="mt-5 font-display text-[clamp(2.3rem,4.7vw,4.35rem)] leading-[1.02] tracking-[-0.015em] text-white">
                                {slide.title.map((line, i) => (
                                    <span key={i} className="block overflow-hidden pb-[0.06em]">
                                        <motion.span
                                            className="inline-block"
                                            variants={{
                                                hidden: { y: "105%" },
                                                show: { y: 0, transition: { duration: 0.8, ease } },
                                            }}>
                                            {line}
                                        </motion.span>
                                    </span>
                                ))}
                            </h2>
                            <motion.p
                                className="mt-6 max-w-md text-lg leading-relaxed text-white/80"
                                variants={{
                                    hidden: { opacity: 0, y: 12 },
                                    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
                                }}>
                                {slide.body}
                            </motion.p>
                            <motion.div
                                className="mt-8 flex flex-wrap gap-3"
                                variants={{
                                    hidden: { opacity: 0, y: 12 },
                                    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
                                }}>
                                <CtaButton cta={slide.cta} />
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div
                    className="absolute bottom-5 left-6 right-6 z-[4] sm:bottom-8 sm:left-10 sm:right-10 md:left-auto md:right-8 lg:right-10"
                    role="tablist"
                    aria-label="Choose a slide">
                    <div className="flex gap-1.5 rounded-2xl bg-[#403D88]/55 p-1.5 shadow-[0_20px_40px_-20px_rgba(20,18,60,0.6)] backdrop-blur-md sm:gap-2">
                        {slides.map((s, i) => {
                            const active = i === index;
                            return (
                                <button
                                    key={s.tab}
                                    type="button"
                                    role="tab"
                                    aria-selected={active}
                                    aria-label={`Slide ${i + 1} of ${slides.length}: ${s.eyebrow}`}
                                    onClick={() => go(i)}
                                    className={`group flex-1 rounded-xl p-1.5 text-left transition-colors md:w-44 md:flex-none ${active ? "bg-white/15" : "hover:bg-white/10"}`}>
                                    <span className="hidden h-20 overflow-hidden rounded-lg md:block">
                                        <img
                                            src={s.image}
                                            alt=""
                                            className={`h-full w-full object-cover transition duration-500 ${active ? "" : "opacity-60 grayscale-[40%] group-hover:opacity-90"}`}
                                            style={{ objectPosition: s.focus }}
                                        />
                                    </span>
                                    <span className="flex items-center justify-between px-1 pb-1 pt-2">
                                        <span
                                            className={`font-mono text-[11px] font-medium uppercase tracking-[0.16em] ${active ? "text-white" : "text-white/60"}`}
                                        >
                                            {s.tab}
                                        </span>
                                        <span className="font-mono text-[10px] text-white/50">0{i + 1}</span>
                                    </span>
                                    <span className="mx-1 mb-1 block h-[3px] overflow-hidden rounded-full bg-white/20">
                                        {active && (
                                            <span
                                                key={index}
                                                className="block h-full origin-left rounded-full bg-gradient-to-r from-[#F8B2B2] to-[#AF719D]"
                                                style={
                                                    reduce
                                                        ? undefined
                                                        : {
                                                              animation: `tb-progress ${SLIDE_MS}ms linear forwards`,
                                                              animationPlayState: paused
                                                                  ? "paused"
                                                                  : "running",
                                                          }
                                                }
                                                onAnimationEnd={() => go(index + 1)}
                                            />
                                        )}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Banner;
