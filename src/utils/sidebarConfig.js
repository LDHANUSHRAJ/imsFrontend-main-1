export const sidebarConfig = {
    PROGRAMME_COORDINATOR: [
        { label: "Guide Allocation", path: "/dashboard" },
        { label: "Reference", path: "/ic/dashboard" } // Keeping legacy path just in case
    ],

    HOD: [
        { label: "Dashboard", path: "/dashboard" },
        { label: "Student Applications", path: "/hod/applications" },
        { label: "LOR Approvals", path: "/hod/lor" },
        { label: "Reports", path: "/reports" },
    ],

    FACULTY: [
        { label: "Dashboard", path: "/dashboard" },
        { label: "Assigned Students", path: "/assigned-students" },
    ],

    RECRUITER: [
        { label: "Dashboard", path: "/dashboard" },
        { label: "Post Internship", path: "/jobs/new" },
        { label: "My Internships", path: "/jobs" },
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
        { label: "Approved Internships", path: "/approved-internships" },
    ],

    PLACEMENT: [
        { label: "Dashboard", path: "/dashboard" },
        { label: "Approved Internships", path: "/approved-internships" },
    ],

    PLACEMENT_HEAD: [
        { label: "Dashboard", path: "/dashboard" },
        { label: "Recruiter Approvals", path: "/company-approvals" },
        { label: "Approved Internships", path: "/approved-internships" },
        { label: "All Recruiters", path: "/recruiters" },
    ],
};
