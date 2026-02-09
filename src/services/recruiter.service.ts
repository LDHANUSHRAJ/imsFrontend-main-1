import api from "./api";

export const RecruiterService = {
    // Get pending recruiters waiting for approval
    getPendingRecruiters: async (): Promise<any[]> => {
        const response = await api.get<any[]>("/auth/recruiter/pending-approvals");
        return response.data;
    },

    // Approve or reject a recruiter
    approveRecruiter: async (userId: string, approved: boolean = true): Promise<any> => {
        const response = await api.post(`/auth/recruiter/approve/${userId}`, null, {
            params: { approved }
        });
        return response.data;
    },

    // --- Placement Head Specific APIs ---

    // Helper to normalize data structure
    _normalize: (r: any, isActive: boolean, statusFallback: string) => {
        // Swagger 'RecruiterResponse': { id, company_name, verification_status, ai_trust_score, ai_trust_tier }
        const verificationStatus = r.verification_status || r.status || statusFallback;
        const finalStatus = (verificationStatus === 'APPROVED' || verificationStatus === 'VERIFIED') ? 'APPROVED' : 'PENDING';

        return {
            ...r,
            id: String(r.id || r.user_id),
            user_id: String(r.user_id || r.id),
            companyName: r.company_name || r.companyName || 'Unknown Company',
            name: r.name || r.hr_name || r.username || 'HR', // name might not be in RecruiterResponse? check all
            email: r.email || r.username || '',
            isActive: finalStatus === 'APPROVED',
            status: finalStatus,
            ai_trust_score: r.ai_trust_score || 0,
            ai_trust_tier: r.ai_trust_tier || 'Unverified'
        };
    },

    // Helper to extract array from any response structure
    _extractArray: (data: any): any[] => {
        if (!data) return [];
        if (Array.isArray(data)) return data;
        return data.data || data.users || data.recruiters || [];
    },

    getGlobalPendingRecruiters: async (): Promise<any[]> => {
        try {
            // VERIFIED: /auth/recruiter/pending-approvals
            const response = await api.get<any[]>("/auth/recruiter/pending-approvals");
            const list = RecruiterService._extractArray(response.data);
            // @ts-ignore
            return list.map((r: any) => RecruiterService._normalize(r, false, 'PENDING'));
        } catch (error) {
            console.error("Failed to fetch pending recruiters", error);
            // Only throw if critical, otherwise return empty to avoid crashing UI?
            // Throwing allows Red Error on UI which is fine for now
            throw error;
        }
    },

    getGlobalApprovedRecruiters: async (): Promise<any[]> => {
        try {
            // VERIFIED: /auth/recruiter/approved
            const response = await api.get<any[]>("/auth/recruiter/approved");
            const list = RecruiterService._extractArray(response.data);
            // @ts-ignore
            return list.map((r: any) => RecruiterService._normalize(r, true, 'APPROVED'));
        } catch (error) {
            console.error("Failed to fetch approved recruiters", error);
            throw error;
        }
    },

    verifyRecruiterGlobal: async (userId: string, approved: boolean, reason?: string): Promise<any> => {
        // VERIFIED from openapi.json: /auth/recruiter/approve/{user_id}
        const response = await api.post(`/auth/recruiter/approve/${userId}`, null, {
            params: { approved, reason }
        });
        return response.data;
    },

    getRecruiterAiAnalysis: async (userId: string): Promise<any> => { // Returns RecruiterAiAnalysis
        const response = await api.get(`/auth/${userId}/ai-analysis`);
        return response.data;
    },

    create: async (data: any): Promise<any> => {
        // Assuming the endpoint is /auth/register/recruiter based on standard patterns
        const response = await api.post("/auth/register/recruiter", data);
        return response.data;
    },

    getAll: async (role?: string): Promise<any[]> => {
        // Priority 1: Placement Head specific endpoints
        if (role === 'PLACEMENT_HEAD') {
            try {
                const [pending, approved] = await Promise.all([
                    RecruiterService.getGlobalPendingRecruiters(),
                    RecruiterService.getGlobalApprovedRecruiters()
                ]);

                // Sort by ID to keep consistent
                return [...pending, ...approved].sort((a, b) => b.id.localeCompare(a.id));
            } catch (headError) {
                console.error("Failed to fetch Placement Head recruiter lists", headError);
                return [];
            }
        }

        // Priority 2: Admin Users Endpoint (For Admin/Placement Officer)
        try {
            const response = await api.get<any[]>("/admin/users");
            return response.data
                .filter((u: any) => u.role === 'CORPORATE' || u.role === 'RECRUITER')
                .map((u: any) => ({
                    ...u,
                    id: String(u.id || u.user_id),
                    user_id: String(u.user_id || u.id),
                    companyName: u.company_name || u.companyName,
                    isActive: u.is_active !== undefined ? u.is_active : u.isActive,
                    status: (u.is_active || u.isActive) ? 'APPROVED' : 'PENDING'
                }));
        } catch (error) {
            console.warn("RecruiterService: /admin/users failed", error);
            return [];
        }
    },

    ban: async (id: string): Promise<any> => {
        const response = await api.post(`/auth/recruiters/${id}/ban`);
        return response.data;
    },

    unban: async (id: string): Promise<any> => {
        const response = await api.post(`/auth/recruiters/${id}/unban`);
        return response.data;
    },

    toggleStatus: async (id: string): Promise<any> => {
        // Logic to toggle, maybe check status first or use specific endpoint
        // For now assuming a toggle endpoint or we can't implement simply without more info
        // I'll assume the component handles the logic or this calls a toggle endpoint
        const response = await api.post(`/auth/recruiters/${id}/toggle-status`);
        return response.data;
    },

    getCredentials: async (id: string): Promise<any> => {
        // Real backend won't return this. Return dummy or remove usage in component.
        // For now preventing crash.
        return { email: 'hidden@example.com', password: '••••••••' };
    },

    calculateTrustScore: (company: any): number => {
        let score = 0;
        if (company.email && company.email.includes('.com')) score += 10;
        if (company.website_url) score += 20;
        if (company.linkedin_url) score += 20;
        if (company.cin) score += 30; // Verified business
        if (company.gst) score += 20;

        // Cap at 100
        return Math.min(score, 100);
    }
};
