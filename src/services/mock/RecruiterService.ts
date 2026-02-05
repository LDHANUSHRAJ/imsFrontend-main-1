// Temporary stub for RecruiterService until proper API integration

const STORAGE_KEY = 'mock_recruiters';

// Initial mock data
const initialRecruiters = [
    {
        id: '1',
        companyName: 'Google India',
        name: 'Anjali Pichai',
        email: 'recruitment@google.com',
        createdAt: '2024-01-15',
        isActive: true,
        industry: 'Technology',
        address: 'No. 3, RMZ Infinity - Tower E, Old Madras Road, Bangalore',
        activePostings: 12,
        hiredCount: 45
    },
    {
        id: '2',
        companyName: 'Microsoft',
        name: 'Satya N',
        email: 'careers@microsoft.com',
        createdAt: '2024-02-10',
        isActive: true,
        industry: 'Software',
        address: 'Prestige Ferns Galaxy, Outer Ring Road, Bangalore',
        activePostings: 8,
        hiredCount: 32
    },
    {
        id: '3',
        companyName: 'Infosys',
        name: 'Nandan Nilekani',
        email: 'campus@infosys.com',
        createdAt: '2023-11-05',
        isActive: false, // Banned/Inactive
        industry: 'IT Services',
        address: 'Electronics City, Hosur Road, Bangalore',
        activePostings: 0,
        hiredCount: 120
    },
    {
        id: '4',
        companyName: 'Goldman Sachs',
        name: 'David Solomon',
        email: 'graduates@gs.com',
        createdAt: '2024-03-20',
        isActive: true,
        industry: 'Finance',
        address: '150 Outer Ring Road, Bangalore',
        activePostings: 5,
        hiredCount: 15
    }
];

// Helper to get data
const getRecruiters = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialRecruiters));
        return initialRecruiters;
    }
    return JSON.parse(stored);
};

// Helper to save data
const saveRecruiters = (data: any[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const RecruiterService = {
    getAll: async () => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 600));
        return getRecruiters();
    },
    create: async (data: any) => {
        console.log('RecruiterService.create called with:', data);
        const newRecruiter = {
            id: Math.random().toString(36).substr(2, 9),
            ...data,
            isActive: true, // Default to active
            createdAt: new Date().toISOString().split('T')[0],
            activePostings: 0,
            hiredCount: 0
        };

        const currentList = getRecruiters();
        const updatedList = [newRecruiter, ...currentList];
        saveRecruiters(updatedList);

        return newRecruiter;
    },
    toggleStatus: async (id: string) => {
        console.log('RecruiterService.toggleStatus called for:', id);
        const currentList = getRecruiters();
        const updatedList = currentList.map((r: any) =>
            r.id === id ? { ...r, isActive: !r.isActive } : r
        );
        saveRecruiters(updatedList);
        return { success: true };
    }
};
