import { forwardRef } from "react";
import { motion } from "framer-motion";
import Stamp from "./ui/Stamp";
import StatusTrack from "./ui/StatusTrack";
import { STATUSES, formatDate, formatPrice, normalizeStatus, slipNumber } from "../utils/format";

const STATUS_LABEL = { pending: "Pending", working: "Working", completed: "Completed" };

const BookingSlip = forwardRef(
    ({ booking, mode = "learner", onStatusChange, busy = false, index = 0 }, ref) => {
        const status = normalizeStatus(booking.serviceStatus);
        const isProvider = mode === "provider";

        return (
            <motion.article
                ref={ref}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20, transition: { duration: 0.15 } }}
                transition={{ duration: 0.4, delay: Math.min(index, 8) * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="tb-slip overflow-hidden">
                <div className="grid gap-0 md:grid-cols-[minmax(0,1fr)_260px]">
                    <div className="flex gap-4 p-5 sm:p-6">
                        <img
                            src={booking.serviceImage}
                            alt=""
                            loading="lazy"
                            className="hidden h-24 w-24 shrink-0 rounded-lg object-cover sm:block"
                        />
                        <div className="min-w-0 flex-1">
                            <p className="tb-eyebrow">Slip No. {slipNumber(booking._id)}</p>
                            <h3 className="mt-1 font-display text-xl leading-snug">{booking.serviceName}</h3>

                            <dl className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                                {isProvider ? (
                                    <>
                                        <Row label="Learner" value={booking.currentUserName || "—"} />
                                        <Row label="Email" value={booking.currentUserEmail} />
                                    </>
                                ) : (
                                    <Row label="Provider" value={booking.providerName} />
                                )}
                                <Row label="Date" value={formatDate(booking.serviceDate)} />
                            </dl>

                            {booking.specialInstruction && (
                                <p className="mt-3 border-l-2 border-marker pl-3 text-[15px] italic text-ink-soft">
                                    “{booking.specialInstruction}”
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="relative flex flex-col justify-between gap-5 border-t border-dashed border-rule p-5 sm:p-6 md:border-l md:border-t-0">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="tb-eyebrow">Price</p>
                                <p className="mt-1 font-mono text-xl font-semibold">
                                    {formatPrice(booking.servicePrice)}{" "}
                                    <span className="text-xs font-medium text-ink-soft">BDT</span>
                                </p>
                            </div>
                            <Stamp status={status} />
                        </div>

                        {isProvider ? (
                            <fieldset disabled={busy}>
                                <legend className="tb-label">Update status</legend>
                                <div className="grid grid-cols-3 rounded-lg border border-rule bg-paper p-1">
                                    {STATUSES.map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            aria-pressed={status === s}
                                            onClick={() =>
                                                status !== s && onStatusChange?.(booking._id, STATUS_LABEL[s])
                                            }
                                            className={`relative rounded-md px-1 py-1.5 text-xs font-bold transition-colors disabled:cursor-wait ${status === s ? "text-paper" : "text-ink-soft hover:text-ink"}`}>
                                            {status === s && (
                                                <motion.span
                                                    layoutId={`status-pill-${booking._id}`}
                                                    className="absolute inset-0 rounded-md bg-ink"
                                                    transition={{
                                                        type: "spring",
                                                        stiffness: 500,
                                                        damping: 36,
                                                    }}/>
                                            )}
                                            <span className="relative">{STATUS_LABEL[s]}</span>
                                        </button>
                                    ))}
                                </div>
                            </fieldset>
                        ) : (
                            <StatusTrack status={status} />
                        )}
                    </div>
                </div>
            </motion.article>
        );
    }
);

const Row = ({ label, value }) => (
    <div className="flex min-w-0 gap-2">
        <dt className="shrink-0 font-mono text-[11px] uppercase leading-5 tracking-[0.12em] text-ink-soft">
            {label}
        </dt>
        <dd className="truncate font-bold">{value}</dd>
    </div>
);

BookingSlip.displayName = "BookingSlip";

export default BookingSlip;
