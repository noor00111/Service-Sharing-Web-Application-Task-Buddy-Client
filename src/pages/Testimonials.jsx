import { motion } from "framer-motion";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import Avatar from "../components/ui/Avatar";

const testimonials = [
    {
        name: "Alex",
        role: "Manager, IIT Docs",
        image: "https://i.ibb.co.com/JRHXpS8j/young-smiling-office-worker-man-headphones-optical-glasses-sits-desk-with-office-tools-using-laptop.jpg",
        rating: 4.5,
        feedback: "Task Buddy played a vital role in guiding us through a crucial phase of development. Their insights and strategic approach were instrumental in our success.",
    },
    {
        name: "Doremon",
        role: "Manager, IIT Docs",
        image: "https://i.ibb.co.com/XfHw7yk6/teenage-student-glasses-headphones-sitting-table-classroom.jpg",
        rating: 4,
        feedback: "Partnering with Task Buddy helped us overcome complex challenges with confidence. Their team's dedication and deep understanding provided us with the clarity needed for growth.",
    },
    {
        name: "Sultan",
        role: "Manager, IIT Docs",
        image: "https://i.ibb.co.com/ccvJFpvc/c.jpg",
        rating: 5,
        feedback: "We engaged with Task Buddy to help us navigate a challenging period of growth and expansion. Their team provided invaluable insights, strategic guidance.",
    },
];

const Stars = ({ rating }) => (
    <div className="flex items-center gap-2" aria-label={`Rated ${rating} out of 5`}>
        <div className="flex gap-0.5 text-stamp" aria-hidden>
            {Array.from({ length: 5 }, (_, i) => {
                if (rating >= i + 1) return <FaStar key={i} size={15} />;
                if (rating > i) return <FaStarHalfAlt key={i} size={15} />;
                return <FaRegStar key={i} size={15} className="text-rule" />;
            })}
        </div>
        <span className="font-mono text-xs text-ink-soft">{rating} / 5</span>
    </div>
);

const Testimonials = () => {
    return (
        <div className="tb-container py-12 md:py-16">
            <p className="tb-eyebrow">Testimonials</p>
            <h1 className="mt-2 max-w-2xl font-display text-4xl leading-[1.05] md:text-5xl">
                What people say after the work is done
            </h1>

            <motion.div
                className="mt-12 grid gap-6 md:grid-cols-3"
                initial="hidden"
                animate="show"
                variants={{ show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } }}>
                {testimonials.map((t, i) => (
                    <motion.figure
                        key={t.name}
                        className="tb-slip flex flex-col p-7"
                        variants={{
                            hidden: { opacity: 0, y: 20, rotate: 0 },
                            show: {
                                opacity: 1,
                                y: 0,
                                rotate: [-1, 0.75, -0.5][i],
                                transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
                            },
                        }}
                        whileHover={{ rotate: 0, y: -4 }}>
                        <span aria-hidden className="font-display text-6xl leading-none text-stamp/40">
                            “
                        </span>
                        <blockquote className="-mt-4 flex-1 text-[17px] leading-relaxed">
                            {t.feedback}
                        </blockquote>
                        <figcaption className="mt-7 flex items-center gap-3 border-t border-dashed border-rule pt-5">
                            <Avatar src={t.image} name={t.name} size="h-12 w-12" />
                            <div className="min-w-0 flex-1">
                                <p className="font-bold">{t.name}</p>
                                <p className="text-sm text-ink-soft">{t.role}</p>
                            </div>
                        </figcaption>
                        <div className="mt-4">
                            <Stars rating={t.rating} />
                        </div>
                    </motion.figure>
                ))}
            </motion.div>
        </div>
    );
};

export default Testimonials;
