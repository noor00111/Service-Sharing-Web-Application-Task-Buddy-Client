import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoAdd } from "react-icons/io5";

const dataFAQ = [
    {
        que: "What services does Task Buddy offer?",
        ans: "Skill and learning services: web and app development, design, writing, marketing, data analysis, tutoring and more. Each one is listed by the person who provides it, with their price and service area.",
    },
    {
        que: "How do I book a service?",
        ans: "Open a service, choose Book this service, pick a date and add any notes. Your booking shows up on My bookings as Pending until the provider starts.",
    },
    {
        que: "How do I know when the provider has started?",
        ans: "The provider changes the status from their Booking requests page. You'll see it move from Pending to Working to Completed on My bookings.",
    },
    {
        que: "Is there a refund policy?",
        ans: "Yes, refunds are available under specific conditions. Read the terms and conditions for the details.",
    },
    {
        que: "Can I ask for something tailored to me?",
        ans: "Yes. Use the note field when you book to describe what you need. The provider reads it before starting.",
    },
    {
        que: "How do I contact support?",
        ans: "Email support@taskbuddy.com and the team will reply.",
    },
];

const FAQ = () => {
    const [selected, setSelected] = useState(0);

    return (
        <section className="tb-container grid gap-10 py-16 lg:grid-cols-[0.8fr_1.2fr]"
            aria-labelledby="faq-title">
            <div>
                <h2 id="faq-title" className="mt-2 font-display text-4xl leading-tight md:text-[2.75rem]">
                    Questions Before You Book{" "}
                </h2>
                <p className="mt-3 max-w-sm text-ink-soft">
                    Something else? Email{" "}
                    <a className="font-bold text-plum underline-offset-4 hover:underline"
                        href="mailto:support@taskbuddy.com">
                        support@taskbuddy.com
                    </a>
                    .
                </p>
            </div>

            <ul className="border-t border-rule">
                {dataFAQ.map((faq, idx) => {
                    const open = selected === idx;
                    return (
                        <li key={idx} className="border-b border-rule">
                            <h3>
                                <button
                                    type="button"
                                    id={`faq-q-${idx}`}
                                    aria-expanded={open}
                                    aria-controls={`faq-a-${idx}`}
                                    onClick={() => setSelected(open ? null : idx)}
                                    className="flex w-full items-center justify-between gap-6 py-5 text-left text-lg font-bold transition-colors hover:text-plum">
                                    {faq.que}
                                    <motion.span
                                        animate={{ rotate: open ? 45 : 0 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 28 }}
                                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${open ? "border-stamp bg-stamp text-paper" : "border-rule text-ink-soft"}`}
                                        aria-hidden>
                                        <IoAdd size={18} />
                                    </motion.span>
                                </button>
                            </h3>
                            <AnimatePresence initial={false}>
                                {open && (
                                    <motion.div
                                        id={`faq-a-${idx}`}
                                        role="region"
                                        aria-labelledby={`faq-q-${idx}`}
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                                        className="overflow-hidden">
                                        <p className="max-w-2xl pb-6 pr-12 leading-relaxed text-ink-soft">
                                            {faq.ans}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
};

export default FAQ;
