import api from "./api";
import type { Faculty } from "../types";

export const FacultyService = {
    getAll: async (): Promise<Faculty[]> => {
        const response = await api.get<Faculty[]>("/faculty");
        return response.data;
    },

    getById: async (id: string): Promise<Faculty | null> => {
        const response = await api.get<Faculty>(`/faculty/${id}`);
        return response.data;
    },

    getByDepartment: async (departmentId: string): Promise<Faculty[]> => {
        const response = await api.get<Faculty[]>(`/faculty/department/${departmentId}`);
        return response.data;
    },

    getFacultyDashboard: async (): Promise<any> => {
        const response = await api.get("/faculty/dashboard");
        return response.data;
    },

    updateLoad: async (facultyId: string, loadChange: number): Promise<void> => {
        await api.post(`/faculty/${facultyId}/update-load`, { load_change: loadChange });
    },

    create: async (data: Omit<Faculty, 'id' | 'currentLoad'>): Promise<Faculty> => {
        const response = await api.post<Faculty>("/faculty", data);
        return response.data;
    },

    update: async (id: string, updates: Partial<Faculty>): Promise<Faculty | null> => {
        const response = await api.put<Faculty>(`/faculty/${id}`, updates);
        return response.data;
    },

    delete: async (id: string): Promise<boolean> => {
        await api.delete(`/faculty/${id}`);
        return true;
    }
};
