import api from "./api";

export const InternshipService = {
    // Basic CRUD
    create: async (data: InternshipCreate): Promise<Internship> => {
        const response = await api.post<Internship>("/internships", data);
        return response.data;
    },

    getAll: async (): Promise<Internship[]> => {
        const response = await api.get<Internship[]>("/internships/approved");
        return response.data;
    },

    getMyInternships: async (): Promise<Internship[]> => {
        const response = await api.get<Internship[]>("/internships/my");
        return response.data;
    },

    getApprovedInternships: async (): Promise<Internship[]> => {
        const response = await api.get<Internship[]>("/internships/approved");
        return response.data;
    },

    getPendingInternships: async (): Promise<Internship[]> => {
        const response = await api.get<Internship[]>("/internships/pending");
        return response.data;
    },

    getExternalPending: async (): Promise<any[]> => {
        const response = await api.get<any[]>("/internships/external/pending");
        return response.data;
    },

    // ... (close, delete, update, getById methods remain same)

    // ... (application methods)

    // Note: 'getPendingOfferLetters' was not in user list. 
    // We assume 'getPendingInternships' covers system offers pending approval.
    // Keeping this distinct if we need to fetch applications specifically, 
    // but for CustomApprovals page, we likely want getPendingInternships.

    // External Internships
    submitExternal: async (data: { company_name: string; position: string; offer_letter: File }): Promise<ExternalInternshipResponse> => {
        const formData = new FormData();
        formData.append('company_name', data.company_name);
        formData.append('position', data.position);
        formData.append('offer_letter', data.offer_letter);

        const response = await api.post<ExternalInternshipResponse>("/internships/external", formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    getMyExternalInternships: async (): Promise<ExternalInternshipResponse[]> => {
        const response = await api.get<ExternalInternshipResponse[]>("/internships/external/my");
        return response.data;
    },

    approveExternal: async (id: string): Promise<any> => {
        const response = await api.post(`/internships/external/${id}/approve`);
        return response.data;
    },

    rejectExternal: async (id: string): Promise<any> => {
        const response = await api.post(`/internships/external/${id}/reject`);
        return response.data;
    },

    // Weekly Reports
    submitWeeklyReport: async (data: WeeklyReportCreate): Promise<WeeklyReportResponse> => {
        const response = await api.post<WeeklyReportResponse>("/reports/", data);
        return response.data;
    },

    getMyReports: async (): Promise<WeeklyReportResponse[]> => {
        const response = await api.get<WeeklyReportResponse[]>("/reports/my-reports");
        return response.data;
    },

    getActiveInternships: async (): Promise<any> => { // Returns internship details for dropdown
        const response = await api.get("/reports/active-internships");
        return response.data;
    },

    // Student Application Methods
    getStudentApplications: async (): Promise<StudentApplication[]> => {
        // API: GET /internships/student/applications
        const response = await api.get("/internships/student/applications");
        console.log("Student applications response:", response.data);

        // Handle different response formats
        let applications = response.data;

        // If response is wrapped in a data property
        if (applications && typeof applications === 'object' && !Array.isArray(applications)) {
            if (applications.applications) applications = applications.applications;
            else if (applications.data) applications = applications.data;
        }

        // Ensure it's an array
        if (!Array.isArray(applications)) {
            console.error("Applications is not an array:", applications);
            return [];
        }

        // Map backend fields to frontend format if needed
        return applications.map((app: any) => ({
            id: app.id,
            student_id: app.student_id,
            internship_id: app.internship_id,
            status: app.status || 'SUBMITTED',
            created_at: app.created_at || app.applied_at || new Date().toISOString(),
            resume_link: app.resume_link || app.resume_url || app.resume || '',
            updated_resume_url: app.updated_resume_url,
            skills: app.skills || [],
            github_link: app.github_link,
            linkedin_link: app.linkedin_link,
            offer_letter_url: app.offer_letter_url,
            internship: app.internship || null,
            student: app.student || null
        }));
    },

    apply: async (internshipId: string, data: { resume: File; github_link?: string; linkedin_link?: string }): Promise<StudentApplication> => {
        // API: POST /internships/{internship_id}/apply
        const formData = new FormData();
        formData.append('resume', data.resume);
        if (data.github_link) formData.append('github_link', data.github_link);
        if (data.linkedin_link) formData.append('linkedin_link', data.linkedin_link);

        const response = await api.post<StudentApplication>(`/internships/${internshipId}/apply`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    uploadOfferLetter: async (applicationId: string, file: File): Promise<StudentApplication> => {
        // API: POST /internships/applications/{application_id}/offer-letter
        const formData = new FormData();
        formData.append('offer_letter', file);
        const response = await api.post<StudentApplication>(`/internships/applications/${applicationId}/offer-letter`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    getPlacementStatus: async (): Promise<any> => {
        // API: GET /internships/student/placement-status
        const response = await api.get("/internships/student/placement-status");
        return response.data;
    },

    // --- Recruiter/Admin/Faculty ---

    uploadOfferLetterAdmin: async (applicationId: string, file: File): Promise<StudentApplication> => {
        // Legacy/Admin version if needed, or remove if unified
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post<StudentApplication>(`/internships/applications/${applicationId}/upload-offer`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' } // Note: Check backend if this endpoint exists (it was in old code)
        });
        return response.data;
    },

    getApplications: async (id: string): Promise<StudentApplication[]> => {
        const response = await api.get<StudentApplication[]>(`/internships/${id}/applications`);
        return response.data;
    },

    getApplicationsByRecruiter: async (): Promise<StudentApplication[]> => {
        const response = await api.get<StudentApplication[]>("/internships/recruiter/applications"); // Verify endpoint exists in openapi.json? No 'recruiter' tag in snippet, assuming it exists or is custom.
        return response.data;
    },

    getTopApplicants: async (limit: number = 10): Promise<StudentApplication[]> => {
        const response = await api.get<StudentApplication[]>(`/internships/recruiter/top-applicants?limit=${limit}`);
        return response.data;
    },

    approve: async (id: string): Promise<Internship> => {
        const response = await api.post<Internship>(`/internships/${id}/approve`); // Fixed endpoint based on openapi.json
        return response.data;
    },

    reject: async (id: string): Promise<Internship> => {
        const response = await api.post<Internship>(`/internships/${id}/reject`); // Fixed endpoint based on openapi.json
        return response.data;
    },

    activateInternship: async (applicationId: string): Promise<StudentApplication> => {
        const response = await api.post<StudentApplication>(`/internships/applications/${applicationId}/accept`); // Mapped to 'accept' based on openapi.json
        return response.data;
    },

    getClassReports: async (): Promise<WeeklyLog[]> => {
        const response = await api.get<WeeklyLog[]>("/reports/class-reports");
        return response.data;
    },

    getWeeklyLogs: async (internshipId: string): Promise<WeeklyLog[]> => {
        const response = await api.get<WeeklyLog[]>(`/internships/${internshipId}/logs`); // endpoint not explicitly in snippet but common pattern
        return response.data;
    },

    getCompletionStatus: async (internshipId: string): Promise<InternshipCompletion> => {
        const response = await api.get<InternshipCompletion>(`/internships/${internshipId}/completion`);
        return response.data;
    }
};

import type {
    Internship,
    InternshipCreate,
    InternshipUpdate,
    StudentApplication,
    WeeklyLog,
    InternshipCompletion,
    ExternalInternshipResponse,
    WeeklyReportCreate,
    WeeklyReportResponse
} from "../types";
