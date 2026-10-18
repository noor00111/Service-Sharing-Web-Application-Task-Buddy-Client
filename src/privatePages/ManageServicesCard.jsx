import { forwardRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { MdEdit, MdDeleteOutline } from "react-icons/md";
import { IoLocationOutline, IoOpenOutline } from "react-icons/io5";
import Dialog from "../components/ui/Dialog";
import { formatPrice } from "../utils/format";

const API = "https://task-buddy-server-side.vercel.app";
const NAME_MAX = 60;
const DESC_MAX = 600;
const SEGMENTS = [
    { key: "pending", label: "Pending", color: "bg-stamp" },
    { key: "working", label: "Working", color: "bg-plum" },
    { key: "completed", label: "Done", color: "bg-deep" },
];

const BookingBar = ({ stats }) => {
    if (!stats.total) return <p className="text-sm text-ink-soft">No bookings yet</p>;

    const summary = SEGMENTS.filter((s) => stats[s.key])
        .map((s) => `${stats[s.key]} ${s.label.toLowerCase()}`)
        .join(" · ");
    return (
        <div>
            <p className="text-sm">
                <span className="font-bold tabular-nums">{stats.total}</span>{" "}
                <span className="text-ink-soft">{stats.total === 1 ? "booking" : "bookings"}</span>
            </p>
            <div
                className="mt-2 flex h-2 overflow-hidden rounded-full bg-rule"
                role="img"
                aria-label={summary}>
                {SEGMENTS.map((s) =>
                    stats[s.key] ? (
                        <motion.span
                            key={s.key}
                            className={`h-full ${s.color} [&:not(:last-child)]:border-r-2 [&:not(:last-child)]:border-card`}
                            initial={false}
                            animate={{ flexGrow: stats[s.key] }}
                            style={{ flexBasis: 0 }}
                        />
                    ) : null
                )}
            </div>
            <p className="mt-1.5 text-[13px] tabular-nums text-ink-soft" aria-hidden>
                {summary}
            </p>
        </div>
    );
};

const EditForm = ({ service, onCancel, onSaved }) => {
    const initial = {
        serviceName: service.serviceName ?? "",
        serviceDescription: service.serviceDescription ?? "",
        servicePrice: String(service.servicePrice ?? ""),
    };
    const [form, setForm] = useState(initial);
    const [saving, setSaving] = useState(false);
    const dirty = Object.keys(initial).some((k) => form[k].trim() !== initial[k].trim());
    const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const submit = (e) => {
        e.preventDefault();
        const updatedService = {
            serviceName: form.serviceName.trim(),
            serviceDescription: form.serviceDescription.trim(),
            servicePrice: form.servicePrice,
        };
        setSaving(true);
        fetch(`${API}/services/${service._id}`, {
            method: "PUT",
            credentials: "include",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(updatedService),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.modifiedCount > 0) {
                    onSaved(updatedService);
                    toast.success("Changes saved");
                } else {
                    if (data.message) toast.error(data.message);
                    else toast.info("Nothing changed, so nothing was saved.");
                }
            })
            .catch(() => toast.error("Couldn't save changes. Check your connection and try again."))
            .finally(() => setSaving(false));
    };

    const id = service._id;
    return (
        <form onSubmit={submit} className="space-y-5">
            <div className="flex items-center gap-3 rounded-lg border border-rule bg-paper/60 p-3">
                <img
                    src={service.serviceImage}
                    alt=""
                    width="56"
                    height="56"
                    className="h-14 w-14 shrink-0 rounded-md object-cover"
                />
                <div className="min-w-0 text-sm">
                    <p className="flex items-center gap-1 text-ink-soft">
                        <IoLocationOutline aria-hidden />{" "}
                        <span className="truncate">{service.serviceArea}</span>
                    </p>
                    <p className="mt-0.5 text-ink-soft">Image and area stay as they are.</p>
                </div>
            </div>

            <div>
                <div className="flex items-baseline justify-between">
                    <label htmlFor={`name-${id}`} className="tb-label">
                        Service name
                    </label>
                    <span className="font-mono text-[11px] tabular-nums text-ink-soft">
                        {form.serviceName.length}/{NAME_MAX}
                    </span>
                </div>
                <input id={`name-${id}`}
                    name="serviceName"
                    value={form.serviceName}
                    onChange={update}
                    required
                    maxLength={NAME_MAX}
                    autoComplete="off"
                    className="tb-field"
                />
            </div>
            <div>
                <div className="flex items-baseline justify-between">
                    <label htmlFor={`desc-${id}`} className="tb-label">
                        Description
                    </label>
                    <span className="font-mono text-[11px] tabular-nums text-ink-soft">
                        {form.serviceDescription.length}/{DESC_MAX}
                    </span>
                </div>
                <textarea
                    id={`desc-${id}`}
                    name="serviceDescription"
                    value={form.serviceDescription}
                    onChange={update}
                    required
                    rows={5}
                    maxLength={DESC_MAX}
                    className="tb-field resize-y"
                />
            </div>
            <div className="sm:w-1/2">
                <label htmlFor={`price-${id}`} className="tb-label">
                    Price (BDT)
                </label>
                <input
                    id={`price-${id}`}
                    name="servicePrice"
                    type="number"
                    min="0"
                    step="1"
                    inputMode="numeric"
                    value={form.servicePrice}
                    onChange={update}
                    required
                    className="tb-field font-mono tabular-nums"
                />
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-dashed border-rule pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-ink-soft" aria-live="polite">
                    {dirty ? "You have unsaved changes." : "No changes yet."}
                </p>
                <div className="flex flex-col-reverse gap-3 sm:flex-row">
                    <button type="button" onClick={onCancel} disabled={saving} className="tb-btn-line">
                        Cancel
                    </button>
                    <button type="submit" disabled={saving || !dirty} className="tb-btn-ink">
                        {saving ? "Saving…" : "Save changes"}
                    </button>
                </div>
            </div>
        </form>
    );
};

