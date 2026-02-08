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
    company_name?: string;
    type: 'INTERNAL' | 'EXTERNAL';
    status: string;
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
        const response = await api.get<ActiveInternship[]>('/reports/active-internships');
        return response.data;
    },

    // Submit a new weekly report
    submitReport: async (data: WeeklyReportCreate): Promise<WeeklyReport> => {
        const response = await api.post<WeeklyReport>('/reports/', data);
        return response.data;
    },

    // Get all reports submitted by current student
    getMyReports: async (): Promise<WeeklyReport[]> => {
        const response = await api.get<WeeklyReport[]>('/reports/my-reports');
        return response.data;
    },
};
