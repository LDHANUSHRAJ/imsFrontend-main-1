import api from "./api";

export const InternshipService = {
    // Basic CRUD
    create: async (data: InternshipCreate): Promise<Internship> => {
        const response = await api.post<Internship>("/internships", data);
        return response.data;
    },

    getAll: async (): Promise<Internship[]> => {
        const response = await api.get<Internship[]>("/internships/approved");
        return response.data;
    },

    getMyInternships: async (): Promise<Internship[]> => {
        const response = await api.get<Internship[]>("/internships/my");
        return response.data;
    },

    getApprovedInternships: async (): Promise<Internship[]> => {
        const response = await api.get<Internship[]>("/internships/approved");
        return response.data;
    },

    getPendingInternships: async (): Promise<Internship[]> => {
        const response = await api.get<Internship[]>("/internships/pending");
        return response.data;
    },

    getExternalPending: async (): Promise<any[]> => {
        const response = await api.get<any[]>("/internships/external/pending");
        return response.data;
    },

    close: async (id: string): Promise<string> => {
        await api.post(`/internships/${id}/close`);
        return 'Closed';
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/internships/${id}`);
    },

    update: async (id: string, data: InternshipUpdate): Promise<Internship> => {
        const response = await api.put<Internship>(`/internships/${id}`, data);
        return response.data;
    },

    getById: async (id: string): Promise<Internship> => {
        const response = await api.get<Internship>(`/internships/${id}`);
        return response.data;
    },

    // Applications
    apply: async (id: string, data: { resume_url: string; github_link?: string; linkedin_link?: string }): Promise<StudentApplication> => {
        const response = await api.post<StudentApplication>(`/internships/${id}/apply`, data);
        return response.data;
    },

    submitExternal: async (data: { company_name: string; position: string; offer_letter_url: string }): Promise<any> => {
        const response = await api.post("/internships/external", data);
        return response.data;
    },

    getPlacementStatus: async (): Promise<any> => {
        const response = await api.get("/internships/student/placement-status");
        return response.data;
    },

    uploadOfferLetter: async (applicationId: string, file: File): Promise<StudentApplication> => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post<StudentApplication>(`/internships/applications/${applicationId}/upload-offer`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    getApplications: async (id: string): Promise<StudentApplication[]> => {
        const response = await api.get<StudentApplication[]>(`/internships/${id}/applications`);
        return response.data;
    },

    getApplicationsByRecruiter: async (): Promise<StudentApplication[]> => {
        const response = await api.get<StudentApplication[]>("/internships/recruiter/applications");
        return response.data;
    },

    getTopApplicants: async (limit: number = 10): Promise<StudentApplication[]> => {
        const response = await api.get<StudentApplication[]>(`/internships/recruiter/top-applicants?limit=${limit}`);
        return response.data;
    },

    // Placement/Admin approval
    approve: async (id: string): Promise<Internship> => {
        const response = await api.post<Internship>(`/admin/internships/${id}/approve`);
        return response.data;
    },

    reject: async (id: string): Promise<Internship> => {
        const response = await api.post<Internship>(`/admin/internships/${id}/reject`);
        return response.data;
    },

    activateInternship: async (applicationId: string): Promise<StudentApplication> => {
        const response = await api.post<StudentApplication>(`/internships/applications/${applicationId}/activate`);
        return response.data;
    },

    // Weekly Reports
    submitWeeklyReport: async (data: {
        title: string;
        description: string;
        week_number: number;
        achievements: string;
        challenges: string;
        plans: string;
    }): Promise<any> => {
        const response = await api.post("/reports", data);
        return response.data;
    },

    getClassReports: async (): Promise<WeeklyLog[]> => {
        const response = await api.get<WeeklyLog[]>("/reports/class-reports");
        return response.data;
    },

    getWeeklyLogs: async (internshipId: string): Promise<WeeklyLog[]> => {
        const response = await api.get<WeeklyLog[]>(`/internships/${internshipId}/logs`);
        return response.data;
    },

    getCompletionStatus: async (internshipId: string): Promise<InternshipCompletion> => {
        const response = await api.get<InternshipCompletion>(`/internships/${internshipId}/completion`);
        return response.data;
    }
};

import type {
    Internship,
    InternshipCreate,
    InternshipUpdate,
    StudentApplication,
    WeeklyLog,
    InternshipCompletion
} from "../types";
