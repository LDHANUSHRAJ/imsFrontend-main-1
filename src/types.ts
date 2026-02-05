
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

export interface Internship {
    id: string;
    title: string;
    description: string;
    status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'CLOSED';
    department: Department;
    location_type: 'REMOTE' | 'ONSITE' | 'HYBRID';
    is_paid: boolean;
    stipend: string | null;
    duration: string;
    created_at: string;
    corporate_id: string;
    has_applied: boolean | null;
}

export interface InternshipCreate {
    title: string;
    description: string;
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
    github_link?: string | null;
    linkedin_link?: string | null;
    status: string;
    created_at: string;
    internship_id: string;
    student_id: string;
    student: {
        name: string;
        email: string;
    };
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
