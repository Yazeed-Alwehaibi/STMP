import { ReactNode, useMemo } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const { user } = useUser();

    // Memoize the user to avoid unnecessary re-renders
    const memoizedUser = useMemo(() => user, [user]);

    // Log user info only if you need to debug
    if (memoizedUser) {
        console.log('User in ProtectedRoute:', memoizedUser);
    }

    return memoizedUser ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
