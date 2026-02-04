import { createContext, useContext, useState } from "react";
import { AuthService } from "../services/auth.service";
import api from "../services/api";

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
            // Call Real Backend Login
            console.log("Attempting login to:", api.defaults.baseURL);
            const authResponse = await AuthService.login({
                username: email,
                password: password
            });
            console.log("Login successful:", authResponse);

            const userData = {
                access_token: authResponse.access_token,
                token_type: authResponse.token_type,
                role: role,
                email: email
            };
            setUser(userData);
            localStorage.setItem("imsUser", JSON.stringify(userData));
            return userData;
        } catch (error) {
            console.error("Login failed:", error);
            // Enhance error message for the UI
            if (error.response) {
                console.error("Server Response:", error.response.data);
                throw new Error(error.response.data?.detail?.[0]?.msg || error.response.data?.message || `Login failed: ${error.response.status}`);
            } else if (error.request) {
                console.error("No response received:", error.request);
                throw new Error("Unable to connect to the server. Please check your internet connection or try again later.");
            } else {
                throw error;
            }
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("imsUser");
    };

    const updateUser = (data) => {
        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        localStorage.setItem("imsUser", JSON.stringify(updatedUser));
    };


    return (
        <AuthContext.Provider value={{ user, login, logout, updateUser, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
