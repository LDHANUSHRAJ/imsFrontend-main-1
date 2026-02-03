export function roleRedirect(role) {
    switch (role) {
        case "IC":
            return "/ic/dashboard";
        case "HOD":
            return "/hod/dashboard";
        case "FACULTY":
            return "/faculty/dashboard";
        case "RECRUITER":
            return "/recruiter/dashboard";
        default:
            return "/";
    }
}
