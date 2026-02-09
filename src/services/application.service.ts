import api from "./api";

export const ApplicationService = {
    getById: async (id: string) => {
        const response = await api.get(`/applications/${id}`);
        return response.data;
    },

    updateStatus: async (id: string, status: 'APPROVED' | 'REJECTED', feedback?: string) => {
        if (status === 'APPROVED') {
            const response = await api.put(`/applications/${id}/approve`);
            return response.data;
        } else if (status === 'REJECTED') {
            const response = await api.put(`/applications/${id}/reject`, { feedback: feedback || "No feedback provided" });
            return response.data;
        }
    },

    // Helper to match component expectations if needed
    generateLOR: async (id: string) => {
        const response = await api.post(`/applications/${id}/lor`);
        return response.data;
    },

    // Legacy Support
    getAll: async () => {
        const response = await api.get("/applications");
        return response.data;
    }
};

export const fetchApplications = ApplicationService.getAll;
export const fetchApplicationById = ApplicationService.getById;
export const updateStatus = ApplicationService.updateStatus;
export const generateLOR = ApplicationService.generateLOR;
