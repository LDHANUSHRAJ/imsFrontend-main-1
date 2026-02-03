import DashboardLayout from "../../components/layout/DashboardLayout";

export default function MyInternships() {
    return (
        <DashboardLayout>
            <h1 className="text-xl font-semibold mb-6">My Internships</h1>

            <div className="bg-white p-8 rounded shadow text-center">
                <p className="text-gray-500 mb-2">View and manage your posted internships.</p>
                <p className="text-sm text-gray-400">This feature is under development.</p>
            </div>
        </DashboardLayout>
    );
}
