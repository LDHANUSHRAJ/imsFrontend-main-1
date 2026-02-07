import type { StudentApplication } from "../../types";

const APP_STORAGE_KEY = 'mock_applications';

export const ApplicationService = {
    getAll: async (): Promise<StudentApplication[]> => {
        await new Promise(resolve => setTimeout(resolve, 400));
        const stored = localStorage.getItem(APP_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    },
    getById: async (id: string): Promise<StudentApplication | null> => {
        await new Promise(resolve => setTimeout(resolve, 300));
        const stored = localStorage.getItem(APP_STORAGE_KEY);
        const apps: StudentApplication[] = stored ? JSON.parse(stored) : [];
        return apps.find(a => a.id === id) || null;
    },
    updateStatus: async (id: string, status: string) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const stored = localStorage.getItem(APP_STORAGE_KEY);
        let apps: StudentApplication[] = stored ? JSON.parse(stored) : [];
        apps = apps.map(a => a.id === id ? { ...a, status: status as any } : a);
        localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(apps));
        return { success: true };
    }
};
