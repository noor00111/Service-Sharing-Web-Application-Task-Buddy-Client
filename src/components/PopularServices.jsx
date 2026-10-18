import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import ServiceCard from "./ServiceCard";

const SkeletonCard = () => (
    <div className="tb-card overflow-hidden" aria-hidden>
        <div className="aspect-[4/3] animate-pulse bg-rule/50" />
        <div className="space-y-3 p-5">
            <div className="h-3 w-24 animate-pulse rounded bg-rule/60" />
            <div className="h-5 w-2/3 animate-pulse rounded bg-rule/60" />
            <div className="h-3 w-full animate-pulse rounded bg-rule/40" />
        </div>
    </div>
);

const PopularServices = () => {
    const [popularServices, setPopularServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        fetch("https://task-buddy-server-side.vercel.app/services/popular")
            .then((res) => res.json())
            .then((data) => setPopularServices(Array.isArray(data) ? data : []))
            .catch(() => setFailed(true))
            .finally(() => setLoading(false));
    }, []);

    return (
        <section className="tb-container py-16" aria-labelledby="popular-title">
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <h2 id="popular-title"
                        className="mt-2 font-display text-4xl leading-tight md:text-[2.75rem]">
                        Popular services
                    </h2>
                    <p className="mt-3 max-w-lg text-ink-soft">
                        The services learners open most. Sign in to see full details and book one.
                    </p>
                </div>
                <Link to="/services" className="group inline-flex items-center gap-2 font-bold text-plum">
                    See all services
                    <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
                </Link>
            </div>

            {failed ? (
                <p className="tb-card p-6 text-ink-soft">
                    Popular services didn&apos;t load. Refresh the page to try again.
                </p>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {loading
                        ? Array.from({ length: 6 }, (_, i) => <SkeletonCard key={i} />)
                        : popularServices.map((service, i) => (
                              <ServiceCard key={service._id} service={service} index={i} />
                          ))}
                </div>
            )}
        </section>
    );
};

export default PopularServices;
