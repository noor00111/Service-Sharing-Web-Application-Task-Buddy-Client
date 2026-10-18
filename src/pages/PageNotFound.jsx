import { Link, isRouteErrorResponse, useRouteError } from "react-router-dom";
import { motion } from "framer-motion";
import Stamp from "../components/ui/Stamp";
import { InkFilter } from "../layout/MainLayout";

const PageNotFound = () => {
    const error = useRouteError();
    const notFound = !error || (isRouteErrorResponse(error) && error.status === 404);

    return (
        <main className="flex min-h-screen items-center justify-center px-4 py-16">
            <InkFilter />
            <motion.div
                className="tb-slip w-full max-w-lg p-8 text-center sm:p-12"
                initial={{ opacity: 0, y: 20, rotate: -2 }}
                animate={{ opacity: 1, y: 0, rotate: -1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
                <p className="tb-eyebrow">{notFound ? "Error 404" : "Something went wrong"}</p>
                <div className="my-10">
                    <Stamp
                        status="pending"
                        label={notFound ? "Return to sender" : "Not delivered"}
                        size="lg"
                        tilt={-9}
                        stampIn
                        delay={0.35}
                    />
                </div>
                <h1 className="font-display text-3xl leading-tight sm:text-4xl">
                    {notFound ? "This page isn't on file." : "This page couldn't be loaded."}
                </h1>
                <p className="mx-auto mt-3 max-w-sm text-ink-soft">
                    {notFound
                        ? "The link may be old or mistyped. Head back and pick up from the home page."
                        : "The server didn't answer in time. Refresh to try again, or go back home."}
                </p>
                <div className="tb-perf -mx-8 mt-10 flex flex-wrap justify-center gap-3 px-8 pt-8 sm:-mx-12 sm:px-12">
                    <Link to="/" className="tb-btn-ink">
                        Back to home
                    </Link>
                    <Link to="/services" className="tb-btn-line">
                        Browse services
                    </Link>
                </div>
            </motion.div>
        </main>
    );
};

export default PageNotFound;
