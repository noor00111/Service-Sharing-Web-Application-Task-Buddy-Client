import { useContext, useEffect, useRef, useState } from "react";
import AuthContext from "../context/AuthContext";
import { Link, NavLink, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";
import { IoChevronDown, IoMenu, IoClose, IoMoonOutline, IoSunnyOutline } from "react-icons/io5";
import { useTheme } from "../context/ThemeContext";
import Avatar from "../components/ui/Avatar";
import LogoMark from "../components/ui/Logo";

const MotionLink = motion.create(Link);

const mainLinks = [
    { to: "/", label: "Home" },
    { to: "/services", label: "Services" },
    { to: "/aboutus", label: "About" },
    { to: "/testimonials", label: "Testimonials" },
];

const dashboardLinks = [
    { to: "/AddService", label: "Add a service", hint: "List something you offer" },
    { to: "/ManageServices", label: "Manage services", hint: "Edit or remove your listings" },
    { to: "/bookedService", label: "My bookings", hint: "Sessions you have booked" },
    { to: "/ServiceToDo", label: "Booking requests", hint: "Update status for your learners" },
];

export const Wordmark = () => (
    <MotionLink
        to="/"
        className="flex items-center gap-2"
        aria-label="Task Buddy home"
        initial="rest"
        animate="rest"
        whileHover="hover"
    >
        <LogoMark />
        <span className="font-display text-[1.35rem] leading-none tracking-[-0.01em]">Task Buddy</span>
    </MotionLink>
);

const Navbar = () => {
    const { user, userSignOut } = useContext(AuthContext);
    const { dark, toggleTheme } = useTheme();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [dashOpen, setDashOpen] = useState(false);
    const dashRef = useRef(null);

    useEffect(() => {
        setMenuOpen(false);
        setDashOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        if (!dashOpen) return;
        const onDown = (e) => !dashRef.current?.contains(e.target) && setDashOpen(false);
        const onKey = (e) => e.key === "Escape" && setDashOpen(false);
        document.addEventListener("pointerdown", onDown);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("pointerdown", onDown);
            document.removeEventListener("keydown", onKey);
        };
    }, [dashOpen]);

    const handleSignOutUser = () => {
        userSignOut()
            .then(() => toast.success("Signed out"))
            .catch(() => toast.error("Couldn't sign out. Try again."));
    };

    const dashActive = dashboardLinks.some((l) => location.pathname.toLowerCase() === l.to.toLowerCase());

    return (
        <header className="sticky top-0 z-50 border-b border-rule bg-paper/85 backdrop-blur-md">
            <div className="tb-container flex h-16 items-center justify-between gap-4">
                <Wordmark />

                <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
                    {mainLinks.map((l) => (
                        <NavLink
                            key={l.to}
                            to={l.to}
                            end
                            className="relative px-3.5 py-2 text-[15px] font-bold"
                        >
                            {({ isActive }) => (
                                <>
                                    <span
                                        className={
                                            isActive
                                                ? "text-ink"
                                                : "text-ink-soft transition-colors hover:text-ink"
                                        }
                                    >
                                        {l.label}
                                    </span>
                                    {isActive && (
                                        <motion.span
                                            layoutId="nav-underline"
                                            className="absolute inset-x-3 -bottom-[1px] h-[3px] rounded-full bg-stamp"
                                            transition={{ type: "spring", stiffness: 500, damping: 38 }}
                                        />
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}

                    {user?.email && (
                        <div
                            ref={dashRef}
                            className="relative"
                            onMouseEnter={() => setDashOpen(true)}
                            onMouseLeave={() => setDashOpen(false)}
                        >
                            <button
                                type="button"
                                aria-expanded={dashOpen}
                                aria-haspopup="true"
                                onClick={() => setDashOpen((o) => !o)}
                                className={`relative flex items-center gap-1 px-3.5 py-2 text-[15px] font-bold transition-colors ${dashActive ? "text-ink" : "text-ink-soft hover:text-ink"}`}
                            >
                                Dashboard
                                <IoChevronDown
                                    className={`transition-transform duration-200 ${dashOpen ? "rotate-180" : ""}`}
                                    aria-hidden
                                />
                                {dashActive && (
                                    <motion.span
                                        layoutId="nav-underline"
                                        className="absolute inset-x-3 -bottom-[1px] h-[3px] rounded-full bg-stamp"
                                    />
                                )}
                            </button>

                            <AnimatePresence>
                                {dashOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 6, scale: 0.98 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 4, transition: { duration: 0.12 } }}
                                        transition={{ type: "spring", stiffness: 500, damping: 34 }}
                                        className="absolute right-0 top-full w-72 origin-top-right pt-2"
                                    >
                                        <ul className="tb-card p-1.5 shadow-[0_20px_50px_-20px_rgb(var(--ink)/0.4)]">
                                            {dashboardLinks.map((l) => (
                                                <li key={l.to}>
                                                    <NavLink
                                                        to={l.to}
                                                        className={({ isActive }) =>
                                                            `block rounded-lg px-3.5 py-2.5 transition-colors hover:bg-paper ${isActive ? "bg-paper" : ""}`
                                                        }
                                                    >
                                                        <span className="block text-[15px] font-bold">
                                                            {l.label}
                                                        </span>
                                                        <span className="block text-[13px] text-ink-soft">
                                                            {l.hint}
                                                        </span>
                                                    </NavLink>
                                                </li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </nav>

                <div className="flex items-center gap-2">
                    <motion.button
                        type="button"
                        onClick={toggleTheme}
                        whileTap={{ rotate: 30, scale: 0.9 }}
                        aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
                        className="flex h-10 w-10 items-center justify-center rounded-md text-ink-soft transition-colors hover:bg-card hover:text-ink"
                    >
                        {dark ? <IoSunnyOutline size={19} /> : <IoMoonOutline size={18} />}
                    </motion.button>

                    {user?.email ? (
                        <div className="hidden items-center gap-3 sm:flex">
                            <span className="flex items-center gap-2.5">
                                <Avatar src={user.photoURL} name={user.displayName} />
                                <span className="hidden max-w-[10rem] truncate text-sm font-bold xl:block">
                                    {user.displayName}
                                </span>
                            </span>
                            <button onClick={handleSignOutUser} className="tb-btn-line h-10 px-4">
                                Sign out
                            </button>
                        </div>
                    ) : (
                        <Link to="/signin" className="tb-btn-ink hidden h-10 px-5 sm:inline-flex">
                            Sign in
                        </Link>
                    )}

                    <button
                        type="button"
                        onClick={() => setMenuOpen((o) => !o)}
                        aria-expanded={menuOpen}
                        aria-controls="mobile-menu"
                        aria-label={menuOpen ? "Close menu" : "Open menu"}
                        className="flex h-10 w-10 items-center justify-center rounded-md text-ink transition-colors hover:bg-card lg:hidden"
                    >
                        {menuOpen ? <IoClose size={22} /> : <IoMenu size={22} />}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {menuOpen && (
                    <motion.nav
                        id="mobile-menu"
                        aria-label="Mobile"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden border-t border-rule bg-paper lg:hidden"
                    >
                        <div className="tb-container space-y-6 py-6">
                            <ul className="grid grid-cols-2 gap-2">
                                {mainLinks.map((l) => (
                                    <li key={l.to}>
                                        <NavLink
                                            to={l.to}
                                            end
                                            className={({ isActive }) =>
                                                `block rounded-lg border px-4 py-3 font-bold ${isActive ? "border-stamp bg-card text-ink" : "border-rule text-ink-soft"}`
                                            }
                                        >
                                            {l.label}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>

                            {user?.email && (
                                <div>
                                    <p className="tb-eyebrow mb-2">Dashboard</p>
                                    <ul className="tb-card divide-y divide-rule">
                                        {dashboardLinks.map((l) => (
                                            <li key={l.to}>
                                                <NavLink to={l.to} className="block px-4 py-3">
                                                    <span className="block font-bold">{l.label}</span>
                                                    <span className="block text-sm text-ink-soft">
                                                        {l.hint}
                                                    </span>
                                                </NavLink>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {user?.email ? (
                                <div className="flex items-center justify-between gap-3 sm:hidden">
                                    <span className="flex min-w-0 items-center gap-2.5">
                                        <Avatar src={user.photoURL} name={user.displayName} />
                                        <span className="truncate font-bold">{user.displayName}</span>
                                    </span>
                                    <button onClick={handleSignOutUser} className="tb-btn-line h-10">
                                        Sign out
                                    </button>
                                </div>
                            ) : (
                                <Link to="/signin" className="tb-btn-ink w-full sm:hidden">
                                    Sign in
                                </Link>
                            )}
                        </div>
                    </motion.nav>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;
