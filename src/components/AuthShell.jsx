import { useState } from "react";
import { motion } from "framer-motion";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import Stamp from "./ui/Stamp";

const ease = [0.22, 1, 0.36, 1];

const AuthShell = ({ eyebrow, title, intro, children }) => (
    <div className="tb-container grid min-h-[calc(100vh-4rem)] items-center gap-12 py-12 lg:grid-cols-2 lg:gap-16">
        <motion.div
            className="dark relative hidden overflow-hidden rounded-2xl bg-[#403D88] p-10 text-ink [--card:64_61_136] [--ink-soft:248_200_210] lg:flex lg:min-h-[560px] lg:flex-col lg:justify-between"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease }}>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft">Task Buddy</p>
            <div>
                <p className="font-display text-4xl leading-[1.1]">
                    Every booking gets a slip.
                    <br />
                    Every slip gets a stamp.
                </p>
                <p className="mt-5 max-w-sm text-ink-soft">
                    Sign in to book services, list your own, and see each request move from pending to
                    completed.
                </p>
            </div>
            <div className="flex flex-wrap items-center gap-4" aria-hidden>
                <Stamp status="pending" stampIn delay={0.4} tilt={-9} />
                <Stamp status="working" stampIn delay={0.65} tilt={-3} />
                <Stamp status="completed" stampIn delay={0.9} tilt={-7} />
            </div>
        </motion.div>

        <motion.div
            className="mx-auto w-full max-w-md"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease }}>
            <p className="tb-eyebrow">{eyebrow}</p>
            <h1 className="mt-2 font-display text-4xl leading-tight">{title}</h1>
            {intro && <p className="mt-2 text-ink-soft">{intro}</p>}
            <div className="mt-8">{children}</div>
        </motion.div>
    </div>
);

export const PasswordField = ({
    id = "password",
    label = "Password",
    autoComplete,
    onChange,
    describedBy,
}) => {
    const [show, setShow] = useState(false);
    return (
        <div>
            <label htmlFor={id} className="tb-label">
                {label}
            </label>
            <div className="relative">
                <input
                    id={id}
                    name="password"
                    type={show ? "text" : "password"}
                    autoComplete={autoComplete}
                    onChange={onChange}
                    aria-describedby={describedBy}
                    required
                    className="tb-field pr-11"/>
                <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    aria-label={show ? "Hide password" : "Show password"}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded p-2 text-ink-soft hover:text-ink">
                    {show ? <IoEyeOffOutline size={18} /> : <IoEyeOutline size={18} />}
                </button>
            </div>
        </div>
    );
};

export const GoogleButton = ({ onClick, children, disabled }) => (
    <button type="button" onClick={onClick} disabled={disabled} className="tb-btn-line h-12 w-full bg-card">
        <FcGoogle size={18} aria-hidden />
        {children}
    </button>
);

export const Divider = () => (
    <div className="my-6 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft">
        <span className="h-px flex-1 bg-rule" /> or <span className="h-px flex-1 bg-rule" />
    </div>
);

export default AuthShell;
