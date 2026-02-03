import DashboardLayout from "../../components/layout/DashboardLayout";
import { Link } from "react-router-dom";

export default function RecruiterDashboard() {
    return (
        <DashboardLayout>
            <h1 className="text-xl font-semibold mb-4">Recruiter Dashboard</h1>

            <div className="bg-white p-4 rounded shadow">
                <p>You can post internship opportunities for CHRIST students.</p>
                <Link to="/recruiter/post" className="text-christBlue underline mt-2 inline-block">
                    + Post New Internship
                </Link>
            </div>
        </DashboardLayout>
    );
}
