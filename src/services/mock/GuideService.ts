
export interface GuideAssignment {
    id: string;
    studentName: string;
    studentRegNo: string;
    internshipTitle: string;
    companyName: string;
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
    guide?: string;
    feedback: string[];
}

const MOCK_ASSIGNMENTS: GuideAssignment[] = [
    {
        id: '1',
        studentName: 'Aarav Patel',
        studentRegNo: '21MCA001',
        internshipTitle: 'Frontend Developer',
        companyName: 'TechCorp Solutions',
        status: 'IN_PROGRESS',
        guide: 'Dr. Rajesh Kumar',
        feedback: ['Initial report submitted.']
    },
    {
        id: '2',
        studentName: 'Priya Sharma',
        studentRegNo: '21MCA002',
        internshipTitle: 'Data Analyst Intern',
        companyName: 'Analytics Co',
        status: 'NOT_STARTED',
        feedback: []
    },
    {
        id: '3',
        studentName: 'Rohan Gupta',
        studentRegNo: '21MCA003',
        internshipTitle: 'Full Stack Engineer',
        companyName: 'Innovate Hub',
        status: 'IN_PROGRESS',
        guide: 'Prof. Anita Desai',
        feedback: []
    },
    {
        id: '4',
        studentName: 'Meera Reddy',
        studentRegNo: '21MCA004',
        internshipTitle: 'UI/UX Designer',
        companyName: 'Creative Minds',
        status: 'COMPLETED',
        guide: 'Dr. Rajesh Kumar',
        feedback: ['Excellent final presentation.']
    },
    {
        id: '5',
        studentName: 'Karan Singh',
        studentRegNo: '21MCA005',
        internshipTitle: 'Backend Developer',
        companyName: 'ServerSafe',
        status: 'NOT_STARTED',
        feedback: []
    }
];

export const GuideService = {
    getAll: async (): Promise<GuideAssignment[]> => {
        // Simulate API delay
        return new Promise((resolve) => {
            setTimeout(() => resolve([...MOCK_ASSIGNMENTS]), 800);
        });
    },

    assignGuide: async (assignmentId: string, guideName: string) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const assignment = MOCK_ASSIGNMENTS.find(a => a.id === assignmentId);
                if (assignment) {
                    assignment.guide = guideName;
                    assignment.status = 'IN_PROGRESS';
                }
                resolve(true);
            }, 500);
        });
    },

    addFeedback: async (assignmentId: string, feedback: string) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const assignment = MOCK_ASSIGNMENTS.find(a => a.id === assignmentId);
                if (assignment) {
                    assignment.feedback.push(feedback);
                }
                resolve(true);
            }, 500);
        });
    }
};
