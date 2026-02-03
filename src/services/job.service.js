import api from "./api";

export const fetchJobs = async () => {
    const response = await api.get("/internships/approved");
    return response.data;
};

export const fetchJobsByRecruiter = async () => {
    const response = await api.get("/internships/my");
    return response.data;
};

export const createJob = async (jobData) => {
    const response = await api.post("/internships", jobData);
    return response.data;
};

export const updateJob = async (id, jobData) => {
    const response = await api.put(`/internships/${id}`, jobData);
    return response.data;
};

export const updateJobStatus = async (id, statusData) => {
    // statusData: { status: 'APPROVED' | 'REJECTED', feedback: '...' }
    const response = await api.put(`/internships/${id}/status`, statusData);
    return response.data;
};
