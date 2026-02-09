import api from "./api";

export interface ClosureRecord {
    id: string;
    studentName: string;
    studentRegNo: string;
    internshipTitle: string;
    companyName: string;
    duration: string;
    status: 'PENDING_REVIEW' | 'CLOSED';
    displayId?: string;
    documents: string[];
    credits?: number;
    evaluation?: {
        rating: number;
        remarks: string;
    };
}

export const ClosureService = {
    // Get all completed internships awaiting credit authorization
    getAll: async (): Promise<ClosureRecord[]> => {
        try {
            // Try the completed internships endpoint
            const response = await api.get<any[]>("/internships/completed");

            // Map the backend response to ClosureRecord format
            return response.data.map((item: any) => ({
                id: item.id || item.application_id,
                studentName: item.student?.name || item.student_name || 'Unknown Student',
                studentRegNo: item.student?.registration_number || item.student_reg_no || 'N/A',
                internshipTitle: item.internship?.title || item.title || 'Internship',
                companyName: item.internship?.corporate?.company_name || item.company_name || 'Company',
                duration: item.duration || item.internship?.duration || 'N/A',
                status: item.credits ? 'CLOSED' : 'PENDING_REVIEW',
                displayId: item.id,
                documents: item.completion_letter ? [item.completion_letter] : [],
                credits: item.credits || undefined,
                evaluation: item.evaluation || undefined
            }));
        } catch (error) {
            console.error('Error fetching completed internships:', error);
            return [];
        }
    },

    submitEvaluation: async (id: string, rating: number, remarks: string, credits: number) => {
        // Use the faculty evaluation endpoint as per API docs
        // The 'id' here should be the student_id or application_id
        const response = await api.post(`/faculty/evaluate-completion/${id}`, {
            rating,
            feedback: remarks, // Backend expects 'feedback' not 'remarks'
            credit_points: credits // Backend expects 'credit_points'
        });
        return response.data;
    }
};
