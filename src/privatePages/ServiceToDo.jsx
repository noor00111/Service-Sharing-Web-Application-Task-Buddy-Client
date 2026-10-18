import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AnimatePresence } from "framer-motion";
import AuthContext from "../context/AuthContext";
import PageHeader from "../components/ui/PageHeader";
import EmptyState from "../components/ui/EmptyState";
import BookingSlip from "../components/BookingSlip";
import StatusFilter from "../components/StatusFilter";
import Loading from "../components/Loading";
import { normalizeStatus } from "../utils/format";

const ServiceToDo = () => {
    const { user } = useContext(AuthContext);
    const [booked, setBooked] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busyId, setBusyId] = useState(null);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        axios
            .get(`https://task-buddy-server-side.vercel.app/myService?email=${user.email}`, {
                withCredentials: true,
            })
            .then((res) => setBooked(res.data))
            .catch(() => setBooked([]))
            .finally(() => setLoading(false));
    }, [user.email]);

    const handleStatusChange = (id, serviceStatus) => {
        const previous = booked;
        setBooked((list) => list.map((b) => (b._id === id ? { ...b, serviceStatus } : b)));
        setBusyId(id);

        fetch(`https://task-buddy-server-side.vercel.app/bookService/${id}`, {
            method: "PUT",
            credentials: "include",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ serviceStatus }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.modifiedCount > 0) {
                    toast.success(`Marked as ${serviceStatus}`);
                } else {
                    throw new Error(data.message || "Status didn't change. Try again.");
                }
            })
            .catch((error) => {
                setBooked(previous);
                toast.error(
                    error instanceof TypeError
                        ? "Couldn't reach the server. Check your connection and try again."
                        : error.message
                );
            })
            .finally(() => setBusyId(null));
    };

    const visible =
        filter === "all" ? booked : booked.filter((b) => normalizeStatus(b.serviceStatus) === filter);

    return (
        <>
            <PageHeader
                eyebrow="Your desk"
                title="Booking requests"
                aside={
                    booked.length > 0 && (
                        <StatusFilter id="todo" bookings={booked} value={filter} onChange={setFilter} />
                    )}>
                People who booked your services. Update the status so they know where things stand.
            </PageHeader>

            <section className="tb-container">
                {loading ? (
                    <Loading label="Fetching requests" />
                ) : booked.length === 0 ? (
                    <EmptyState
                        title="No one has booked your services yet"
                        action={
                            <Link to="/ManageServices" className="tb-btn-ink">
                                Review your services
                            </Link>
                        }>
                        New requests will appear here as Pending. A clear description and fair price help.
                    </EmptyState>
                ) : visible.length === 0 ? (
                    <p className="tb-card p-6 text-ink-soft">No requests are {filter} right now.</p>
                ) : (
                    <div className="space-y-5">
                        <AnimatePresence mode="popLayout">
                            {visible.map((booking, i) => (
                                <BookingSlip
                                    key={booking._id}
                                    booking={booking}
                                    mode="provider"
                                    index={i}
                                    busy={busyId === booking._id}
                                    onStatusChange={handleStatusChange}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </section>
        </>
    );
};

export default ServiceToDo;
