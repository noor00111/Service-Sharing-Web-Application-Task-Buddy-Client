import { useMemo, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { IoSearch, IoClose } from "react-icons/io5";
import ServiceCard from "../components/ServiceCard";
import PageHeader from "../components/ui/PageHeader";
import EmptyState from "../components/ui/EmptyState";

const SORTS = [
    { id: "default", label: "Newest" },
    { id: "ascending", label: "Price: low to high" },
    { id: "descending", label: "Price: high to low" },
];

const AllServices = () => {
    const loaderData = useLoaderData();
    const servicesData = useMemo(() => loaderData ?? [], [loaderData]);
    const [query, setQuery] = useState("");
    const [sort, setSort] = useState("default");

    const services = useMemo(() => {
        const q = query.trim().toLowerCase();
        const list = q
            ? servicesData.filter((s) =>
                  [s.serviceName, s.serviceArea, s.serviceProvider?.providerName].some((field) =>
                      field?.toLowerCase().includes(q)
                  )
              )
            : [...servicesData];
        if (sort !== "default") {
            list.sort((a, b) =>
                sort === "ascending" ? a.servicePrice - b.servicePrice : b.servicePrice - a.servicePrice
            );
        }
        return list;
    }, [servicesData, query, sort]);

    return (
        <>
            <PageHeader eyebrow="Catalog" title="All services">
                {servicesData.length} services from providers across Bangladesh. Search by skill, city or
                provider.
            </PageHeader>

            <div className="sticky top-16 z-30 border-y border-rule bg-paper/90 backdrop-blur-md">
                <div className="tb-container flex flex-col gap-3 py-3 md:flex-row md:items-center md:justify-between">
                    <label className="relative block w-full md:max-w-sm">
                        <span className="sr-only">Search services</span>
                        <IoSearch
                            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft"
                            aria-hidden
                        />
                        <input
                            type="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search “design” or “Khulna”…"
                            className="tb-field pl-10 pr-10"
                        />
                        {query && (
                            <button
                                type="button"
                                onClick={() => setQuery("")}
                                aria-label="Clear search"
                                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-ink-soft hover:text-ink">
                                <IoClose />
                            </button>
                        )}
                    </label>

                    <div
                        className="flex items-center gap-3 overflow-x-auto"
                        role="radiogroup"
                        aria-label="Sort services">
                        <span className="tb-eyebrow hidden shrink-0 lg:inline">Sort</span>
                        <div className="flex rounded-lg border border-rule bg-card p-1">
                            {SORTS.map((s) => (
                                <button
                                    key={s.id}
                                    type="button"
                                    role="radio"
                                    aria-checked={sort === s.id}
                                    onClick={() => setSort(s.id)}
                                    className={`relative whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-bold transition-colors ${sort === s.id ? "text-paper" : "text-ink-soft hover:text-ink"}`}>
                                    {sort === s.id && (
                                        <motion.span
                                            layoutId="sort-pill"
                                            className="absolute inset-0 rounded-md bg-ink"
                                            transition={{ type: "spring", stiffness: 500, damping: 38 }}
                                        />
                                    )}
                                    <span className="relative">{s.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <section className="tb-container pt-10" aria-live="polite">
                {query && (
                    <p className="tb-eyebrow mb-6">
                        {services.length} {services.length === 1 ? "result" : "results"} for “{query}”
                    </p>
                )}

                {services.length === 0 ? (
                    <EmptyState
                        stamp="No match"
                        title={`Nothing matches “${query}”`}
                        action={
                            <button onClick={() => setQuery("")} className="tb-btn-ink">
                                Clear search
                            </button>
                        }>
                        Try a skill like “writing” or a city like “Dhaka”.
                    </EmptyState>
                ) : (
                    <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <AnimatePresence mode="popLayout">
                            {services.map((service, i) => (
                                <ServiceCard key={service._id} service={service} index={i} />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </section>
        </>
    );
};

export default AllServices;
