import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { IoLocationOutline } from "react-icons/io5";
import { FaArrowRight } from "react-icons/fa";
import Avatar from "./ui/Avatar";
import { formatPrice } from "../utils/format";

const ServiceCard = forwardRef(({ service, preview = false, index = 0 }, ref) => {
    const {_id, serviceImage, serviceName, serviceDescription, serviceArea, servicePrice, serviceProvider = {},} = service;

    return (
        <motion.article
            ref={ref}
            layout={!preview}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}
            transition={{ duration: 0.4, delay: Math.min(index, 8) * 0.05, ease: [0.22, 1, 0.36, 1] }}
            whileHover={preview ? undefined : { y: -4 }}
            className="group tb-card relative flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-[0_18px_40px_-22px_rgb(var(--ink)/0.45)]">
            <div className="relative aspect-[4/3] overflow-hidden bg-paper">
                {serviceImage ? (
                    <img
                        src={serviceImage}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center font-mono text-xs uppercase tracking-[0.18em] text-ink-soft">
                        Image appears here
                    </div>
                )}
                <span className="absolute right-3 top-3 rounded-md bg-card/95 px-2.5 py-1 font-mono text-[13px] font-semibold text-ink shadow-sm backdrop-blur">
                    {servicePrice ? formatPrice(servicePrice) : "—"}{" "}
                    <span className="text-[10px] font-medium text-ink-soft">BDT</span>
                </span>
            </div>

            <div className="flex flex-1 flex-col p-5">
                <p className="tb-eyebrow flex items-center gap-1">
                    <IoLocationOutline aria-hidden className="text-sm" />
                    {serviceArea || "Service area"}
                </p>
                <h3 className="mt-2 font-display text-xl leading-snug">
                    {preview ? (
                        serviceName || "Service name"
                    ) : (
                        <Link to={`/singleServiceDetails/${_id}`}
                            className="after:absolute after:inset-0 focus-visible:outline-none">
                            {serviceName}
                        </Link>
                    )}
                </h3>
                <p className="mb-5 mt-2 line-clamp-2 text-[15px] leading-relaxed text-ink-soft">
                    {serviceDescription || "A short description of what learners get."}
                </p>

                <div className="mt-auto flex items-center justify-between gap-3 border-t border-dashed border-rule pt-4">
                    <span className="flex min-w-0 items-center gap-2.5">
                        <Avatar
                            src={serviceProvider.providerImage}
                            name={serviceProvider.providerName}
                            size="h-8 w-8"
                        />
                        <span className="truncate text-sm font-bold">
                            {serviceProvider.providerName || "You"}
                        </span>
                    </span>
                    {!preview && (
                        <span className="flex shrink-0 items-center gap-1.5 text-sm font-bold text-plum"
                            aria-hidden>
                            Details
                            <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
                        </span>
                    )}
                </div>
            </div>
            <span className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-stamp opacity-0 transition-opacity group-has-[:focus-visible]:opacity-100" />
        </motion.article>
    );
});

ServiceCard.displayName = "ServiceCard";

export default ServiceCard;
