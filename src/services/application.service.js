import api from "./api";

// Fetch all applications
export const fetchApplications = async () => {
    const response = await api.get("/applications");
    return response.data;
};

// Fetch single application details
export const fetchApplicationById = async (id) => {
    const response = await api.get(`/applications/${id}`);
    return response.data;
};

// Approve application (Part C flow)
export const approveApplication = async (id) => {
    const response = await api.put(`/applications/${id}/approve`);
    return response.data;
};

// Reject application
export const rejectApplication = async (id, feedback) => {
    const response = await api.put(`/applications/${id}/reject`, { feedback });
    return response.data;
};

// Generate Letter of Recommendation
export const generateLOR = async (id) => {
    const response = await api.post(`/applications/${id}/lor`);
    return response.data;
};
