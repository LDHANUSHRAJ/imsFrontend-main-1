import api from "./api";

export const RecruiterService = {
    // Get pending recruiters waiting for approval
    getPendingRecruiters: async (): Promise<any[]> => {
        const response = await api.get<any[]>("/auth/recruiter/pending-approvals");
        return response.data;
    },

    // Approve or reject a recruiter
    approveRecruiter: async (userId: string, approved: boolean = true): Promise<any> => {
        const response = await api.post(`/auth/recruiter/approve/${userId}`, null, {
            params: { approved }
        });
        return response.data;
    }
};
