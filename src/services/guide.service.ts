import api from "./api";
import type { GuideAssignment } from "../types";

// Assuming 'GuideAssignment' structure maps to the 'Internship' object from backend
// GET /internships/approved likely returns list of internships that need guides or are active.

export const GuideService = {
    getAll: async (): Promise<GuideAssignment[]> => {
        const response = await api.get("/internships/approved");
        // Transform backend data to match frontend expectations if necessary
        return response.data.map((item: any) => ({
            id: item._id || item.id,
            studentName: item.studentName || item.student?.name || 'Unknown Student',
            studentRegNo: item.studentRegNo || item.student?.regNo || 'N/A',
            internshipTitle: item.title || item.job?.title || 'Internship',
            companyName: item.companyName || item.company?.name || 'Company',
            status: item.status || 'IN_PROGRESS',
            guide: item.guide,
            feedback: item.feedback || []
        }));
    },

    assignGuide: async (id: string, guideName: string) => {
        // Using PUT /internships/{id} to update the guide field
        const response = await api.put(`/internships/${id}`, { guide: guideName });
        return response.data;
    },

    addFeedback: async (id: string, feedbackMsg: string) => {
        // Fetch current first to append
        const current = await api.get(`/internships/${id}`);
        const currentFeedback = current.data.feedback || [];
        const updatedFeedback = [...currentFeedback, feedbackMsg];

        const response = await api.put(`/internships/${id}`, { feedback: updatedFeedback });
        return response.data;
    }
};
