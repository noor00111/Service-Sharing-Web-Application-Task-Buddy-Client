import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AnimatePresence } from "framer-motion";
import AuthContext from "../context/AuthContext";
import PageHeader from "../components/ui/PageHeader";
import EmptyState from "../components/ui/EmptyState";
import BookingSlip from "../components/BookingSlip";
import StatusFilter from "../components/StatusFilter";
import Loading from "../components/Loading";
import { normalizeStatus } from "../utils/format";

const BookedService = () => {
    const { user } = useContext(AuthContext);
    const [booked, setBooked] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        axios
            .get(`https://task-buddy-server-side.vercel.app/bookedService?email=${user.email}`, {
                withCredentials: true,
            })
            .then((res) => setBooked(res.data))
            .catch(() => setBooked([]))
            .finally(() => setLoading(false));
    }, [user.email]);

    const visible =filter === "all" ? booked : booked.filter((b) => normalizeStatus(b.serviceStatus) === filter);

    return (
        <>
            <PageHeader
                eyebrow="Your desk"
                title="My bookings"
                aside={
                    booked.length > 0 && (
                        <StatusFilter id="booked" bookings={booked} value={filter} onChange={setFilter} />
                    )}>
                Every service you&apos;ve booked. The stamp changes when the provider updates it.
            </PageHeader>

            <section className="tb-container">
                {loading ? (
                    <Loading label="Fetching your bookings" />
                ) : booked.length === 0 ? (
                    <EmptyState
                        title="You haven't booked anything yet"
                        action={
                            <Link to="/services" className="tb-btn-ink">
                                Browse services
                            </Link>
                        }>
                        Find a service, pick a date, and your booking slip will appear here.
                    </EmptyState>
                ) : visible.length === 0 ? (
                    <p className="tb-card p-6 text-ink-soft">No bookings are {filter} right now.</p>
                ) : (
                    <div className="space-y-5">
                        <AnimatePresence mode="popLayout">
                            {visible.map((booking, i) => (
                                <BookingSlip key={booking._id} booking={booking} index={i} />
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </section>
        </>
    );
};

export default BookedService;
