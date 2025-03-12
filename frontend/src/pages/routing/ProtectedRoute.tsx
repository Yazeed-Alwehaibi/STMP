import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const { user } = useUser();
    return user ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
