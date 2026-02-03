
import { JobPosting } from "../../types";

export interface StudentApplication {
    id: string;
    jobId: string;
    studentName: string;
    studentRegNo: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    appliedAt: string;
}

const MOCK_APPLICATIONS: StudentApplication[] = [
    {
        id: '101',
        jobId: '1', // Matches a job ID
        studentName: 'Rahul Drake',
        studentRegNo: '2347116',
        status: 'PENDING',
        appliedAt: '2023-10-15'
    },
    {
        id: '102',
        jobId: '2',
        studentName: 'Sarah Connor',
        studentRegNo: '2347118',
        status: 'APPROVED',
        appliedAt: '2023-10-14'
    }
];

export const ApplicationService = {
    getAll: async (): Promise<StudentApplication[]> => {
        return new Promise((resolve) => setTimeout(() => resolve([...MOCK_APPLICATIONS]), 600));
    },

    getById: async (id: string): Promise<StudentApplication | undefined> => {
        return new Promise((resolve) => setTimeout(() => resolve(MOCK_APPLICATIONS.find(a => a.id === id)), 400));
    },

    updateStatus: async (id: string, status: 'APPROVED' | 'REJECTED') => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const app = MOCK_APPLICATIONS.find(a => a.id === id);
                if (app) app.status = status;
                resolve(true);
            }, 500);
        });
    }
};
