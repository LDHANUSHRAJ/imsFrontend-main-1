
export interface ClosureRecord {
    id: string;
    studentName: string;
    studentRegNo: string;
    internshipTitle: string;
    companyName: string;
    duration: string; // Added for Credit Calculation
    status: 'PENDING_REVIEW' | 'CLOSED';
    displayId?: string; // e.g. "CMP-2024-001"
    documents: string[];
    credits?: number; // Added for Credits Approval
    evaluation?: {
        rating: number;
        remarks: string;
    };
}

const MOCK_CLOSURES: ClosureRecord[] = [
    {
        id: '1',
        studentName: 'Aarav Patel',
        studentRegNo: '21MCA001',
        internshipTitle: 'Frontend Developer',
        companyName: 'TechCorp Solutions',
        duration: '6 Months',
        status: 'PENDING_REVIEW',
        documents: ['Internship_Completion_Certificate.pdf', 'Final_Report.pdf', 'Attendance_Log.pdf']
    },
    {
        id: '2',
        studentName: 'Meera Reddy',
        studentRegNo: '21MCA004',
        internshipTitle: 'UI/UX Designer',
        companyName: 'Creative Minds',
        duration: '3 Months',
        status: 'CLOSED',
        documents: ['Completion_Cert.pdf', 'Report.pdf'],
        credits: 4, // Already awarded
        evaluation: {
            rating: 5,
            remarks: 'Exceptional performance throughout the internship. Highly recommended.'
        }
    },
    {
        id: '3',
        studentName: 'Ishaan Gupta',
        studentRegNo: '21MCA012',
        internshipTitle: 'Data Analyst',
        companyName: 'Insight Partners',
        duration: '4 Months',
        status: 'CLOSED',
        documents: ['Insight_Certificate.pdf', 'Data_Analysis_Project.pdf'],
        credits: 6,
        evaluation: {
            rating: 4,
            remarks: 'Strong analytical skills. Demonstrated proficiency in Python and SQL.'
        }
    },
    {
        id: '4',
        studentName: 'Sanya Malhotra',
        studentRegNo: '21MCA025',
        internshipTitle: 'Machine Learning Intern',
        companyName: 'AI Genix',
        duration: '6 Months',
        status: 'CLOSED',
        documents: ['ML_Completion.pdf', 'Sentiment_Analysis_Report.pdf'],
        credits: 8,
        evaluation: {
            rating: 5,
            remarks: 'Exceptional grasp of ML concepts. Successfully deployed a sentiment analysis model.'
        }
    }
];

export const ClosureService = {
    getAll: async (): Promise<ClosureRecord[]> => {
        return new Promise((resolve) => setTimeout(() => resolve([...MOCK_CLOSURES]), 800));
    },

    submitEvaluation: async (id: string, rating: number, remarks: string, credits: number) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const closure = MOCK_CLOSURES.find(c => c.id === id);
                if (closure) {
                    closure.status = 'CLOSED';
                    closure.evaluation = { rating, remarks };
                    closure.credits = credits;
                }
                resolve(true);
            }, 600);
        });
    }
};
