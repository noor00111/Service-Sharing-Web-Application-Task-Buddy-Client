import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";
import { IoAdd, IoSearch, IoClose, IoWarningOutline } from "react-icons/io5";
import ManageServiceRow from "./ManageServicesCard";
import AuthContext from "../context/AuthContext";
import PageHeader from "../components/ui/PageHeader";
import EmptyState from "../components/ui/EmptyState";
import Dialog from "../components/ui/Dialog";
import { formatPrice, normalizeStatus } from "../utils/format";

const API = "https://task-buddy-server-side.vercel.app";
const SORTS = [
    { id: "newest", label: "Newest" },
    { id: "booked", label: "Most booked" },
    { id: "price", label: "Price" },
];

const emptyStats = () => ({ total: 0, pending: 0, working: 0, completed: 0, earned: 0 });
const Stat = ({ label, value, note, tone = "text-ink", action }) => (
    <div className="flex flex-col justify-between gap-3 bg-card p-5 sm:p-6">
        <dt className="tb-eyebrow">{label}</dt>
        <dd>
            <span className={`font-display text-4xl leading-none tabular-nums ${tone}`}>{value}</span>
            {note && <span className="mt-2 block text-sm text-ink-soft">{note}</span>}
            {action}
        </dd>
    </div>
);

const SkeletonRow = () => (
    <div className="flex items-center gap-4 p-5" aria-hidden>
        <div className="h-16 w-16 shrink-0 animate-pulse rounded-lg bg-rule/70" />
        <div className="flex-1 space-y-2.5">
            <div className="h-3 w-24 animate-pulse rounded bg-rule/70" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-rule/70" />
        </div>
        <div className="hidden h-4 w-20 animate-pulse rounded bg-rule/60 md:block" />
        <div className="hidden h-2 w-40 animate-pulse rounded bg-rule/60 md:block" />
    </div>
);

