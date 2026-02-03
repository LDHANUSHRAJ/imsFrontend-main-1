import DashboardLayout from "../../components/layout/DashboardLayout";

export default function ReportsDashboard() {
    return (
        <DashboardLayout>
            <h1 className="text-xl font-semibold mb-6">
                Reports & Analytics
            </h1>

            <div className="grid md:grid-cols-3 gap-6">
                <ReportCard title="Internship Summary" />
                <ReportCard title="Department-wise Report" />
                <ReportCard title="Company Engagement Report" />
                <ReportCard title="Student Performance Report" />
            </div>
        </DashboardLayout>
    );
}

function ReportCard({ title }) {
    return (
        <div className="bg-white p-5 rounded shadow">
            <h2 className="font-medium mb-2">{title}</h2>
            <button className="text-sm text-blue-600">
                Generate PDF
            </button>
        </div>
    );
}
