
import { PROGRAMS } from "../data/programs";
import type { Department } from "../types";
import api from "./api"; // Keep api for create/delete if needed, or comment out.

export const DepartmentService = {
    getAll: async (): Promise<Department[]> => {
        // Return local mock data matching the Department interface
        return new Promise((resolve) => {
            setTimeout(() => {
                const departments = PROGRAMS.map((p, index) => ({
                    id: (index + 1).toString(),
                    name: p.name
                }));
                resolve(departments);
            }, 500); // Simulate network delay
        });
    },

    create: async (name: string): Promise<void> => {
        // Mock create or keep API
        await api.post("/departments", { name });
    },

    delete: async (id: string): Promise<void> => {
        // Mock delete or keep API
        await api.delete(`/departments/${id}`);
    }
};