const ManageServiceRow = forwardRef(({ service, stats, onDelete, onUpdated, index = 0 }, ref) => {
    const { _id, serviceImage, serviceName, serviceDescription, serviceArea, servicePrice } = service;
    const [editing, setEditing] = useState(false);

    return (
        <motion.li
            ref={ref}
            layout="position"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.35, delay: Math.min(index, 8) * 0.04 } }}
            exit={{ opacity: 0, x: -24, transition: { duration: 0.2 } }}
            className="grid gap-4 p-5 transition-colors hover:bg-paper/50 lg:grid-cols-[minmax(0,1fr)_120px_220px_190px] lg:items-center lg:gap-6">
            <div className="flex min-w-0 items-center gap-4">
                <img
                    src={serviceImage}
                    alt=""
                    width="64"
                    height="64"
                    loading="lazy"
                    className="h-16 w-16 shrink-0 rounded-lg object-cover"
                />
                <div className="min-w-0">
                    <p className="tb-eyebrow flex items-center gap-1">
                        <IoLocationOutline aria-hidden /> <span className="truncate">{serviceArea}</span>
                    </p>
                    <h2 className="mt-1 truncate font-display text-lg leading-snug">{serviceName}</h2>
                    <p className="hidden truncate text-sm text-ink-soft lg:block">{serviceDescription}</p>
                </div>
            </div>

            <div className="flex items-start justify-between gap-6 lg:contents">
                <p className="font-mono text-lg font-semibold tabular-nums lg:text-right">
                    {formatPrice(servicePrice)}{" "}
                    <span className="text-[11px] font-medium text-ink-soft">BDT</span>
                </p>
                <div className="w-44 lg:w-auto">
                    <BookingBar stats={stats} />
                </div>
            </div>

            <div className="flex items-center gap-2 lg:justify-end">
                <Link
                    to={`/singleServiceDetails/${_id}`}
                    className="tb-btn-line h-10 w-10 px-0"
                    aria-label={`View ${serviceName} in the catalog`}
                    title="View in catalog">
                    <IoOpenOutline size={17} aria-hidden />
                </Link>
                <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="tb-btn-line h-10 flex-1 px-4 lg:flex-none">
                    <MdEdit size={17} aria-hidden /> Edit
                </button>
                <button
                    type="button"
                    onClick={onDelete}
                    aria-label={`Delete ${serviceName}`}
                    title="Delete"
                    className="tb-btn h-10 w-10 border border-danger/30 px-0 text-danger hover:bg-danger hover:text-white">
                    <MdDeleteOutline size={19} aria-hidden />
                </button>
            </div>

            <Dialog
                open={editing}
                onClose={() => setEditing(false)}
                title="Edit service"
                description="Changes show in the catalog as soon as you save.">
                {editing && (
                    <EditForm
                        service={service}
                        onCancel={() => setEditing(false)}
                        onSaved={(changes) => {
                            onUpdated(_id, changes);
                            setEditing(false);
                        }}
                    />
                )}
            </Dialog>
        </motion.li>
    );
});

ManageServiceRow.displayName = "ManageServiceRow";

export default ManageServiceRow;
