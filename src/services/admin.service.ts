import api from "./api";
import type { User, AdminUserCreate, Internship, Department, Program, Campus } from "../types";

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

    // Global Stats
    getStats: async (): Promise<any> => {
        const response = await api.get("/admin/stats");
        return response.data;
    },

    // Dashboard Charts Analytics
    getDashboardAnalytics: async () => {
        const response = await api.get("/admin/analytics");
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

    // Departments
    getDepartments: async (): Promise<Department[]> => {
        const response = await api.get<Department[]>("/departments");
        return response.data;
    },

    createDepartment: async (name: string): Promise<Department> => {
        const response = await api.post<Department>("/departments", { name });
        return response.data;
    },

    // Programs
    getPrograms: async (): Promise<Program[]> => {
        const response = await api.get<Program[]>("/programs");
        return response.data;
    },

    createProgram: async (data: { name: string; department_id: string }): Promise<Program> => {
        const response = await api.post<Program>("/programs", data);
        return response.data;
    },

    // Campuses
    getCampuses: async (): Promise<Campus[]> => {
        const response = await api.get<Campus[]>("/campuses");
        return response.data;
    },

    createCampus: async (name: string): Promise<Campus> => {
        const response = await api.post<Campus>("/campuses", { name });
        return response.data;
    },

    getDepartmentAnalytics: async (departmentId: string): Promise<any> => {
        const response = await api.get(`/admin/departments/${departmentId}/analytics`);
        return response.data;
    }
};
