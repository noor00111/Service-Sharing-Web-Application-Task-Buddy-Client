import { Link } from "react-router-dom";
import { FaFacebook, FaLinkedin } from "react-icons/fa";
import { Wordmark } from "./Navbar";

const columns = [
    {
        title: "Explore",
        links: [
            { to: "/services", label: "All services" },
            { to: "/aboutus", label: "About" },
            { to: "/testimonials", label: "Testimonials" },
        ],
    },
    {
        title: "Your desk",
        links: [
            { to: "/bookedService", label: "My bookings" },
            { to: "/ServiceToDo", label: "Booking requests" },
            { to: "/AddService", label: "Add a service" },
        ],
    },
];

const Footer = () => {
    return (
        <footer className="mt-24 border-t border-rule bg-card/60">
            <div className="tb-container grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_auto]">
                <div className="max-w-xs">
                    <Wordmark />
                    <p className="mt-4 text-[15px] text-ink-soft">
                        Skill services from people across Bangladesh. Book one, leave a note, and follow it
                        until it&apos;s done.
                    </p>
                </div>

                {columns.map((col) => (
                    <div key={col.title}>
                        <h2 className="tb-eyebrow">{col.title}</h2>
                        <ul className="mt-4 space-y-2.5">
                            {col.links.map((l) => (
                                <li key={l.to}>
                                    <Link
                                        to={l.to}
                                        className="font-bold text-ink-soft transition-colors hover:text-ink"
                                    >
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}

                <div>
                    <h2 className="tb-eyebrow">Follow</h2>
                    <div className="mt-4 flex gap-2">
                        <a
                            href="https://www.linkedin.com/in/bris-ty-b09707262/"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Task Buddy on LinkedIn"
                            className="flex h-10 w-10 items-center justify-center rounded-md border border-rule text-ink-soft transition-colors hover:border-ink hover:text-ink"
                        >
                            <FaLinkedin size={18} />
                        </a>
                        <a
                            href="https://www.linkedin.com/in/bris-ty-b09707262/"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Task Buddy on Facebook"
                            className="flex h-10 w-10 items-center justify-center rounded-md border border-rule text-ink-soft transition-colors hover:border-ink hover:text-ink"
                        >
                            <FaFacebook size={18} />
                        </a>
                    </div>
                </div>
            </div>

            <div className="border-t border-dashed border-rule">
                <div className="tb-container flex flex-col gap-2 py-5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft sm:flex-row sm:justify-between">
                    <p>© {new Date().getFullYear()} Task Buddy</p>
                    <p>Made with care by the Task Buddy team</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
