
export interface InternshipSession {
    id: string;
    academicYear: string; // e.g., '2023-2024'
    program: string;      // e.g., 'MCA', 'BTech'
    batch: string;        // e.g., '2022-2024'
    startDate: string;    // ISO Date string
    endDate: string;      // ISO Date string
    isActive: boolean;
}

export interface StudentApplication {
    id: string;
    jobId: string;
    studentName: string;
    studentRegNo: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    appliedAt: string;
}

export interface JobPosting {
    id: string;
    title: string;
    companyName: string;
    companyId?: string;
    description?: string;
    requirements?: string[];
    // ... other job fields
    // ... other job fields
}

export interface GuideAssignment {
    id: string;
    studentName: string;
    studentRegNo: string;
    internshipTitle: string;
    companyName: string;
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
    guide?: string;
    feedback: string[];
}
