import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import {createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile} from "firebase/auth";
import auth from "../firebase/Firebase.init";
import axios from "axios";

const googleProvider = new GoogleAuthProvider();
const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const UserSignup = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const userSignIn = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    };

    const userSignOut = () => {
        setLoading(true);
        return signOut(auth);
    };

    const googleUser = () => {
        return signInWithPopup(auth, googleProvider);
    };

    const updateProfileUser = (updatedData) => {
        return updateProfile(auth.currentUser, updatedData);
    };

    const userInfo = {
        user,
        setUser,
        loading,
        UserSignup,
        userSignIn,
        userSignOut,
        googleUser,
        updateProfileUser,
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser?.email) {
                const user = { email: currentUser.email };

                axios.post("https://task-buddy-server-side.vercel.app/jwt", user, { withCredentials: true })
                    .then((res) => {
                        console.log(res.data);
                        setLoading(false);
                    });
            } else {
                axios.post("https://task-buddy-server-side.vercel.app/signout",{},{withCredentials: true,})
                    .then((res) => {
                        console.log("signout", res.data);
                        setLoading(false);
                    });
            }
        });
        return () => {
            unsubscribe();
        };
    }, []);

    return <AuthContext.Provider value={userInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
