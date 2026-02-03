import DashboardLayout from "../../components/layout/DashboardLayout";
import { useParams } from "react-router-dom";

export default function StudentLogs() {
    const { id } = useParams();

    const logs = [
        { week: "Week 1", content: "Onboarding & training completed" },
        { week: "Week 2", content: "Worked on internal tools" },
        { week: "Week 3", content: "API integration tasks" },
    ];

    return (
        <DashboardLayout>
            <h1 className="text-xl font-semibold mb-6">
                Student Logs (Read Only)
            </h1>

            <div className="space-y-4">
                {logs.map((log, idx) => (
                    <div key={idx} className="bg-white p-4 rounded shadow">
                        <h3 className="font-medium mb-2">{log.week}</h3>
                        <p className="text-sm text-gray-700">{log.content}</p>
                    </div>
                ))}
            </div>
        </DashboardLayout>
    );
}
