import { useContext, useState } from "react";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { IoArrowBack } from "react-icons/io5";
import AuthContext from "../context/AuthContext";
import Stamp from "../components/ui/Stamp";
import { formatPrice } from "../utils/format";

const ease = [0.22, 1, 0.36, 1];
const today = () => new Date().toISOString().slice(0, 10);

const BookService = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const service = useLoaderData();
    const provider = service.serviceProvider || {};
    const [submitting, setSubmitting] = useState(false);

    const handleBookedServices = (e) => {
        e.preventDefault();
        const form = e.target;

        const bookServices = {
            serviceId: service._id,
            serviceName: service.serviceName,
            serviceImage: service.serviceImage,
            providerEmail: provider.providerEmail,
            providerName: provider.providerName,
            currentUserEmail: user.email,
            currentUserName: user.displayName,
            serviceDate: form.serviceDate.value,
            specialInstruction: form.specialInstruction.value.trim(),
            servicePrice: service.servicePrice,
            serviceStatus: "pending",
        };

        setSubmitting(true);
        fetch("https://task-buddy-server-side.vercel.app/bookService", {
            method: "POST",
            credentials: "include",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(bookServices),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.insertedId) {
                    toast.success("Booking sent. It's on My bookings as Pending.");
                    navigate("/bookedService");
                } else {
                    toast.error(data.message || "The booking wasn't saved. Try again.");
                }
            })
            .catch(() => toast.error("Couldn't reach the server. Check your connection and try again."))
            .finally(() => setSubmitting(false));
    };

    return (
        <div className="tb-container py-10 md:py-14">
            <Link to={`/singleServiceDetails/${service._id}`}
                className="inline-flex items-center gap-2 text-sm font-bold text-ink-soft transition-colors hover:text-ink">
                <IoArrowBack aria-hidden /> Back to service
            </Link>

            <div className="mt-6 max-w-2xl">
                <p className="tb-eyebrow">New booking</p>
                <h1 className="mt-2 font-display text-4xl leading-[1.05] md:text-5xl">Fill in your slip</h1>
                <p className="mt-3 text-lg text-ink-soft">
                    Choose a date and tell {provider.providerName?.split(" ")[0] || "the provider"} what you
                    need. Everything else is filled in for you.
                </p>
            </div>

            <motion.form
                onSubmit={handleBookedServices}
                className="tb-slip mt-10 max-w-3xl shadow-[0_24px_50px_-30px_rgb(var(--ink)/0.45)]"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease }}>
                <div className="grid gap-6 p-6 sm:grid-cols-[120px_1fr] sm:p-8">
                    <img
                        src={service.serviceImage}
                        alt=""
                        className="h-28 w-full rounded-lg object-cover sm:h-[120px]"/>
                    <div className="min-w-0">
                        <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                                <p className="tb-eyebrow">Service</p>
                                <p className="mt-1 font-display text-2xl leading-tight">
                                    {service.serviceName}
                                </p>
                            </div>
                            <Stamp status="pending" label="Draft" size="sm" />
                        </div>
                        <dl className="mt-5 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
                            <Printed label="Provider" value={provider.providerName} />
                            <Printed label="Provider email" value={provider.providerEmail} />
                            <Printed label="Booked by" value={user?.displayName || "—"} />
                            <Printed label="Your email" value={user?.email} />
                        </dl>
                    </div>
                </div>

                <div className="tb-perf grid gap-6 p-6 sm:p-8">
                    <div className="grid gap-6 sm:grid-cols-[220px_1fr]">
                        <div>
                            <label htmlFor="serviceDate" className="tb-label">
                                Date
                            </label>
                            <input
                                id="serviceDate"
                                type="date"
                                name="serviceDate"
                                min={today()}
                                required
                                className="tb-field"/>
                        </div>
                        <div>
                            <label htmlFor="specialInstruction" className="tb-label">
                                Note for the provider
                            </label>
                            <textarea
                                id="specialInstruction"
                                name="specialInstruction"
                                rows={3}
                                className="tb-field resize-y"
                                placeholder="What should they know before starting? Goals, level, deadline…"/>
                        </div>
                    </div>

                    <div className="flex flex-col-reverse items-stretch justify-between gap-4 border-t border-dashed border-rule pt-6 sm:flex-row sm:items-center">
                        <div>
                            <p className="tb-eyebrow">Total</p>
                            <p className="font-mono text-2xl font-semibold">
                                {formatPrice(service.servicePrice)}{" "}
                                <span className="text-xs text-ink-soft">BDT</span>
                            </p>
                        </div>
                        <motion.button
                            whileTap={{ scale: 0.97 }}
                            disabled={submitting}
                            className="tb-btn-ink h-12 px-8 text-[15px]">
                            {submitting ? "Sending…" : "Confirm booking"}
                        </motion.button>
                    </div>
                </div>
            </motion.form>
        </div>
    );
};

const Printed = ({ label, value }) => (
    <div className="min-w-0">
        <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-soft">{label}</dt>
        <dd className="mt-0.5 truncate font-bold">{value || "—"}</dd>
    </div>
);

export default BookService;
