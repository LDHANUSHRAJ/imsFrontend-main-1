import type { InternshipSession } from '../../types';

const STORAGE_KEY = 'ims_sessions';

const DEFAULT_SESSIONS: InternshipSession[] = [
    {
        id: '1',
        academicYear: '2023-2024',
        program: 'MCA',
        batch: '2022-2024',
        startDate: '2023-11-01',
        endDate: '2024-04-30',
        isActive: true
    },
    {
        id: '2',
        academicYear: '2023-2024',
        program: 'MSc CS',
        batch: '2022-2024',
        startDate: '2024-01-15',
        endDate: '2024-06-15',
        isActive: false
    }
];

const getSessions = (): InternshipSession[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_SESSIONS;
};

const saveSessions = (sessions: InternshipSession[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
};

export const SessionService = {
    getAll: async (): Promise<InternshipSession[]> => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(getSessions()), 500);
        });
    },

    create: async (data: Partial<InternshipSession>) => {
        const sessions = getSessions();
        const newSession = { ...data, id: Date.now().toString(), isActive: true } as InternshipSession;
        sessions.push(newSession);
        saveSessions(sessions);
        return new Promise((resolve) => setTimeout(resolve, 800));
    },

    update: async (id: string, data: Partial<InternshipSession>) => {
        const sessions = getSessions();
        const index = sessions.findIndex(s => s.id === id);
        if (index !== -1) {
            sessions[index] = { ...sessions[index], ...data };
            saveSessions(sessions);
        }
        return new Promise((resolve) => setTimeout(resolve, 600));
    },

    toggleStatus: async (id: string) => {
        const sessions = getSessions();
        const index = sessions.findIndex(s => s.id === id);
        if (index !== -1) {
            sessions[index].isActive = !sessions[index].isActive;
            saveSessions(sessions);
        }
        return new Promise((resolve) => setTimeout(resolve, 400));
    }
};
