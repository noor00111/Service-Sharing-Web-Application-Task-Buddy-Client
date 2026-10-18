export const formatPrice = (price) => {
    const n = Number(price);
    return Number.isFinite(n) ? n.toLocaleString("en-US") : price;
};

export const formatDate = (value) => {
    if (!value) return "No date set";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

export const STATUSES = ["pending", "working", "completed"];

export const normalizeStatus = (status) => {
    const s = String(status || "pending").toLowerCase();
    return STATUSES.includes(s) ? s : "pending";
};

export const initials = (name = "") =>
    name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0].toUpperCase())
        .join("") || "?";

export const slipNumber = (id = "") => id.slice(-5).toUpperCase().padStart(5, "0");

const AUTH_MESSAGES = {
    "auth/invalid-credential": "Email or password is incorrect.",
    "auth/wrong-password": "Email or password is incorrect.",
    "auth/user-not-found": "No account uses this email. Sign up instead.",
    "auth/email-already-in-use": "An account with this email already exists. Sign in instead.",
    "auth/weak-password": "Password must be at least 6 characters.",
    "auth/invalid-email": "Enter a valid email address.",
    "auth/popup-closed-by-user": "Google sign-in was closed before it finished.",
    "auth/too-many-requests": "Too many attempts. Wait a minute and try again.",
};

export const authMessage = (error) =>
    AUTH_MESSAGES[error?.code] || error?.message || "Something went wrong. Try again.";
