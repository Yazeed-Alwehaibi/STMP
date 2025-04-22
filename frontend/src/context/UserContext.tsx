// context/UserContext.tsx
import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from "react";
import { getProfile, logoutUser } from "../api/auth";

interface User {
  systemID: string;
  id: string;
  email: string;
  userName: string;
  role?: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  logout: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        console.log("User profile response:", data);
        if (data.user) {
          setUser(data.user);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  const value = useMemo(() => ({ user, setUser, logout }), [user]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
