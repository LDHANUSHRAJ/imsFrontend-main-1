import axios from "axios";

// Using the URL from the previous file, or we can use a relative one if proxy is set.
// For now, I'll stick to the one that was there or the user's running backend.
// Since the user gave an openapi.json, they might be running locally too. 
// But the previous file had a deployed URL. Use that for now.
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
            if (user?.access_token) {
                config.headers.Authorization = `Bearer ${user.access_token}`;
            } else if (user?.token) {
                // Fallback for old stored format
                config.headers.Authorization = `Bearer ${user.token}`;
            }
        } catch (e) {
            console.error("Error parsing user from local storage", e);
        }
    }
    return config;
});

export default api;
