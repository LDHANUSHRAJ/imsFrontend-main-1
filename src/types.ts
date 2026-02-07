
export interface User {
    id: string;
    name: string;
    email: string;
    role: 'FACULTY' | 'CORPORATE' | 'PLACEMENT' | 'STUDENT' | 'ADMIN';
    company_name?: string | null;
    hr_name?: string | null;
    department_id?: string | null;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
}

export interface Department {
    id: string;
    name: string;
}

export interface Program {
    id: string;
    name: string;
    department_id: string;
}

export interface Campus {
    id: string;
    name: string;
}

export interface Internship {
    id: string;
    title: string;
    company_name?: string; // High-level UI identification
    description: string;
    requirements?: string[]; // Added for detailed view
    status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'CLOSED';
    department: Department;
    location_type: 'REMOTE' | 'ONSITE' | 'HYBRID';
    is_paid: boolean;
    stipend: string | null;
    duration: string;
    created_at: string;
    corporate_id: string;
    has_applied: boolean | null;
    is_verified?: boolean; // For Placement Office verification status
}

export interface InternshipCreate {
    title: string;
    company_name?: string;
    description: string;
    requirements?: string[];
    department_id: string;
    location_type: 'REMOTE' | 'ONSITE' | 'HYBRID';
    is_paid: boolean;
    stipend?: string | null;
    duration: string;
}

export interface InternshipUpdate {
    title?: string | null;
    description?: string | null;
    department_id?: string | null;
    location_type?: 'REMOTE' | 'ONSITE' | 'HYBRID' | null;
    is_paid?: boolean | null;
    stipend?: string | null;
    duration?: string | null;
}

export interface StudentApplication {
    id: string;
    resume_link: string;
    updated_resume_url?: string; // The one uploaded during application
    skills?: string[]; // Skills submitted during application
    github_link?: string | null;
    linkedin_link?: string | null;
    status: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'SHORTLISTED' | 'REJECTED' | 'OFFER_RECEIVED' | 'ARCHIVED' | 'ACTIVE';
    created_at: string;
    internship_id: string;
    student_id: string;
    student: {
        name: string;
        email: string;
        cgpa?: number; // Added for filtering/AI scoring
    };
    matchScore?: number; // AI score 0-100
    aiReasoning?: string; // Why they matched
}

export interface CorporateRegister {
    name: string;
    email: string;
    password: string;
    company_name: string;
    hr_name: string;
    // New Fields
    company_type?: 'STARTUP' | 'CORPORATE';
    country?: string;
    industry?: string;
    registered_address?: string;
    registered_id?: string;
    linkedin_url?: string;
    website_url?: string;
}

export interface StudentRegister {
    name: string;
    email: string;
    password: string;
    department_id: string;
    program_id: string;
    campus_id: string;
}

export interface AdminUserCreate {
    name: string;
    email: string;
    password: string;
    role: 'FACULTY' | 'CORPORATE' | 'PLACEMENT' | 'STUDENT' | 'ADMIN';
    company_name?: string | null;
    hr_name?: string | null;
    department_id?: string | null;
}

export interface InternshipSession {
    id: string;
    academicYear: string;
    program: string;
    subProgram?: string;
    batch: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
    mode?: 'ONSITE' | 'REMOTE' | 'HYBRID';
    duration?: string;
    stipend?: string;
}

export interface MonitoringFeedback {
    id: string;
    message: string;
    date: string;
    guideName?: string;
}

export interface GuideAssignment {
    id: string;
    studentName: string;
    studentRegNo: string;
    department: string;
    internshipTitle: string;
    companyName: string;
    status: string;
    guide?: string;
    guideId?: string;
    feedback?: MonitoringFeedback[];
    assignmentReasoning?: string;
}

export interface WeeklyLog {
    id: string;
    weekNumber: number;
    startDate: string;
    endDate: string;
    workSummary: string;
    skillsLearned: string;
    challengesFaced: string;
    hoursWorked: number;
    status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
    guideComments?: string;
    attachments?: string[]; // Screenshots/Docs
    submissionDate?: string;
}

export interface InternshipCompletion {
    id: string;
    studentId: string;
    internshipId: string;
    totalLogsSubmitted: number;
    attendancePercentage: number;
    guideRating: number;
    finalReportUrl?: string;
    status: 'IN_PROGRESS' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
    certificateUrl?: string;
    completedAt?: string;
}

export interface GuideFeedback {
    attendanceRating: number;
    technicalSkillsRating: number;
    communicationRating: number;
    punctualityRating: number;
    performanceRating: number;
    comments: string;
    submittedDate: string;
}

export interface StudentProfileExtended extends GuideAssignment {
    email: string;
    phone?: string;
    department: string;
    startDate: string;
    endDate: string;
    logs: WeeklyLog[];
    finalFeedback?: GuideFeedback;
}

export interface Faculty {
    id: string;
    name: string;
    department: string;
    expertise: string[];
    email: string;
    currentLoad: number;
    maxCapacity: number;
}

export interface AssignmentRecommendation {
    studentId: string;
    facultyId: string;
    facultyName: string;
    matchScore: number;
    reasoning: string;
    matchedSpecializations?: string[];
}

export interface AssignmentStats {
    totalStudents: number;
    assignedStudents: number;
    unassignedStudents: number;
    byDepartment: Record<string, number>;
    byStatus: Record<string, number>;
}
