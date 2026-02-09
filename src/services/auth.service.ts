import api from "./api";
import type { AuthResponse, CorporateRegister, StudentRegister, User } from "../types";

export const AuthService = {
    registerCorporate: async (data: CorporateRegister): Promise<User> => {
        const response = await api.post<User>("/auth/register", data);
        return response.data;
    },

    registerStudent: async (data: StudentRegister): Promise<User> => {
        const response = await api.post<User>("/auth/register-student", data);
        return response.data;
    },

    login: async (credentials: { username: string; password: string; grant_type?: string }): Promise<AuthResponse> => {
        const formData = new URLSearchParams();
        formData.append('username', credentials.username);
        formData.append('password', credentials.password);
        // formData.append('grant_type', credentials.grant_type || 'password'); // Standard OAuth2 usually needs this, but user doc only showed username/password. Keeping it simple or as per standard.

        const response = await api.post<AuthResponse>("/auth/login", formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        return response.data;
    },

    // Optional helper if we need to get user details after login, 
    // assuming there might be an endpoint or we rely on token decoding.
    // Spec doesn't store /me, but we can try /internships/my if user is a student/corporate to valid token? 
    // Or maybe just store the token.

    updateProfile: async (data: Partial<User>): Promise<User> => {
        // ... same mock implementation
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ ...data } as User);
            }, 500);
        });
    },

    getCurrentUser: async (): Promise<User> => {
        const response = await api.get<User>("/auth/users/me");
        return response.data;
    }
};