const ManageServices = () => {
    const { user } = useContext(AuthContext);
    const [services, setServices] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [bookingsFailed, setBookingsFailed] = useState(false);
    const [status, setStatus] = useState("loading");
    const [toDelete, setToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const [params, setParams] = useSearchParams();
    const query = params.get("q") ?? "";
    const sort = SORTS.some((s) => s.id === params.get("sort")) ? params.get("sort") : "newest";
    const setParam = (key, value, fallback) => {
        const next = new URLSearchParams(params);
        if (!value || value === fallback) next.delete(key);
        else next.set(key, value);
        setParams(next, { replace: true });
    };

    const load = useCallback(() => {
        setStatus("loading");
        const opts = { withCredentials: true };
        Promise.allSettled([
            axios.get(`${API}/userServices?email=${user.email}`, opts),
            axios.get(`${API}/myService?email=${user.email}`, opts),
        ]).then(([svc, bk]) => {
            if (svc.status === "rejected") return setStatus("error");
            setServices(svc.value.data);
            setBookings(bk.status === "fulfilled" ? bk.value.data : []);
            setBookingsFailed(bk.status === "rejected");
            setStatus("ready");
        });
    }, [user.email]);

    useEffect(() => {
        load();
    }, [load]);

    const { byService, totals } = useMemo(() => {
        const map = {};
        const all = emptyStats();
        for (const b of bookings) {
            const s = normalizeStatus(b.serviceStatus);
            const row = (map[b.serviceId] ??= emptyStats());
            for (const t of [row, all]) {
                t.total += 1;
                t[s] += 1;
                if (s === "completed") t.earned += Number(b.servicePrice) || 0;
            }
        }
        return { byService: map, totals: all };
    }, [bookings]);

    const visible = useMemo(() => {
        const q = query.trim().toLowerCase();
        const list = services
            .map((s, order) => ({ ...s, order, stats: byService[s._id] ?? emptyStats() }))
            .filter((s) => !q || [s.serviceName, s.serviceArea].some((f) => f?.toLowerCase().includes(q)));
        if (sort === "booked") list.sort((a, b) => b.stats.total - a.stats.total);
        else if (sort === "price") list.sort((a, b) => Number(b.servicePrice) - Number(a.servicePrice));
        else list.sort((a, b) => b.order - a.order);
        return list;
    }, [services, byService, query, sort]);

    const confirmDelete = () => {
        const id = toDelete._id;
        setDeleting(true);
        fetch(`${API}/services/${id}`, { method: "DELETE", credentials: "include" })
            .then((res) => res.json())
            .then((data) => {
                if (data.deletedCount > 0) {
                    setServices((list) => list.filter((s) => s._id !== id));
                    setBookings((list) => list.filter((b) => b.serviceId !== id));
                    toast.success(`Deleted “${toDelete.serviceName}”`);
                    setToDelete(null);
                } else {
                    toast.error(data.message || "The service wasn't deleted. Refresh and try again.");
                }
            })
            .catch(() => toast.error("Couldn't reach the server. Check your connection and try again."))
            .finally(() => setDeleting(false));
    };

    const handleUpdated = (id, changes) =>
        setServices((list) => list.map((s) => (s._id === id ? { ...s, ...changes } : s)));

    const deleteStats = toDelete ? (byService[toDelete._id] ?? emptyStats()) : emptyStats();
    const openOnDelete = deleteStats.pending + deleteStats.working;

    return (
        <>
            <PageHeader
                eyebrow="Your desk"
                title="Your services"
                aside={
                    <Link to="/AddService" className="tb-btn-ink">
                        <IoAdd size={18} aria-hidden /> Add a service
                    </Link>
                }>
                Everything you offer, with how often each one gets booked.
            </PageHeader>

            <div className="tb-container space-y-8">
                {status === "error" ? (
                    <div
                        className="tb-card flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between"
                        role="alert">
                        <p className="text-ink-soft">
                            Your services didn&apos;t load. The server may be waking up.
                        </p>
                        <button type="button" onClick={load} className="tb-btn-ink">
                            Try again
                        </button>
                    </div>
                ) : status === "ready" && services.length === 0 ? (
                    <EmptyState
                        title="You haven't listed any services"
                        action={
                            <Link to="/AddService" className="tb-btn-ink">
                                Add your first service
                            </Link>
                        }>
                        Add one and it appears in the catalog straight away. Bookings for it will show up
                        here.
                    </EmptyState>
                ) : (
                    <>
                        <motion.dl
                            className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-rule bg-rule lg:grid-cols-4"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            aria-busy={status === "loading"}>
                            <Stat
                                label="Listings"
                                value={status === "loading" ? "–" : services.length}
                                note="live in the catalog"
                            />
                            <Stat
                                label="Waiting on you"
                                value={status === "loading" || bookingsFailed ? "–" : totals.pending}
                                tone={totals.pending ? "text-stamp" : "text-ink"}
                                note={totals.pending ? null : "no pending requests"}
                                action={
                                    totals.pending > 0 && (
                                        <Link to="/ServiceToDo" className="mt-2 flex w-fit text-sm font-bold text-plum underline-offset-4 hover:underline">
                                            Review requests →
                                        </Link>
                                    )}/>
                            <Stat
                                label="In progress"
                                value={status === "loading" || bookingsFailed ? "–" : totals.working}
                                tone="text-plum"
                                note="marked Working"/>
                            <Stat
                                label="Completed"
                                value={status === "loading" || bookingsFailed ? "–" : totals.completed}
                                tone="text-deep"
                                note={
                                    totals.earned
                                        ? `${formatPrice(totals.earned)} BDT of finished work`
                                        : "nothing finished yet"
                                }
                            />
                        </motion.dl>

                        {bookingsFailed && (
                            <p className="flex items-center gap-2 text-sm text-ink-soft" role="status">
                                <IoWarningOutline aria-hidden /> Booking counts couldn&apos;t load, so they
                                show as 0 below.
                                <button type="button" onClick={load}
                                    className="font-bold text-plum underline-offset-4 hover:underline">
                                    Retry
                                </button>
                            </p>
                        )}

                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <label className="relative block w-full md:max-w-xs">
                                <span className="sr-only">Search your services</span>
                                <IoSearch
                                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft"
                                    aria-hidden
                                />
                                <input
                                    type="search"
                                    value={query}
                                    onChange={(e) => setParam("q", e.target.value, "")}
                                    placeholder="Search by name or area…"
                                    autoComplete="off"
                                    spellCheck={false}
                                    className="tb-field pl-10 pr-10"
                                />
                                {query && (
                                    <button
                                        type="button"
                                        onClick={() => setParam("q", "", "")}
                                        aria-label="Clear search"
                                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-ink-soft hover:text-ink">
                                        <IoClose />
                                    </button>
                                )}
                            </label>

                            <div className="flex items-center gap-3">
                                <span className="tb-eyebrow shrink-0" id="sort-label">
                                    Sort
                                </span>
                                <div
                                    className="flex rounded-lg border border-rule bg-card p-1"
                                    role="radiogroup"
                                    aria-labelledby="sort-label">
                                    {SORTS.map((s) => (
                                        <button
                                            key={s.id}
                                            type="button"
                                            role="radio"
                                            aria-checked={sort === s.id}
                                            onClick={() => setParam("sort", s.id, "newest")}
                                            className={`relative whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-bold transition-colors ${sort === s.id ? "text-paper" : "text-ink-soft hover:text-ink"}`}>
                                            {sort === s.id && (
                                                <motion.span
                                                    layoutId="manage-sort"
                                                    className="absolute inset-0 rounded-md bg-ink"
                                                    transition={{
                                                        type: "spring",
                                                        stiffness: 500,
                                                        damping: 38,
                                                    }}/>
                                            )}
                                            <span className="relative">{s.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <section aria-label="Your services" className="tb-card overflow-hidden">
                            <div
                                className="hidden grid-cols-[minmax(0,1fr)_120px_220px_190px] gap-6 border-b border-rule bg-paper/60 px-5 py-3 lg:grid"
                                aria-hidden>
                                <span className="tb-eyebrow">Service</span>
                                <span className="tb-eyebrow text-right">Price</span>
                                <span className="tb-eyebrow">Bookings</span>
                                <span className="tb-eyebrow text-right">Actions</span>
                            </div>

                            {status === "loading" ? (
                                <div className="divide-y divide-rule">
                                    {[0, 1, 2].map((i) => (
                                        <SkeletonRow key={i} />
                                    ))}
                                </div>
                            ) : visible.length === 0 ? (
                                <div className="flex flex-col items-center gap-4 px-6 py-14 text-center">
                                    <p className="text-ink-soft">No services match “{query}”.</p>
                                    <button
                                        type="button"
                                        onClick={() => setParam("q", "", "")}
                                        className="tb-btn-line">
                                        Clear search
                                    </button>
                                </div>
                            ) : (
                                <ul className="divide-y divide-rule">
                                    <AnimatePresence initial={false}>
                                        {visible.map((service, i) => (
                                            <ManageServiceRow
                                                key={service._id}
                                                index={i}
                                                service={service}
                                                stats={service.stats}
                                                onDelete={() => setToDelete(service)}
                                                onUpdated={handleUpdated}
                                            />
                                        ))}
                                    </AnimatePresence>
                                </ul>
                            )}
                        </section>
                        {status === "ready" && query && visible.length > 0 && (
                            <p className="tb-eyebrow" role="status">
                                {visible.length} of {services.length} services shown
                            </p>
                        )}
                    </>
                )}
            </div>

            <Dialog
                open={!!toDelete}
                onClose={() => !deleting && setToDelete(null)}
                title={`Delete “${toDelete?.serviceName ?? ""}”?`}
                description="It comes off the catalog and learners can't book it any more. This can't be undone."
                width="max-w-md">
                {deleteStats.total > 0 && (
                    <div className="mb-6 flex gap-3 rounded-lg border border-danger/30 bg-danger/5 p-4 text-sm">
                        <IoWarningOutline className="mt-0.5 shrink-0 text-danger" size={18} aria-hidden />
                        <p>Its{" "}
                            <strong>{deleteStats.total} {deleteStats.total === 1 ? "booking" : "bookings"}</strong>{" "}
                            will be removed too
                            {openOnDelete > 0 && (
                                <>, including <strong>{openOnDelete} still open</strong>. Let those learners know first</>
                            )}
                            .
                        </p>
                    </div>
                )}
                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={() => setToDelete(null)}
                        disabled={deleting}
                        className="tb-btn-line">
                        Keep service
                    </button>
                    <button
                        type="button"
                        onClick={confirmDelete}
                        disabled={deleting}
                        className="tb-btn-danger">
                        {deleting ? "Deleting…" : "Delete service"}
                    </button>
                </div>
            </Dialog>
        </>
    );
};

export default ManageServices;
