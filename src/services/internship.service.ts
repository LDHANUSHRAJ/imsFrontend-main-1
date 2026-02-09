import api from "./api";
import type {
    Internship,
    InternshipCreate,
    StudentApplication,
    WeeklyLog,
    InternshipCompletion,
    WeeklyReportCreate,
    WeeklyReportResponse,
    PlacementHeadStats
} from "../types";

export const InternshipService = {
    // Basic CRUD
    create: async (data: InternshipCreate): Promise<Internship> => {
        const response = await api.post<Internship>("/internships", data);
        return response.data;
    },

    update: async (id: string, data: Partial<InternshipCreate>): Promise<Internship> => {
        const response = await api.patch<Internship>(`/internships/${id}`, data);
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
        // For Placement Head: GET /admin/internships?status=APPROVED
        const response = await api.get<Internship[]>("/admin/internships", {
            params: { status: 'APPROVED' }
        });
        return response.data;
    },

    getPendingInternships: async (): Promise<Internship[]> => {
        // For Placement Head: GET /admin/internships?status=PENDING  
        const response = await api.get<Internship[]>("/admin/internships", {
            params: { status: 'PENDING' }
        });
        return response.data;
    },

    getCoordinatorPendingInternships: async (): Promise<Internship[]> => {
        // For Placement Coordinator: GET /internships/pending (Accessible to non-admin)
        const response = await api.get<any[]>("/internships/pending");
        // Handle wrapped response if necessary
        // Handle wrapped response if necessary
        const data = response.data;
        console.log("Coordinator Pending Internships Response:", data);
        if (Array.isArray(data)) return data;
        // @ts-ignore
        return data?.data || data?.internships || data?.pending_internships || [];
    },

    getById: async (id: string): Promise<Internship> => {
        const response = await api.get<Internship>(`/internships/${id}`);
        return response.data;
    },

    getPlacementHeadStats: async (): Promise<PlacementHeadStats> => {
        try {
            // 1. Try fetching ready-made stats from Admin endpoint
            console.log("Fetching stats from /admin/stats...");
            const response = await api.get<any>("/admin/stats");
            const data = response.data?.data || response.data?.stats || response.data;

            // Check if we got meaningful numbers (at least one non-zero or existing object)
            const hasData = data && (data.total_internships > 0 || data.totalInternships > 0 || Object.keys(data.internships_by_status || {}).length > 0);

            if (hasData) {
                console.log("Using server-side stats:", data);
                return {
                    total_users: data.total_users || data.totalUsers || 0,
                    total_internships: data.total_internships || data.totalInternships || 0,
                    corporate_count: data.corporate_count || data.corporateCount || 0,
                    total_placed: data.total_placed || data.totalPlaced || 0,
                    pending_reviews: data.pending_reviews || data.pendingReviews || 0,
                    internships_by_status: data.internships_by_status || data.internshipsByStatus || {},
                    internships_by_dept: data.internships_by_dept || data.internshipsByDept || {}
                };
            }
            throw new Error("Empty stats from server");
        } catch (error) {
            console.warn("Stats endpoint failed or empty, calculating manually...", error);

            // 2. Fallback: Calculate manually from lists
            try {
                const [approved, pending] = await Promise.all([
                    InternshipService.getPlacementHeadApprovedInternships(),
                    InternshipService.getPlacementHeadPendingInternships()
                ]);

                const all = [...approved, ...pending];

                // Calculate Stats
                const stats: PlacementHeadStats = {
                    total_users: 0, // Cannot calculate users from internships
                    total_internships: all.length,
                    corporate_count: new Set(all.map(i => i.corporate_id || i.company_name)).size,
                    total_placed: 0, // Needs student data, leave 0
                    pending_reviews: pending.length,
                    internships_by_status: {
                        'APPROVED': approved.length,
                        'PENDING': pending.length,
                        // Add others if we had them
                    },
                    internships_by_dept: {}
                };

                // Group by Department
                all.forEach(i => {
                    const dept = i.department?.name || 'Unknown';
                    stats.internships_by_dept[dept] = (stats.internships_by_dept[dept] || 0) + 1;
                });

                console.log("Calculated manual stats:", stats);
                return stats;

            } catch (calcError) {
                console.error("Manual stats calculation failed", calcError);
                return {
                    total_users: 0, total_internships: 0, corporate_count: 0,
                    total_placed: 0, pending_reviews: 0, internships_by_status: {}, internships_by_dept: {}
                };
            }
        }
    },

    getPlacementHeadPendingInternships: async (): Promise<Internship[]> => {
        try {
            // VERIFIED: /internships/pending
            const response = await api.get<any[]>("/internships/pending");
            const data = response.data;
            if (Array.isArray(data)) return data;
            // @ts-ignore
            return data?.data || data?.internships || [];
        } catch (error) {
            console.error("Failed to fetch pending internships", error);
            return [];
        }
    },

    getPlacementHeadApprovedInternships: async (): Promise<Internship[]> => {
        try {
            // VERIFIED: /internships/approved
            const response = await api.get<any[]>("/internships/approved");
            const data = response.data;
            if (Array.isArray(data)) return data;
            // @ts-ignore
            return data?.data || data?.internships || [];
        } catch (error) {
            console.error("Failed to fetch approved internships", error);
            return [];
        }
    },

    approveInternshipGlobal: async (id: string): Promise<any> => {
        // VERIFIED: /internships/{id}/approve
        const response = await api.post(`/internships/${id}/approve`);
        return response.data;
    },

    rejectInternshipGlobal: async (id: string, reason?: string): Promise<any> => {
        // VERIFIED: /internships/{id}/reject
        const response = await api.post(`/internships/${id}/reject`, null, {
            params: { reason }
        });
        return response.data;
    },

    // --- External / Self-Placed Internships ---

    getExternalPending: async (): Promise<any[]> => {
        const response = await api.get<any[]>("/internships/external/pending");
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

    // --- Student Application Methods ---

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
        const response = await api.post<Internship>(`/internships/${id}/approve`);
        return response.data;
    },

    close: async (id: string): Promise<Internship> => {
        const response = await api.patch<Internship>(`/internships/${id}`, { status: 'CLOSED' });
        return response.data;
    },

    reject: async (id: string): Promise<Internship> => {
        const response = await api.post<Internship>(`/internships/${id}/reject`);
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
    },

    completeInternship: async (applicationId: string, file: File): Promise<any> => {
        const formData = new FormData();
        formData.append('completion_letter', file);
        const response = await api.post(`/internships/applications/${applicationId}/complete`, formData);
        return response.data;
    },

    completeExternalInternship: async (externalId: string, file: File): Promise<any> => {
        const formData = new FormData();
        formData.append('file', file); // Changed from 'completion_letter' to 'file'
        const response = await api.post(`/internships/external/${externalId}/complete`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // Admin/Placement Coordinator Methods for Internal Internship Approval
    approveInternship: async (id: string): Promise<any> => {
        // For Placement Coordinator: POST /admin/internships/{id}/approve
        const response = await api.post(`/admin/internships/${id}/approve`);
        return response.data;
    },

    rejectInternship: async (id: string): Promise<any> => {
        // For Placement Coordinator: POST /admin/internships/{id}/reject
        const response = await api.post(`/admin/internships/${id}/reject`);
        return response.data;
    }
};

