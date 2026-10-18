import { useEffect } from "react";
import { Outlet, ScrollRestoration, useLocation, useNavigation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "../common/Navbar";
import Footer from "../common/Footer";

const PAGE_TITLES = [
    ["/singleservicedetails", "Service details"],
    ["/bookservice", "Book a service"],
    ["/services", "All services"],
    ["/addservice", "Add a service"],
    ["/manageservices", "Manage services"],
    ["/bookedservice", "My bookings"],
    ["/servicetodo", "Booking requests"],
    ["/signin", "Sign in"],
    ["/signup", "Sign up"],
    ["/aboutus", "About"],
    ["/testimonials", "Testimonials"],
];

export const InkFilter = () => (
    <svg width="0" height="0" className="absolute" aria-hidden focusable="false">
        <filter id="tb-ink" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="7" result="noise" />
            <feColorMatrix
                in="noise"
                type="matrix"
                values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -7 5.3"
                result="holes"
            />
            <feComposite in="SourceGraphic" in2="holes" operator="in" result="speckled" />
            <feDisplacementMap
                in="speckled"
                in2="noise"
                scale="1.3"
                xChannelSelector="R"
                yChannelSelector="G"
            />
        </filter>
    </svg>
);

const MainLayout = () => {
    const location = useLocation();
    const navigation = useNavigation();

    useEffect(() => {
        const path = location.pathname.toLowerCase();
        const match = PAGE_TITLES.find(([prefix]) => path.startsWith(prefix));
        document.title = match
            ? `${match[1]} · Task Buddy`
            : "Task Buddy · Book a skill from someone who has it";
    }, [location]);

    return (
        <div className="flex min-h-screen flex-col">
            <InkFilter />
            <a href="#main" className="sr-only z-[200] rounded-md bg-ink px-4 py-2 text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
                Skip to content
            </a>

            <AnimatePresence>
                {navigation.state === "loading" && (
                    <motion.div
                        className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-stamp"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 0.8, transition: { duration: 2, ease: [0.1, 0.8, 0.2, 1] } }}
                        exit={{ scaleX: 1, opacity: 0, transition: { duration: 0.25 } }}
                    />
                )}
            </AnimatePresence>

            <Navbar />
            <motion.main
                id="main"
                key={location.pathname}
                className="flex-1"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
                <Outlet />
            </motion.main>
            <Footer />
            <ScrollRestoration />
        </div>
    );
};

export default MainLayout;
