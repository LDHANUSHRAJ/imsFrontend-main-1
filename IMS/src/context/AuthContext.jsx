import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem("imsUser");
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            return null;
        }
    });
    // user = { role: "IC" | "HOD" | "FACULTY" | "RECRUITER" }

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem("imsUser", JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("imsUser");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
