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
    const response = await api.patch(`/internships/${id}`, jobData);
    return response.data;
};

export const closeJob = async (id) => {
    const response = await api.patch(`/internships/${id}/close`);
    return response.data;
};

export const deleteJob = async (id) => {
    const response = await api.delete(`/internships/${id}`);
    return response.data;
};

export const applyForJob = async (id, applicationData) => {
    // API requires multipart/form-data: resume, github_link, linkedin_link
    const formData = new FormData();
    if (applicationData.resume) formData.append('resume', applicationData.resume);
    if (applicationData.github_link) formData.append('github_link', applicationData.github_link);
    if (applicationData.linkedin_link) formData.append('linkedin_link', applicationData.linkedin_link);

    const response = await api.post(`/internships/${id}/apply`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

export const fetchJobApplications = async (id) => {
    const response = await api.get(`/internships/${id}/applications`);
    return response.data;
};

// Keeping this for backward compatibility or refactoring later, 
// though user asked for specific placement approve/reject endpoints.
// Fixing "Publish" issue: likely expecting PATCH to /internships/{id} with status update
export const updateJobStatus = async (id, statusData) => {
    const response = await api.patch(`/internships/${id}`, statusData);
    return response.data;
};
