import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { AuthService } from '../services/auth.service';
import type { User } from '../types';

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string, role?: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    loading: boolean;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const storedUser = localStorage.getItem('imsUser');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                if (parsedUser && parsedUser.access_token) {
                    // Start with stored user to avoid flicker
                    setUser(parsedUser);
                    setIsAuthenticated(true);

                    // Optionally verify token or refresh profile here
                    // checkTokenValidity(parsedUser.access_token);
                }
            } catch (error) {
                console.error("Auth check failed", error);
                logout();
            }
        }
        setLoading(false);
    };

    const login = async (email: string, password: string, role?: string) => {
        try {
            // 1. Authenticate to get token
            const authResponse = await AuthService.login({
                username: email,
                password: password,
                grant_type: 'password'
            });

            // 2. Fetch User Profile
            // We need to store token first so api.ts interceptor works? 
            // Or we manually attach it?
            // Assuming api.ts uses localStorage 'imsUser' to get token.
            // So we must save a partial user with token first.
            const tempUser = { access_token: authResponse.access_token, token_type: authResponse.token_type };
            localStorage.setItem('imsUser', JSON.stringify(tempUser));

            let userProfile;
            try {
                userProfile = await AuthService.getCurrentUser();
            } catch (profileError) {
                console.warn("Failed to fetch profile, using fallback", profileError);
                // Fallback for roles that might not have a profile endpoint ready
                userProfile = {
                    id: 'temp-id',
                    name: email.split('@')[0],
                    email: email,
                    role: role || 'STUDENT' // Fallback role
                };
            }

            // 3. Merge and Save
            // Ensure we keep the token!
            const finalUser = { ...userProfile, ...tempUser };
            // Ensure role is set if missing from profile (backend might not return it in profile sometimes?)
            if (!finalUser.role && role) {
                finalUser.role = role;
            }

            setUser(finalUser as User);
            setIsAuthenticated(true);
            localStorage.setItem('imsUser', JSON.stringify(finalUser));

        } catch (error) {
            console.error("Login failed", error);
            // Clean up any partial state
            localStorage.removeItem('imsUser');
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('imsUser');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated, loading, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
