import { Routes, Route } from "react-router-dom";
import Login from "../features/auth/Login";
import InternshipApprovals from "../features/coordinator/InternshipApprovals";
import RecruiterDashboard from "../features/recruiter/RecruiterDashboard";
import InternshipSessions from "../features/coordinator/InternshipSessions";
import PostInternship from "../features/recruiter/PostInternship";
import ICDashboard from "../features/coordinator/ICDashboard";
import HODDashboard from "../features/hod/HODDashboard";
import FacultyDashboard from "../features/faculty/FacultyDashboard";
import HODStudentApplications from "../features/hod/StudentApplications";
import ICStudentApplications from "../features/coordinator/StudentApplications";
import AssignedStudents from "../features/faculty/AssignedStudents";
import StudentLogs from "../features/faculty/StudentLogs";
import FinalEvaluation from "../features/faculty/FinalEvaluation";
import ReportsDashboard from "../features/reports/ReportsDashboard";
import RecruiterManagement from "../features/coordinator/RecruiterManagement";
import GuideAssignment from "../features/coordinator/GuideAssignment";
import MyInternships from "../features/recruiter/MyInternships";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/ic/sessions" element={<InternshipSessions />} />
            <Route path="/ic/approvals" element={<InternshipApprovals />} />
            <Route path="/ic/guides" element={<GuideAssignment />} />
            <Route path="/ic/recruiters" element={<RecruiterManagement />} />

            <Route path="/faculty/students" element={<AssignedStudents />} />
            <Route path="/faculty/logs/:id" element={<StudentLogs />} />
            <Route path="/faculty/evaluation/:id" element={<FinalEvaluation />} />
            <Route path="/reports" element={<ReportsDashboard />} />

            <Route path="/hod/applications" element={<HODStudentApplications />} />
            <Route path="/ic/applications" element={<ICStudentApplications />} />

            {/* Recruiter */}
            <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
            <Route path="/recruiter/post" element={<PostInternship />} />
            <Route path="/recruiter/list" element={<MyInternships />} />

            {/* IC / HOD / Faculty */}
            <Route path="/ic/dashboard" element={<ICDashboard />} />
            <Route path="/hod/dashboard" element={<HODDashboard />} />
            <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
        </Routes>
    );
}
