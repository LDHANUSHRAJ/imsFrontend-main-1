
export interface ClosureRecord {
    id: string;
    studentName: string;
    studentRegNo: string;
    internshipTitle: string;
    companyName: string;
    status: 'PENDING_REVIEW' | 'CLOSED';
    documents: string[];
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
        status: 'PENDING_REVIEW',
        documents: ['Internship_Completion_Certificate.pdf', 'Final_Report.pdf', 'Attendance_Log.pdf']
    },
    {
        id: '2',
        studentName: 'Meera Reddy',
        studentRegNo: '21MCA004',
        internshipTitle: 'UI/UX Designer',
        companyName: 'Creative Minds',
        status: 'CLOSED',
        documents: ['Completion_Cert.pdf', 'Report.pdf'],
        evaluation: {
            rating: 5,
            remarks: 'Exceptional performance throughout the internship. Highly recommended.'
        }
    }
];

export const ClosureService = {
    getAll: async (): Promise<ClosureRecord[]> => {
        return new Promise((resolve) => setTimeout(() => resolve([...MOCK_CLOSURES]), 800));
    },

    submitEvaluation: async (id: string, rating: number, remarks: string) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const closure = MOCK_CLOSURES.find(c => c.id === id);
                if (closure) {
                    closure.status = 'CLOSED';
                    closure.evaluation = { rating, remarks };
                }
                resolve(true);
            }, 600);
        });
    }
};
