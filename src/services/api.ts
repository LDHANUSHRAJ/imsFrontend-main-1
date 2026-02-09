import axios from "axios";

// Using the deployed URL from the user-provided documentation
export const BASE_URL = "https://internshipportal-4iul.onrender.com";

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const userStr = localStorage.getItem("imsUser");
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            // Check for access_token as per new login response
            const token = user?.access_token || user?.token;
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (e) {
            console.error("Error parsing user from local storage", e);
            // Optionally clear invalid storage
            // localStorage.removeItem("imsUser");
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Detailed Error Logging for Debugging
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error("API Error Response:", {
                url: error.config?.url,
                method: error.config?.method,
                status: error.response.status,
                data: error.response.data
            });
        } else if (error.request) {
            // The request was made but no response was received
            console.error("API No Response (Network/CORS):", error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error("API Request Setup Error:", error.message);
        }

        if (error.response?.status === 401) {
            // Auto-logout on unauthorized
            console.log('401 Unauthorized - clearing session');
            localStorage.removeItem("imsUser");
            // Only redirect if not already on a login page
            if (!window.location.pathname.includes('/login')) {
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default api;
