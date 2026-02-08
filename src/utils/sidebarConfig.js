export const sidebarConfig = {
    IC: [
        { label: "Guide Allocation", path: "/ic/dashboard" },
        { label: "Logout", path: "/logout" }, // Optional, usually in profile
    ],

    HOD: [
        { label: "Dashboard", path: "/hod/dashboard" },
        { label: "Student Applications", path: "/hod/applications" },
        { label: "LOR Approvals", path: "/hod/lor" },
        { label: "Reports", path: "/reports" },
    ],

    FACULTY: [
        { label: "Dashboard", path: "/dashboard" },
        { label: "Assigned Students", path: "/assigned-students" },
    ],

    RECRUITER: [
        { label: "Dashboard", path: "/recruiter/dashboard" },
        { label: "Post Internship", path: "/recruiter/post" },
        { label: "My Internships", path: "/recruiter/list" },
        { label: "Reports", path: "/reports" },
    ],

    STUDENT: [
        { label: "Dashboard", path: "/dashboard" },
        { label: "Offers", path: "/offers" },
        { label: "My Applications", path: "/applications" },
        { label: "My Internship", path: "/my-internship" },
    ],

    PLACEMENT_OFFICE: [
        { label: "Dashboard", path: "/dashboard" },
        { label: "Recruiters", path: "/recruiters" },
        { label: "Company Approvals", path: "/company-approvals" },
        { label: "Credits Approval", path: "/credits-approval" },
        { label: "Credit Auth", path: "/credit-auth" },
    ],
};
