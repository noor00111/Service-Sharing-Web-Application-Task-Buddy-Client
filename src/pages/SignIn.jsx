import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthContext from "../context/AuthContext";
import AuthShell, { Divider, GoogleButton, PasswordField } from "../components/AuthShell";
import { authMessage } from "../utils/format";

const SignIn = () => {
    const { userSignIn, setUser, googleUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [busy, setBusy] = useState(false);
    const destination = location?.state || "/";

    const handleLoginUser = (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        setBusy(true);
        userSignIn(email, password)
            .then((result) => {
                setUser(result.user);
                toast.success("Signed in");
                navigate(destination);
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
            eyebrow="Welcome back"
            title="Sign in"
            intro="Pick up where you left off with your bookings and services.">
            <form onSubmit={handleLoginUser} className="space-y-5">
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
                        placeholder="you@example.com"
                    />
                </div>
                <PasswordField autoComplete="current-password" />
                <button type="submit" disabled={busy} className="tb-btn-ink h-12 w-full text-[15px]">
                    {busy ? "Signing in…" : "Sign in"}
                </button>
            </form>

            <Divider />
            <GoogleButton onClick={handleGoogleUser}>Continue with Google</GoogleButton>

            <p className="mt-8 text-center text-ink-soft">
                New to Task Buddy?{" "}
                <Link className="font-bold text-plum underline-offset-4 hover:underline"
                    to="/signup"
                    state={location?.state}>
                    Create an account
                </Link>
            </p>
        </AuthShell>
    );
};

export default SignIn;
