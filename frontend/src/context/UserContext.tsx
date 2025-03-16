import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getProfile, logoutUser } from "../api/auth";

interface User {
    systemID: string;
    userId: string;
    email: string;
    userName: string;
}

interface UserContextType {
    user: User | null;
    logout: () => void;
}

const UserContext = createContext<UserContextType>({ user: null, logout: () => {} });

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getProfile();
                console.log("User profile response:", data); // Debugging log ✅
                if (data.user) {
                    setUser(data.user);
                }
            } catch (error) {
                console.error("Error fetching profile:", error); // Handle API errors ✅
            }
        };

        fetchProfile();
    }, []);

    const logout = async () => {
        await logoutUser();
        setUser(null);
    };

    return <UserContext.Provider value={{ user, logout }}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
