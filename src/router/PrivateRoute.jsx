import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import Loading from "../components/Loading";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return <Loading></Loading>;
    }
    if (user && user?.email) {
        return children;
    }
    return <Navigate to={"/signin"} state={location.pathname}></Navigate>;
};

export default PrivateRoute;
