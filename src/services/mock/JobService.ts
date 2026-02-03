
import { JobPosting } from "../../types";

const MOCK_JOBS: any[] = [
    {
        id: '1',
        title: 'Software Engineer Intern',
        companyName: 'Google',
        location: 'Bangalore',
        stipend: '50000',
        status: 'APPROVED',
        description: 'Great opportunity.'
    },
    {
        id: '2',
        title: 'Data Science Intern',
        companyName: 'Microsoft',
        location: 'Hyderabad',
        stipend: '45000',
        status: 'PENDING',
        description: 'Work with big data.'
    }
];

export const JobService = {
    getAll: async (): Promise<any[]> => {
        return new Promise((resolve) => setTimeout(() => resolve([...MOCK_JOBS]), 500));
    },
    create: async (data: any) => {
        console.log("Mock create job:", data);
        MOCK_JOBS.push({ ...data, id: Date.now().toString(), status: 'PENDING' });
        return new Promise((resolve) => setTimeout(resolve, 1000));
    },
    updateStatus: async (id: string, status: 'APPROVED' | 'REJECTED') => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const job = MOCK_JOBS.find(j => j.id === id);
                if (job) job.status = status;
                resolve(true);
            }, 600);
        });
    }
};
