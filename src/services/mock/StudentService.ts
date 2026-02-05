
const STORAGE_KEY = 'mock_students';

// Initial mock data
const initialStudents = [
    {
        id: '1',
        name: 'Rahul Kumar',
        email: 'rahul.k@mca.christuniversity.in',
        registerNumber: '21MCA001',
        course: 'MCA',
        batch: '2025',
        status: 'ACTIVE'
    },
    {
        id: '1',
        name: 'Priya Sharma',
        email: 'priya.s@msc.christuniversity.in',
        registerNumber: '21MSC012',
        course: 'MSc Data Science',
        batch: '2025',
        status: 'ACTIVE'
    }
];

// Helper to get data
const getStudents = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialStudents));
        return initialStudents;
    }
    return JSON.parse(stored);
};

export const StudentService = {
    getAll: async () => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 400));
        return getStudents();
    },

    register: async (data: any) => {
        const students = getStudents();
        const newStudent = {
            id: Math.random().toString(36).substr(2, 9),
            ...data,
            status: 'ACTIVE'
        };
        const updated = [...students, newStudent];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return newStudent;
    }
};
