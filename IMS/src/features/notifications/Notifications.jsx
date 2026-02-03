import DashboardLayout from "../../components/layout/DashboardLayout";

export default function Notifications() {
    const notifications = [
        "Internship approved for Infosys",
        "Student Rahul submitted closure report",
        "New recruiter posting pending approval",
    ];

    return (
        <DashboardLayout>
            <h1 className="text-xl font-semibold mb-6">
                Notifications
            </h1>

            <div className="bg-white rounded shadow divide-y">
                {notifications.map((n, i) => (
                    <div key={i} className="p-4 text-sm">
                        {n}
                    </div>
                ))}
            </div>
        </DashboardLayout>
    );
}
