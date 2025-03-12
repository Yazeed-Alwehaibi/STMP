import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getProfile, logoutUser } from "../api/auth";

interface User {
    userId: string;
    email: string;
}

interface UserContextType {
    user: User | null;
    logout: () => void;
}

const UserContext = createContext<UserContextType>({ user: null, logout: () => {} });

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // Get the user profile only when the component mounts
        getProfile().then((data) => {
            if (data.user) {
                setUser(data.user); // Only update if there's a user
            }
        });
    }, []); // Empty dependency array ensures this runs only on mount

    const logout = async () => {
        await logoutUser();
        setUser(null); // Clear the user state on logout
    };

    return <UserContext.Provider value={{ user, logout }}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
