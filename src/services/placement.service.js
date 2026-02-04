import api from "./api";

export const fetchPendingInternships = async () => {
    const response = await api.get("/internships/pending");
    return response.data;
};

export const approveInternship = async (id) => {
    const response = await api.post(`/internships/${id}/approve`);
    return response.data;
};

export const rejectInternship = async (id) => {
    const response = await api.post(`/internships/${id}/reject`);
    return response.data;
};
