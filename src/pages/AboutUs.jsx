import { motion } from "framer-motion";
import about from "../assets/images/about.jpg";

const aboutData = [
    {
        title: "Search that gets to the point",
        description: "Find a provider by skill, city or name, and sort by price.",
    },
    {
        title: "Booking in one form",
        description: "Pick a date, add a note, confirm. Your details are filled in for you.",
    },
    {
        title: "Your listings, your rules",
        description: "Add a service, edit its price or description, or remove it whenever you like.",
    },
    {
        title: "Status you can see",
        description: "Pending, Working, Completed. Both sides always see the same stamp.",
    },
];

const ease = [0.22, 1, 0.36, 1];

const AboutUs = () => {
    return (
        <div className="tb-container py-12 md:py-16">
            <div className="grid items-center gap-12 lg:grid-cols-2">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease }}>
                    <p className="tb-eyebrow">About Task Buddy</p>
                    <h1 className="mt-3 font-display text-4xl leading-[1.05] md:text-[3.25rem]">
                        A place to find people who can teach and help, and to book them simply.
                    </h1>
                    <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
                        Task Buddy connects learners with providers across Bangladesh: developers, designers,
                        writers, tutors and analysts who list their own services. We keep the booking part
                        simple so the time goes into the actual work.
                    </p>
                </motion.div>

                <motion.figure
                    className="relative"
                    initial={{ opacity: 0, rotate: 3, y: 20 }}
                    animate={{ opacity: 1, rotate: 1.5, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1, ease }}>
                    <div className="tb-slip p-3 shadow-[0_30px_60px_-30px_rgb(var(--ink)/0.45)]">
                        <img
                            src={about}
                            alt="Learners working together at a table"
                            className="aspect-[4/3] w-full rounded-lg object-cover"
                        />
                        <figcaption className="px-2 pb-1 pt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft">
                            Learning, booked
                        </figcaption>
                    </div>
                </motion.figure>
            </div>

            <section className="mt-24" aria-labelledby="what-title">
                <h2 id="what-title" className="font-display text-3xl">
                    What you can do here
                </h2>
                <motion.ul
                    className="mt-8 grid gap-px overflow-hidden rounded-xl border border-rule bg-rule sm:grid-cols-2"
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
                    {aboutData.map((item) => (
                        <motion.li
                            key={item.title}
                            className="bg-card p-7"
                            variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
                            <h3 className="text-lg font-bold">{item.title}</h3>
                            <p className="mt-2 text-ink-soft">{item.description}</p>
                        </motion.li>
                    ))}
                </motion.ul>
            </section>
        </div>
    );
};

export default AboutUs;
