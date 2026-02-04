
import api from "./api";
import { Department } from "../types";

export const DepartmentService = {
    getAll: async (): Promise<Department[]> => {
        const response = await api.get<Department[]>("/departments");
        return response.data;
    },

    create: async (name: string): Promise<void> => {
        await api.post("/departments", { name });
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/departments/${id}`);
    }
};
