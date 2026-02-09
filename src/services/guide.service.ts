import api from "./api";
import type {
    GuideAssignment,
    StudentProfileExtended,
    GuideFeedback,
    AssignmentRecommendation,
    AssignmentStats,
    WeeklyLog
} from "../types";

export const GuideService = {
    // Get faculty dashboard with assigned mentees' internships
    getDashboard: async (): Promise<any> => {
        const response = await api.get("/faculty/dashboard");
        return response.data;
    },

    getAllAssignments: async (): Promise<GuideAssignment[]> => {
        const response = await api.get<GuideAssignment[]>("/faculty/assignments");
        return response.data;
    },

    getAssignmentById: async (id: string): Promise<GuideAssignment | null> => {
        const response = await api.get<GuideAssignment>(`/faculty/assignments/${id}`);
        return response.data;
    },

    getStudentProfile: async (id: string): Promise<StudentProfileExtended | null> => {
        try {
            console.log("=== FACULTY: Fetching student profile for ID:", id);
            const response = await api.get(`/faculty/student-details/${id}`);
            const data = response.data;
            console.log("Student details API response:", data);

            // Map backend response to frontend StudentProfileExtended format
            const profile = {
                id: data.student?.id || data.id || id,
                studentName: data.student?.name || data.student_name || data.name || 'Unknown',
                studentRegNo: data.student?.registration_number || data.student?.reg_no || data.student?.email || data.email || '',
                email: data.student?.email || data.email || '',
                department: data.student?.department || data.department || data.class_name || 'N/A',
                companyName: data.internship?.corporate?.company_name ||
                    data.external_internship?.company_name ||
                    data.company_name ||
                    data.company ||
                    'N/A',
                internshipTitle: data.internship?.position ||
                    data.position ||
                    data.external_internship?.position ||
                    data.internship_title ||
                    'N/A',
                startDate: data.internship?.start_date ||
                    data.start_date ||
                    data.external_internship?.start_date ||
                    'N/A',
                endDate: data.internship?.end_date ||
                    data.end_date ||
                    data.external_internship?.end_date ||
                    'N/A',
                duration: data.internship?.duration ||
                    data.external_internship?.duration ||
                    data.duration ||
                    null,
                status: data.status || data.internship_status || 'ACTIVE',
                logs: [] // Logs are fetched separately via getStudentLogs
            };

            console.log("Mapped student profile:", profile);
            return profile;
        } catch (error) {
            console.error("=== FACULTY: Failed to fetch student profile ===", error);
            return null;
        }
    },

    // Get comprehensive student details for evaluation modal
    getStudentDetailsForEvaluation: async (studentId: string, internshipId?: string, internshipType?: string): Promise<any> => {
        const params: any = {};
        if (internshipId) params.internship_id = internshipId;
        if (internshipType) params.internship_type = internshipType;

        const response = await api.get(`/faculty/student-details/${studentId}`, { params });
        return response.data;
    },

    // Evaluate and mark internship completion
    evaluateCompletion: async (
        studentId: string,
        rating: number,
        feedback: string,
        creditPoints: number = 0,
        internshipId?: string,
        internshipType?: string
    ): Promise<any> => {
        const params: any = { rating, feedback, credit_points: creditPoints };
        if (internshipId) params.internship_id = internshipId;
        if (internshipType) params.internship_type = internshipType;

        const response = await api.post(`/faculty/evaluate-completion/${studentId}`, null, { params });
        return response.data;
    },

    assignGuide: async (studentId: string, facultyId: string): Promise<void> => {
        await api.post("/faculty/assign-guide", { student_id: studentId, faculty_id: facultyId });
    },

    reassignGuide: async (studentId: string, facultyId: string, _facultyName?: string, _reason?: string): Promise<void> => {
        await api.post("/faculty/assign", { student_id: studentId, faculty_id: facultyId });
    },

    submitFeedback: async (studentId: string, feedback: GuideFeedback): Promise<void> => {
        await api.post(`/faculty/students/${studentId}/feedback`, feedback);
    },

    updateFeedback: async (studentId: string, feedback: GuideFeedback): Promise<void> => {
        await api.put(`/faculty/students/${studentId}/feedback`, feedback);
    },

    deleteFeedback: async (studentId: string): Promise<void> => {
        await api.delete(`/faculty/students/${studentId}/feedback`);
    },

    getAssignmentStats: async (): Promise<AssignmentStats> => {
        const response = await api.get<AssignmentStats>("/faculty/stats/assignments");
        return response.data;
    },

    autoAssignGuides: async (): Promise<AssignmentRecommendation[]> => {
        const response = await api.post<AssignmentRecommendation[]>("/faculty/auto-assign/recommendations");
        return response.data;
    },

    applyRecommendations: async (recommendations: AssignmentRecommendation[]): Promise<void> => {
        await api.post("/faculty/auto-assign/confirm", { recommendations });
    },

    confirmAutoAssignments: async (recommendations: AssignmentRecommendation[]): Promise<void> => {
        await api.post("/faculty/auto-assign/confirm", { recommendations });
    },

    // Get weekly logs for a specific student (from Swagger: GET /reports/student/{student_id})
    getStudentLogs: async (studentId: string): Promise<WeeklyLog[]> => {
        console.log("=== FACULTY: Fetching weekly logs for student:", studentId);
        const response = await api.get(`/reports/student/${studentId}`);
        const data = response.data;
        console.log("Weekly logs API response:", data);

        // Map backend response to frontend WeeklyLog format
        if (!Array.isArray(data)) {
            console.error("Weekly logs response is not an array:", data);
            return [];
        }

        const logs = data.map((item: any) => {
            const log = {
                id: item.id || '',
                weekNumber: item.week_number || item.weekNumber || 0,
                startDate: item.start_date || item.startDate || 'N/A',
                endDate: item.end_date || item.endDate || 'N/A',
                workSummary: item.work_summary || item.workSummary || item.description || '',
                skillsLearned: item.skills_learned || item.skillsLearned || item.learnings || item.skills || '',
                achievements: item.achievements || item.achievement || item.skills_learned || item.learnings || '',
                challengesFaced: item.challenges || item.challenges_faced || item.challengesFaced || '',
                nextWeekPlan: item.next_week_plan || item.nextWeekPlan || item.next_week || item.plans || '',
                hoursWorked: item.hours_worked || item.hoursWorked || 0,
                status: item.status || 'SUBMITTED',
                submissionDate: item.submitted_at || item.submissionDate || item.created_at || 'N/A',
                guideComments: item.faculty_comments || item.guide_comments || item.guideComments || '',
                attachments: item.attachments || []
            };
            console.log(`Week ${log.weekNumber} mapped:`, log);
            return log;
        });

        console.log("=== FACULTY: Weekly logs mapped successfully ===");
        return logs;
    },

    updateLogStatus: async (studentId: string, logId: string, status: 'APPROVED' | 'REJECTED', comment: string): Promise<void> => {
        await api.put(`/faculty/students/${studentId}/logs/${logId}/status`, { status, comment });
    },

    updateLog: async (studentId: string, logId: string, data: Partial<WeeklyLog>): Promise<void> => {
        await api.put(`/faculty/students/${studentId}/logs/${logId}`, data);
    },

    deleteLog: async (studentId: string, logId: string): Promise<void> => {
        await api.delete(`/faculty/students/${studentId}/logs/${logId}`);
    },

    updateInternshipStatus: async (studentId: string, status: string, reason?: string): Promise<void> => {
        await api.put(`/faculty/students/${studentId}/status`, { status, reason });
    },

    // Guide Allocation Methods for Coordinator
    getAllStudentsForAllocation: async (departmentId?: string): Promise<any[]> => {
        // API: GET /admin/users?role=STUDENT&department_id={coordinator_department_id}
        const params: any = { role: 'STUDENT' };
        if (departmentId) {
            params.department_id = departmentId;
        }

        const response = await api.get<any[]>("/admin/users", { params });

        let students = [];
        if (Array.isArray(response.data)) {
            students = response.data;
        } else if (response.data && (response.data as any).users && Array.isArray((response.data as any).users)) {
            students = (response.data as any).users;
        } else if (response.data && (response.data as any).data && Array.isArray((response.data as any).data)) {
            students = (response.data as any).data;
        }

        return students;
    },

    getAllFacultyForAllocation: async (departmentId?: string): Promise<any[]> => {
        // API: GET /faculty/all?department_id={coordinator_department_id}
        const params: any = {};
        if (departmentId) {
            params.department_id = departmentId;
        }
        const response = await api.get<any[]>("/faculty/all", { params });

        // Handle potentially different response structures wrapper
        if (Array.isArray(response.data)) {
            return response.data;
        } else if ((response.data as any).data && Array.isArray((response.data as any).data)) {
            return (response.data as any).data;
        } else if ((response.data as any).users && Array.isArray((response.data as any).users)) {
            return (response.data as any).users;
        }

        return [];
    },

    getStudentsPendingGuide: async (): Promise<any[]> => {
        // Fetch students who have an approved offer/internship but no guide
        // Using same getAll logic but filtering client side for robustness if endpoint fails
        try {
            const response = await api.get<any[]>("/faculty/students/pending-guide");
            return response.data;
        } catch (e) {
            console.warn("Pending guide endpoint failed, using fallback");
            return [];
        }
    },

    // Coordinator-specific endpoints (from Swagger documentation)
    getAllocationData: async (): Promise<any> => {
        // API: GET /coordinator/allocation-data
        // Returns students and faculty filtered by coordinator's program and campus
        const response = await api.get<any>("/coordinator/allocation-data");
        return response.data;
    },

    allocateGuide: async (studentId: string, facultyId: string): Promise<void> => {
        // API: PATCH /coordinator/allocate-guide
        // Query params: student_id, faculty_id
        await api.patch("/coordinator/allocate-guide", null, {
            params: {
                student_id: studentId,
                faculty_id: facultyId
            }
        });
    }
};
