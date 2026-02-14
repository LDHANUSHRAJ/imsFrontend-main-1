import api from './api';

export interface WeeklyReport {
    id: string;
    student_id: string;
    title: string;
    description: string;
    week_number: number;
    achievements?: string | null;
    challenges?: string | null;
    plans?: string | null;
    internship_id?: string | null;
    external_internship_id?: string | null;
    submitted_at: string;
    internship?: {
        id: string;
        title: string;
    } | null;
    external_internship?: {
        id: string;
        company_name: string;
        position: string;
    } | null;
}

export interface ActiveInternship {
    id: string;
    title: string;
    company_name: string;
    type: 'INTERNAL' | 'EXTERNAL';
    status?: string;
    credits?: number;
    credits_authorized?: boolean;
    is_completed?: boolean;
}

export interface WeeklyReportCreate {
    title: string;
    description: string;
    week_number: number;
    achievements?: string;
    challenges?: string;
    plans?: string;
    internship_id?: string;
    external_internship_id?: string;
}

export const ReportService = {
    // Get active internships for reporting
    getActiveInternships: async (): Promise<ActiveInternship[]> => {
        try {
            const response = await api.get<any[]>('/reports/active-internships');

            // Map backend response to ActiveInternship format
            return response.data.map((item: any) => ({
                id: item.id || item.internship_id,
                title: item.title || item.internship?.title || 'Internship',
                company_name: item.company_name || item.internship?.corporate?.company_name || item.corporate?.company_name || 'Company',
                type: item.type || (item.is_external ? 'EXTERNAL' : 'INTERNAL'),
                status: item.status,
                credits: item.credits || item.credit_points, // Map credits from backend
                credits_authorized: item.credits_authorized || (item.credits > 0) || (item.credit_points > 0),
                is_completed: item.is_completed || item.status === 'COMPLETED' || item.status === 'FINISHED'
            }));
        } catch (error) {
            console.error('Error fetching active internships:', error);
            return [];
        }
    },

    // Submit a new weekly report
    submitReport: async (data: WeeklyReportCreate): Promise<WeeklyReport> => {
        console.log('Submitting report with data:', data);
        const response = await api.post<WeeklyReport>('/reports/', data);
        return response.data;
    },

    // Get all reports submitted by current student
    getMyReports: async (): Promise<WeeklyReport[]> => {
        const response = await api.get<WeeklyReport[]>('/reports/my-reports');
        return response.data;
    },
};
