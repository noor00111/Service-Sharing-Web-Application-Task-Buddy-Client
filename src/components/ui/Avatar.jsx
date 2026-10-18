import { useState } from "react";
import { initials } from "../../utils/format";

const Avatar = ({ src, name, size = "h-9 w-9", className = "" }) => {
    const [failed, setFailed] = useState(false);

    if (!src || failed) {
        return (
            <span
                className={`${size} ${className} inline-flex shrink-0 items-center justify-center rounded-full bg-stamp/15 font-mono text-xs font-semibold text-stamp`}
            >
                {initials(name)}
            </span>
        );
    }
    return (
        <img
            src={src}
            alt={name || ""}
            onError={() => setFailed(true)}
            className={`${size} ${className} shrink-0 rounded-full object-cover ring-1 ring-rule`}
        />
    );
};

export default Avatar;
