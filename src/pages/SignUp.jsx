import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { IoCheckmark } from "react-icons/io5";
import AuthContext from "../context/AuthContext";
import AuthShell, { Divider, GoogleButton, PasswordField } from "../components/AuthShell";
import { authMessage } from "../utils/format";

const RULES = [
    { id: "len", label: "6+ characters", test: (p) => p.length >= 6 },
    { id: "upper", label: "A capital letter", test: (p) => /[A-Z]/.test(p) },
    { id: "lower", label: "A lowercase letter", test: (p) => /[a-z]/.test(p) },
];

const SignUp = () => {
    const { UserSignup, setUser, googleUser, updateProfileUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [password, setPassword] = useState("");
    const [busy, setBusy] = useState(false);
    const destination = location?.state || "/";

    const handleSignupUser = (e) => {
        e.preventDefault();
        const name = e.target.name.value.trim();
        const email = e.target.email.value;
        const photo = e.target.photo.value;

        const failed = RULES.find((r) => !r.test(password));
        if (failed) {
            toast.warning(`Password needs ${failed.label.toLowerCase()}.`);
            return;
        }

        setBusy(true);
        UserSignup(email, password)
            .then((result) => {
                fetch("https://task-buddy-server-side.vercel.app/users", {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({ name, email, photo }),
                }).catch(() => {});

                return updateProfileUser({ displayName: name, photoURL: photo }).then(() => {
                    setUser({ ...result.user, displayName: name, photoURL: photo });
                    toast.success(`Account created. Welcome, ${name.split(" ")[0]}.`);
                    navigate(destination);
                });
            })
            .catch((error) => toast.error(authMessage(error)))
            .finally(() => setBusy(false));
    };

    const handleGoogleUser = () => {
        googleUser()
            .then((result) => {
                setUser(result.user);
                toast.success("Signed in with Google");
                navigate(destination);
            })
            .catch((error) => toast.error(authMessage(error)));
    };

    return (
        <AuthShell
            eyebrow="New account"
            title="Create your account"
            intro="Book services, or list your own for others to book.">
            <form onSubmit={handleSignupUser} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                        <label htmlFor="name" className="tb-label">
                            Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            required
                            className="tb-field"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="tb-label">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="tb-field"
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="photo" className="tb-label">
                        Photo URL
                    </label>
                    <input
                        id="photo"
                        name="photo"
                        type="url"
                        required
                        className="tb-field"
                        placeholder="https://…"
                    />
                </div>
                <div>
                    <PasswordField
                        autoComplete="new-password"
                        onChange={(e) => setPassword(e.target.value)}
                        describedBy="pw-rules"
                    />
                    <ul id="pw-rules" className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-sm">
                        {RULES.map((r) => {
                            const ok = r.test(password);
                            return (
                                <li
                                    key={r.id}
                                    className={`flex items-center gap-1.5 transition-colors ${ok ? "text-deep" : "text-ink-soft"}`}>
                                    <span
                                        className={`flex h-4 w-4 items-center justify-center rounded-full border ${ok ? "border-deep bg-deep text-paper" : "border-rule"}`}>
                                        {ok && <IoCheckmark size={11} aria-hidden />}
                                    </span>
                                    {r.label}
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <button type="submit" disabled={busy} className="tb-btn-ink h-12 w-full text-[15px]">
                    {busy ? "Creating account…" : "Create account"}
                </button>
            </form>

            <Divider />
            <GoogleButton onClick={handleGoogleUser}>Sign up with Google</GoogleButton>

            <p className="mt-8 text-center text-ink-soft">
                Already have an account?{" "}
                <Link
                    className="font-bold text-plum underline-offset-4 hover:underline"
                    to="/signin"
                    state={location?.state}>
                    Sign in
                </Link>
            </p>
        </AuthShell>
    );
};

export default SignUp;
