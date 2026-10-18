import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import AuthContext from "../context/AuthContext";
import PageHeader from "../components/ui/PageHeader";
import ServiceCard from "../components/ServiceCard";

const EMPTY = {
    serviceImage: "",
    serviceName: "",
    servicePrice: "",
    serviceArea: "",
    serviceDescription: "",
};

const AddService = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [draft, setDraft] = useState(EMPTY);
    const [submitting, setSubmitting] = useState(false);
    const update = (e) => setDraft((d) => ({ ...d, [e.target.name]: e.target.value }));

    const serviceProvider = {
        providerName: user.displayName,
        providerImage: user.photoURL,
        providerEmail: user.email,
    };

    const handleAddService = (e) => {
        e.preventDefault();
        const addedServices = {
            ...draft,
            serviceName: draft.serviceName.trim(),
            serviceArea: draft.serviceArea.trim(),
            serviceDescription: draft.serviceDescription.trim(),
            serviceProvider,
        };

        setSubmitting(true);
        fetch("https://task-buddy-server-side.vercel.app/services", {
            method: "POST",
            credentials: "include",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(addedServices),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.insertedId) {
                    toast.success("Service added to the catalog");
                    navigate("/services");
                } else {
                    toast.error(data.message || "The service wasn't added. Try again.");
                }
            })
            .catch(() => toast.error("Couldn't reach the server. Try again."))
            .finally(() => setSubmitting(false));
    };

    return (
        <>
            <PageHeader eyebrow="Your desk" title="Add a service">
                Describe what you offer. The preview shows how it will look in the catalog.
            </PageHeader>

            <div className="tb-container grid gap-12 lg:grid-cols-[minmax(0,1fr)_380px]">
                <motion.form
                    onSubmit={handleAddService}
                    className="tb-card space-y-6 p-6 sm:p-8"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
                    <div>
                        <label htmlFor="serviceName" className="tb-label">
                            Service name
                        </label>
                        <input
                            id="serviceName"
                            name="serviceName"
                            value={draft.serviceName}
                            onChange={update}
                            required
                            maxLength={60}
                            placeholder="e.g. Spoken English, one-to-one"
                            className="tb-field"
                        />
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <div>
                            <label htmlFor="servicePrice" className="tb-label">
                                Price (BDT)
                            </label>
                            <input
                                id="servicePrice"
                                name="servicePrice"
                                type="number"
                                min="0"
                                step="1"
                                inputMode="numeric"
                                value={draft.servicePrice}
                                onChange={update}
                                required
                                placeholder="4500"
                                className="tb-field font-mono"
                            />
                        </div>
                        <div>
                            <label htmlFor="serviceArea" className="tb-label">
                                Service area
                            </label>
                            <input
                                id="serviceArea"
                                name="serviceArea"
                                value={draft.serviceArea}
                                onChange={update}
                                required
                                placeholder="e.g. Sylhet Division"
                                className="tb-field"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="serviceImage" className="tb-label">
                            Image URL
                        </label>
                        <input
                            id="serviceImage"
                            name="serviceImage"
                            type="url"
                            value={draft.serviceImage}
                            onChange={update}
                            required
                            placeholder="https://…"
                            className="tb-field"
                        />
                    </div>

                    <div>
                        <div className="flex items-baseline justify-between">
                            <label htmlFor="serviceDescription" className="tb-label">
                                Description
                            </label>
                            <span className="font-mono text-[11px] text-ink-soft">
                                {draft.serviceDescription.length} / 600
                            </span>
                        </div>
                        <textarea
                            id="serviceDescription"
                            name="serviceDescription"
                            value={draft.serviceDescription}
                            onChange={update}
                            required
                            rows={6}
                            maxLength={600}
                            placeholder="What will learners get? Who is it for? How long does it take?"
                            className="tb-field resize-y"
                        />
                    </div>

                    <div className="flex flex-col-reverse gap-3 border-t border-dashed border-rule pt-6 sm:flex-row sm:items-center sm:justify-between">
                        <button
                            type="button"
                            onClick={() => setDraft(EMPTY)}
                            className="text-sm font-bold text-ink-soft hover:text-ink">
                            Clear form
                        </button>
                        <motion.button
                            whileTap={{ scale: 0.97 }}
                            type="submit"
                            disabled={submitting}
                            className="tb-btn-ink h-12 px-8 text-[15px]">
                            {submitting ? "Adding…" : "Add service"}
                        </motion.button>
                    </div>
                </motion.form>

                <aside className="lg:sticky lg:top-24 lg:self-start" aria-label="Preview">
                    <p className="tb-eyebrow mb-3">Preview</p>
                    <ServiceCard preview service={{ ...draft, serviceProvider }} />
                </aside>
            </div>
        </>
    );
};

export default AddService;
