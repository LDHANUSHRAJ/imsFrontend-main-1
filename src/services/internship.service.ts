import type {
    Internship,
    InternshipCreate,
    InternshipUpdate,
    StudentApplication
} from "../types";

const STORAGE_KEY = 'mock_internships';
const APP_STORAGE_KEY = 'mock_applications';

// Helper to get data
const getInternships = (): Internship[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
};

const getStoredApplications = (): StudentApplication[] => {
    const stored = localStorage.getItem(APP_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
};

const saveStoredApplications = (data: StudentApplication[]) => {
    localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(data));
};

// Helper to save data
const saveInternships = (data: Internship[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const InternshipService = {
    // Basic CRUD
    create: async (data: InternshipCreate): Promise<Internship> => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 600));

        const newInternship: Internship = {
            id: Math.random().toString(36).substr(2, 9),
            ...data,
            stipend: data.stipend || null, // Ensure stipend is handled
            status: 'PENDING', // Default to Pending for admin approval
            created_at: new Date().toISOString(),
            corporate_id: 'current-user-id', // In a real app, this comes from token
            department: { id: data.department_id, name: 'Target Dept' }, // Mock dept
            has_applied: false,
            duration: data.duration
        };

        const current = getInternships();
        saveInternships([newInternship, ...current]);

        return newInternship;
    },

    getAll: async (): Promise<Internship[]> => {
        await new Promise(resolve => setTimeout(resolve, 400));
        return getInternships();
    },

    getMyInternships: async (): Promise<Internship[]> => {
        await new Promise(resolve => setTimeout(resolve, 400));
        // In a real mock with auth, we'd filter by corporate_id. 
        // For now, assuming the user created them locally or just returning all for demo if corporate_id matches or just all.
        // Let's filter by nothing for now to ensure they see what they created.
        return getInternships();
    },

    getApprovedInternships: async (): Promise<Internship[]> => {
        await new Promise(resolve => setTimeout(resolve, 400));
        return getInternships().filter(i => i.status === 'APPROVED');
    },

    getPendingInternships: async (): Promise<Internship[]> => {
        await new Promise(resolve => setTimeout(resolve, 400));
        return getInternships().filter(i => i.status === 'PENDING');
    },

    close: async (id: string): Promise<string> => {
        const current = getInternships();
        const updated = current.map(i => i.id === id ? { ...i, status: 'CLOSED' as const } : i);
        saveInternships(updated);
        return 'Closed';
    },

    delete: async (id: string): Promise<void> => {
        const current = getInternships();
        const updated = current.filter(i => i.id !== id);
        saveInternships(updated);
    },

    update: async (id: string, data: InternshipUpdate): Promise<Internship> => {
        const current = getInternships();
        const index = current.findIndex(i => i.id === id);
        if (index === -1) throw new Error("Not found");

        const updatedInternship = { ...current[index], ...data } as Internship;
        // partial updates need careful merging, but for mock this is okay-ish if types match
        // @ts-ignore
        current[index] = updatedInternship;
        saveInternships(current);
        return updatedInternship;
    },

    getById: async (id: string): Promise<Internship> => {
        const current = getInternships();
        const found = current.find(i => i.id === id);
        if (!found) throw new Error("Not found");
        return found;
    },

    // Applications (Mock)
    apply: async (id: string, _formData: FormData): Promise<StudentApplication> => {
        await new Promise(resolve => setTimeout(resolve, 800));

        const newApp: StudentApplication = {
            id: Math.random().toString(36).substr(2, 9),
            status: 'APPLIED',
            created_at: new Date().toISOString(),
            internship_id: id,
            student_id: 'mock-student', // In real app, get from auth
            resume_link: '#',
            student: { name: 'Mock Student Check', email: 'mock@student.com' }
        };

        const apps = getStoredApplications();
        saveStoredApplications([...apps, newApp]);

        return newApp;
    },

    getApplications: async (id: string): Promise<StudentApplication[]> => {
        await new Promise(resolve => setTimeout(resolve, 400));
        const apps = getStoredApplications();
        return apps.filter(a => a.internship_id === id);
    },

    getAllApplications: async (): Promise<StudentApplication[]> => {
        await new Promise(resolve => setTimeout(resolve, 400));
        const apps = getStoredApplications();

        // If empty, seed some mock data for the chart to look good immediately?
        // The user wants "Real Data", so if it's empty, it should show empty.
        // But to demonstrate, I might want to ensure at least one exists if they apply.
        return apps;
    },

    // Placement/Admin approval
    approve: async (id: string): Promise<Internship> => {
        const current = getInternships();
        const index = current.findIndex(i => i.id === id);
        if (index !== -1) {
            current[index].status = 'APPROVED';
            saveInternships(current);
            return current[index];
        }
        throw new Error("Not Found");
    },

    reject: async (id: string): Promise<Internship> => {
        const current = getInternships();
        const index = current.findIndex(i => i.id === id);
        if (index !== -1) {
            current[index].status = 'REJECTED';
            saveInternships(current);
            return current[index];
        }
        throw new Error("Not Found");
    },
};
