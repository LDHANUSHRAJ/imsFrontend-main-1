
import api from "./api";
import { User, AdminUserCreate, Internship, Department } from "../types";

export const AdminService = {
    // User Management
    getUsers: async (): Promise<User[]> => {
        // Spec: GET /admin/users -> returns string? Likely returns User[]
        // The spec example says "string", but logic dictates JSON array. 
        // Assuming consistent API behavior.
        const response = await api.get<User[]>("/admin/users");
        return response.data;
    },

    createUser: async (data: AdminUserCreate): Promise<void> => {
        await api.post("/admin/users", data);
    },

    deleteUser: async (id: string): Promise<void> => {
        await api.delete(`/admin/users/${id}`);
    },

    // Global Stats (Assuming it returns an object of counts)
    getStats: async (): Promise<any> => {
        const response = await api.get("/admin/stats");
        return response.data;
    },

    // Admin Internship Management
    getAllInternships: async (): Promise<Internship[]> => {
        const response = await api.get<Internship[]>("/admin/internships");
        return response.data;
    },

    deleteInternship: async (id: string): Promise<void> => {
        await api.delete(`/admin/internships/${id}`);
    },

    // Departments within Admin scope usually just list/delete, 
    // but there is a separate DepartmentService for general list/create.
    // However, Admin has /admin/departments and /admin/departments/{id}/analytics

    getDepartments: async (): Promise<Department[]> => {
        const response = await api.get("/admin/departments");
        return response.data;
    },

    getDepartmentAnalytics: async (departmentId: string): Promise<any> => {
        const response = await api.get(`/admin/departments/${departmentId}/analytics`);
        return response.data;
    }
};
