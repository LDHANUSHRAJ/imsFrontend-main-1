import { createContext, useContext, useState } from "react";
import { loginUser } from "../services/auth.service";

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

    const login = async (email, password, role) => {
        try {
            // 1. Try Real Backend Login
            // Note: The backend might expect different payload structure. 
            // We pass what the pages provide.
            try {
                const data = await loginUser({ email, password, role });
                const userData = { ...data, role: role || data.role }; // Ensure role is present
                setUser(userData);
                localStorage.setItem("imsUser", JSON.stringify(userData));
                return userData;
            } catch (apiError) {
                // If API fails, check for Dev/Demo credentials
                console.warn("API Login failed, checking demo credentials...", apiError);

                // MOCK CREDENTIALS FOR TESTING
                const validMock =
                    (email === "ic@christ.in" && role === "IC") ||
                    (email === "hod@christ.in" && role === "HOD") ||
                    (email === "faculty@christ.in" && role === "FACULTY") ||
                    (email === "recruiter@company.com" && role === "RECRUITER");

                // Check dynamically registered users from localStorage (for "Store Password" demo)
                const storedUsers = JSON.parse(localStorage.getItem("mock_users") || "[]");
                const registeredUser = storedUsers.find(u => u.email === email && u.role === role);

                if ((validMock && password === "admin") || (registeredUser && registeredUser.password === password)) {
                    const mockUser = {
                        name: registeredUser ? registeredUser.companyName || registeredUser.recruiterName : (role === "RECRUITER" ? "John Doe (Recruiter)" : `Dr. ${role} User`),
                        email,
                        role,
                        token: "mock-jwt-token"
                    };
                    setUser(mockUser);
                    localStorage.setItem("imsUser", JSON.stringify(mockUser));
                    return mockUser;
                }

                throw apiError; // Throw original error if not a valid mock
            }
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("imsUser");
    };


    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
