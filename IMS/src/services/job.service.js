import api from "./api";

export const fetchJobs = async () => {
    const response = await api.get("/jobs");
    return response.data;
};

export const fetchJobsByRecruiter = async (recruiterId) => {
    const response = await api.get(`/jobs?recruiterId=${recruiterId}`);
    return response.data;
};

export const createJob = async (jobData) => {
    const response = await api.post("/jobs", jobData);
    return response.data;
};

export const updateJob = async (id, jobData) => {
    const response = await api.put(`/jobs/${id}`, jobData);
    return response.data;
};

export const updateJobStatus = async (id, statusData) => {
    // statusData: { status: 'APPROVED' | 'REJECTED', feedback: '...' }
    const response = await api.put(`/jobs/${id}/status`, statusData);
    return response.data;
};
