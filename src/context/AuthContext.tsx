import { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import { AuthService } from '../services/auth.service';
import type { User } from '../types';

// Define which roles are allowed for each login portal
export const STUDENT_ROLES = ['STUDENT'];
export const CORPORATE_ROLES = ['CORPORATE', 'RECRUITER'];
export const STAFF_ROLES = ['FACULTY', 'PLACEMENT_OFFICE', 'PLACEMENT_HEAD', 'PLACEMENT', 'HOD', 'PROGRAMME_COORDINATOR', 'ADMIN', 'IC'];

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string, expectedRole?: string) => Promise<void>;
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
                if (storedUser.startsWith('{') || storedUser.startsWith('[')) {
                    const parsedUser = JSON.parse(storedUser);
                    if (parsedUser && (parsedUser.access_token || parsedUser.token)) {
                        setUser(parsedUser);
                        setIsAuthenticated(true);
                    }
                } else {
                    localStorage.removeItem('imsUser');
                }
            } catch (error) {
                console.error("Auth check failed", error);
                localStorage.removeItem('imsUser');
                logout();
            }
        }
        setLoading(false);
    };

    /**
     * Validate if the user's role is allowed for the portal they're trying to access
     */
    const validatePortalAccess = (userRole: string, expectedRole: string): void => {
        console.log('Validating portal access - User Role:', userRole, 'Expected:', expectedRole);

        // For STUDENT portal - ONLY students allowed
        if (expectedRole === 'STUDENT') {
            if (!STUDENT_ROLES.includes(userRole)) {
                throw new Error(`Access denied. This portal is for Students only. Your account is registered as "${userRole}". Please use the correct portal.`);
            }
            return;
        }

        // For CORPORATE portal - ONLY corporate/recruiters allowed
        if (expectedRole === 'CORPORATE' || expectedRole === 'RECRUITER') {
            if (!CORPORATE_ROLES.includes(userRole)) {
                throw new Error(`Access denied. This portal is for Corporate/Recruiters only. Your account is registered as "${userRole}". Please use the correct portal.`);
            }
            return;
        }

        // For Staff portal - user must select the EXACT role that matches their account
        if (STAFF_ROLES.includes(expectedRole)) {
            // Allow some role variations
            const roleMatches =
                userRole === expectedRole ||
                (expectedRole === 'PLACEMENT_OFFICE' && userRole === 'PLACEMENT') ||
                (expectedRole === 'PLACEMENT' && userRole === 'PLACEMENT_OFFICE') ||
                (expectedRole === 'PROGRAMME_COORDINATOR' && userRole === 'IC') ||
                (expectedRole === 'IC' && userRole === 'PROGRAMME_COORDINATOR');

            if (!roleMatches) {
                throw new Error(`Access denied. You selected "${expectedRole}" but your account is registered as "${userRole}". Please select the correct role.`);
            }
            return;
        }

        // If expectedRole doesn't match any known category, deny access
        throw new Error(`Access denied. Invalid portal access attempt.`);
    };

    const login = async (email: string, password: string, expectedRole?: string) => {
        try {
            // 1. Authenticate to get token
            const authResponse = await AuthService.login({
                username: email,
                password: password,
                grant_type: 'password'
            });

            console.log('Auth response:', authResponse);

            // Store token temporarily so we can fetch profile
            const tempUser = {
                access_token: authResponse.access_token,
                token_type: authResponse.token_type,
                role: authResponse.role
            };
            localStorage.setItem('imsUser', JSON.stringify(tempUser));

            // 2. Get the role - first from login response, then from profile if needed
            let userRole = authResponse.role;
            let userProfile: any = null;

            // Try to fetch full profile to get role if not in login response
            try {
                userProfile = await AuthService.getCurrentUser();
                console.log('User profile:', userProfile);
                // Profile role takes priority if login didn't return role
                if (!userRole && userProfile?.role) {
                    userRole = userProfile.role;
                }
            } catch (profileError) {
                console.warn("Failed to fetch profile", profileError);
            }

            console.log('Final determined role:', userRole);

            // 3. VALIDATE PORTAL ACCESS - This MUST happen before proceeding
            if (expectedRole) {
                if (!userRole) {
                    // If we can't determine the role, deny access for safety
                    localStorage.removeItem('imsUser');
                    throw new Error('Unable to verify your account role. Please contact administrator.');
                }
                // This will throw an error if validation fails
                validatePortalAccess(userRole, expectedRole);
            }

            // 4. If validation passed, complete the login
            const finalUser = {
                ...(userProfile || {}),
                ...tempUser,
                role: userRole,
                name: userProfile?.name || email.split('@')[0],
                email: userProfile?.email || email
            };

            setUser(finalUser as User);
            setIsAuthenticated(true);
            localStorage.setItem('imsUser', JSON.stringify(finalUser));

        } catch (error) {
            console.error("Login failed", error);
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
