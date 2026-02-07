import api from "./api";
import type {
    GuideAssignment,
    StudentProfileExtended,
    GuideFeedback,
    AssignmentRecommendation,
    AssignmentStats
} from "../types";

export const GuideService = {
    getAllAssignments: async (): Promise<GuideAssignment[]> => {
        const response = await api.get<GuideAssignment[]>("/faculty/assignments");
        return response.data;
    },

    getAssignmentById: async (id: string): Promise<GuideAssignment | null> => {
        const response = await api.get<GuideAssignment>(`/faculty/assignments/${id}`);
        return response.data;
    },

    getStudentProfile: async (id: string): Promise<StudentProfileExtended | null> => {
        const response = await api.get<StudentProfileExtended>(`/faculty/students/${id}`);
        return response.data;
    },

    assignGuide: async (studentId: string, facultyId: string): Promise<void> => {
        await api.post("/faculty/assign", { student_id: studentId, faculty_id: facultyId });
    },

    submitFeedback: async (studentId: string, feedback: GuideFeedback): Promise<void> => {
        await api.post(`/faculty/students/${studentId}/feedback`, feedback);
    },

    updateFeedback: async (studentId: string, feedback: GuideFeedback): Promise<void> => {
        await api.put(`/faculty/students/${studentId}/feedback`, feedback);
    },

    deleteFeedback: async (studentId: string): Promise<void> => {
        await api.delete(`/faculty/students/${studentId}/feedback`);
    },

    getAssignmentStats: async (): Promise<AssignmentStats> => {
        const response = await api.get<AssignmentStats>("/faculty/stats/assignments");
        return response.data;
    },

    autoAssignGuides: async (): Promise<AssignmentRecommendation[]> => {
        const response = await api.post<AssignmentRecommendation[]>("/faculty/auto-assign/recommendations");
        return response.data;
    },

    confirmAutoAssignments: async (recommendations: AssignmentRecommendation[]): Promise<void> => {
        await api.post("/faculty/auto-assign/confirm", { recommendations });
    }
};
