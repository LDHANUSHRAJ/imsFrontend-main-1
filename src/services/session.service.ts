import api from "./api";
import type { InternshipSession } from '../types';

export const SessionService = {
    getAll: async (): Promise<InternshipSession[]> => {
        const response = await api.get<InternshipSession[]>("/sessions");
        return response.data;
    },

    create: async (data: Partial<InternshipSession>): Promise<InternshipSession> => {
        const response = await api.post<InternshipSession>("/sessions", data);
        return response.data;
    },

    update: async (id: string, data: Partial<InternshipSession>): Promise<InternshipSession> => {
        const response = await api.put<InternshipSession>(`/sessions/${id}`, data);
        return response.data;
    },

    toggleStatus: async (id: string): Promise<InternshipSession> => {
        const response = await api.post<InternshipSession>(`/sessions/${id}/toggle`);
        return response.data;
    }
};

export const fetchSessions = SessionService.getAll;
export const createSession = SessionService.create;
export const updateSession = SessionService.update;
export const toggleStatus = SessionService.toggleStatus;
