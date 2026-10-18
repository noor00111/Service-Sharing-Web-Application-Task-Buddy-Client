import { Link, useLoaderData } from "react-router-dom";
import { motion } from "framer-motion";
import { IoLocationOutline, IoArrowBack } from "react-icons/io5";
import { FaArrowRight } from "react-icons/fa";
import Avatar from "../components/ui/Avatar";
import { formatPrice } from "../utils/format";

const ease = [0.22, 1, 0.36, 1];

const SingleServiceDetails = () => {
    const {_id, serviceImage, serviceName, serviceDescription, serviceArea, servicePrice, serviceProvider = {}} = useLoaderData();

    return (
        <div className="tb-container py-10 md:py-14">
            <Link to="/services"
                className="inline-flex items-center gap-2 text-sm font-bold text-ink-soft transition-colors hover:text-ink">
                <IoArrowBack aria-hidden /> All services
            </Link>

            <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-12">
                <motion.article
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease }}>
                    <div className="overflow-hidden rounded-2xl border border-rule bg-card">
                        <img src={serviceImage} alt="" className="aspect-[16/9] w-full object-cover" />
                    </div>
                    <p className="tb-eyebrow mt-8 flex items-center gap-1.5">
                        <IoLocationOutline aria-hidden className="text-sm" /> {serviceArea}
                    </p>
                    <h1 className="mt-3 font-display text-4xl leading-[1.05] md:text-5xl">{serviceName}</h1>
                    <p className="mt-6 max-w-[65ch] whitespace-pre-line text-lg leading-relaxed text-ink-soft">
                        {serviceDescription}
                    </p>
                </motion.article>

                <motion.aside
                    className="lg:sticky lg:top-24 lg:self-start"
                    initial={{ opacity: 0, y: 24, rotate: 1.5 }}
                    animate={{ opacity: 1, y: 0, rotate: 0 }}
                    transition={{ duration: 0.6, delay: 0.15, ease }}>
                    <div className="tb-slip shadow-[0_24px_50px_-30px_rgb(var(--ink)/0.45)]">
                        <div className="p-6">
                            <p className="tb-eyebrow">Price</p>
                            <p className="mt-1 font-mono text-4xl font-semibold">
                                {formatPrice(servicePrice)}{" "}
                                <span className="text-sm font-medium text-ink-soft">BDT</span>
                            </p>
                        </div>

                        <div className="tb-perf p-6">
                            <p className="tb-eyebrow">Provided by</p>
                            <div className="mt-3 flex items-center gap-3">
                                <Avatar
                                    src={serviceProvider.providerImage}
                                    name={serviceProvider.providerName}
                                    size="h-14 w-14"
                                />
                                <div className="min-w-0">
                                    <p className="truncate text-lg font-bold">
                                        {serviceProvider.providerName}
                                    </p>
                                    <p className="flex items-center gap-1 text-sm text-ink-soft">
                                        <IoLocationOutline aria-hidden /> {serviceArea}
                                    </p>
                                </div>
                            </div>

                            <Link
                                to={`/bookService/${_id}`}
                                className="tb-btn-ink group mt-6 h-12 w-full text-[15px]">
                                Book this service
                                <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
                            </Link>
                            <p className="mt-3 text-center text-sm text-ink-soft">
                                Next you&apos;ll pick a date and add a note.
                            </p>
                        </div>
                    </div>
                </motion.aside>
            </div>
        </div>
    );
};

export default SingleServiceDetails;
