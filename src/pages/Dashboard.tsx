import { useAuth } from '../context/AuthContext';

// Dashboards for 5 Roles
import PlacementHeadDashboard from './dashboards/PlacementHeadDashboard';
import PlacementOfficerDashboard from './dashboards/PlacementOfficerDashboard';
import CoordinatorDashboard from './dashboards/CoordinatorDashboard';
import FacultyDashboard from './dashboards/FacultyDashboard';
import StudentDashboard from './dashboards/StudentDashboard';

// Other Imports
import HODDashboard from './dashboards/HODDashboard';
import RecruiterDashboard from './dashboards/RecruiterDashboard';

const Dashboard = () => {
    const { user } = useAuth();

    if (!user) return null;

    // Component mapping strictly following Part B, C, E, F flows
    switch (user.role) {
        case 'PROGRAMME_COORDINATOR':
            return <CoordinatorDashboard />; // Separated Dashboard
        case 'PLACEMENT_OFFICE':
        case 'PLACEMENT':
            return <PlacementOfficerDashboard />; // Separated Dashboard (Internship Approvals)
        case 'PLACEMENT_HEAD':
            return <PlacementHeadDashboard />; // Separated Dashboard (Recruiter Approvals)
        case 'HOD':
            return <HODDashboard />;
        case 'FACULTY':
            return <FacultyDashboard />; // Separated Dashboard
        case 'CORPORATE':
        case 'RECRUITER':
            return <RecruiterDashboard />;
        case 'STUDENT':
            return <StudentDashboard />;
        default:
            return (
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center bg-white p-10 rounded-2xl border border-slate-200 shadow-sm">
                        <h2 className="text-xl font-bold text-[#0F2137]">Access Restored</h2>
                        <p className="text-slate-500 mt-2 italic font-medium">Validating ESPro permissions...</p>
                    </div>
                </div>
            );
    }
};

export default Dashboard;