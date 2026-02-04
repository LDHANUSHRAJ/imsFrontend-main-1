import api from "./api";
import {
    type Internship,
    type InternshipCreate,
    type InternshipUpdate,
    type StudentApplication
} from "../types";

export const InternshipService = {
    // Basic CRUD
    create: async (data: InternshipCreate): Promise<Internship> => {
        const response = await api.post<Internship>("/internships", data);
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

    close: async (id: string): Promise<string> => {
        const response = await api.patch<string>(`/internships/${id}/close`);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/internships/${id}`);
    },

    update: async (id: string, data: InternshipUpdate): Promise<Internship> => {
        const response = await api.patch<Internship>(`/internships/${id}`, data);
        return response.data;
    },

    getById: async (id: string): Promise<Internship> => {
        const response = await api.get<Internship>(`/internships/${id}`);
        return response.data;
    },

    // Applications
    apply: async (id: string, formData: FormData): Promise<StudentApplication> => {
        // Spec says multipart/form-data for resume etc.
        const response = await api.post<StudentApplication>(`/internships/${id}/apply`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    },

    getApplications: async (id: string): Promise<StudentApplication[]> => {
        const response = await api.get<StudentApplication[]>(`/internships/${id}/applications`);
        return response.data;
    },

    // Placement/Admin approval
    getPendingInternships: async (): Promise<Internship[]> => {
        const response = await api.get<Internship[]>("/internships/pending");
        return response.data;
    },

    approve: async (id: string): Promise<Internship> => {
        const response = await api.post<Internship>(`/internships/${id}/approve`);
        return response.data;
    },

    reject: async (id: string): Promise<Internship> => {
        const response = await api.post<Internship>(`/internships/${id}/reject`);
        return response.data;
    },

    // Admin list all?
    // GET /admin/internships is in Admin section
};
