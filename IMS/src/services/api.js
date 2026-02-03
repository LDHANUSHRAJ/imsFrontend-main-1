import axios from "axios";

const api = axios.create({
    baseURL: "https://internshipportal-4iul.onrender.com",
});

api.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem("imsUser"));
    if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

export default api;
