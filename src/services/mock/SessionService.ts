import type { InternshipSession } from '../../types';

let mockSessions: InternshipSession[] = [
    {
        id: '1',
        academicYear: '2024-2025',
        program: 'Bachelor of Computer Applications (BCA)',
        subProgram: 'BCA (Honours)',
        batch: '2022-2025',
        startDate: '2024-06-01',
        endDate: '2024-08-31',
        isActive: true,
        mode: 'HYBRID',
        duration: '3 Months',
        stipend: '15000'
    },
    {
        id: '2',
        academicYear: '2023-2024',
        program: 'Master of Computer Applications (MCA)',
        subProgram: 'MCA (Data Science)',
        batch: '2022-2024',
        startDate: '2023-05-15',
        endDate: '2023-07-31',
        isActive: false,
        mode: 'ONSITE',
        duration: '6 Months',
        stipend: '20000'
    }
];

// Temporary stub for SessionService until proper API integration
export const SessionService = {
    getAll: async (): Promise<InternshipSession[]> => {
        return new Promise(resolve => setTimeout(() => resolve([...mockSessions]), 500));
    },
    toggleStatus: async (id: string) => {
        const session = mockSessions.find(s => s.id === id);
        if (session) {
            session.isActive = !session.isActive;
        }
        return { success: true };
    },
    create: async (data: any) => {
        const newSession = { id: Math.random().toString(36).substr(2, 9), isActive: true, ...data };
        mockSessions.push(newSession);
        return newSession;
    },
    update: async (id: string, data: any) => {
        mockSessions = mockSessions.map(s => s.id === id ? { ...s, ...data } : s);
        return { id, ...data };
    },
    delete: async (id: string) => {
        mockSessions = mockSessions.filter(s => s.id !== id);
        return { success: true };
    }
};
