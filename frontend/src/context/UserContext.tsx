import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getProfile, logoutUser } from "../api/auth";

interface User {
  systemID: string;
  userId: string;
  email: string;
  userName: string;
  role?: string; // include role if you're using it for redirection
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void; // ✅ Add setUser to the context
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

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
