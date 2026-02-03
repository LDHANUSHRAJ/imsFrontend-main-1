import React from 'react';
import { useAuth } from '../context/AuthContext';
import ICDashboard from './dashboards/ICDashboard';
// Assuming other dashboards are imported similarly
import FacultyDashboard from './dashboards/FacultyDashboard';
import HODDashboard from './dashboards/HODDashboard';
import RecruiterDashboard from './dashboards/RecruiterDashboard';

const Dashboard = () => {
    const { user } = useAuth();

    if (!user) return null;

    // Component mapping strictly following Part B, C, E, F flows
    switch (user.role) {
        case 'IC':
            return <ICDashboard />;
        case 'HOD':
            return <HODDashboard />;
        case 'FACULTY':
            return <FacultyDashboard />;
        case 'RECRUITER':
            return <RecruiterDashboard />;
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