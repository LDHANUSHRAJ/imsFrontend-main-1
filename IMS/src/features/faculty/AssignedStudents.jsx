import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";

export default function AssignedStudents() {
    const navigate = useNavigate();

    const students = [
        {
            id: 1,
            name: "Rahul Sharma",
            regNo: "CHRIST2021BCA045",
            company: "Infosys",
            status: "IN PROGRESS",
        },
        {
            id: 2,
            name: "Ananya Verma",
            regNo: "CHRIST2021MBA018",
            company: "Deloitte",
            status: "CLOSURE SUBMITTED",
        },
    ];

    return (
        <DashboardLayout>
            <h1 className="text-xl font-semibold mb-6">
                Assigned Students
            </h1>

            <div className="bg-white rounded shadow overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 text-left">Student</th>
                            <th className="p-3">Reg No</th>
                            <th className="p-3">Company</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((s) => (
                            <tr key={s.id} className="border-t">
                                <td className="p-3">{s.name}</td>
                                <td className="p-3 text-center">{s.regNo}</td>
                                <td className="p-3 text-center">{s.company}</td>
                                <td className="p-3 text-center">
                                    <StatusBadge status={s.status} />
                                </td>
                                <td className="p-3 text-center space-x-2">
                                    <button
                                        onClick={() => navigate(`/faculty/logs/${s.id}`)}
                                        className="text-blue-600 text-xs"
                                    >
                                        View Logs
                                    </button>

                                    {s.status === "CLOSURE SUBMITTED" && (
                                        <button
                                            onClick={() =>
                                                navigate(`/faculty/evaluation/${s.id}`)
                                            }
                                            className="text-green-600 text-xs"
                                        >
                                            Final Review
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
}

function StatusBadge({ status }) {
    const map = {
        "IN PROGRESS": "bg-blue-100 text-blue-700",
        "CLOSURE SUBMITTED": "bg-yellow-100 text-yellow-700",
        CLOSED: "bg-green-100 text-green-700",
    };

    return (
        <span className={`px-2 py-1 rounded text-xs ${map[status]}`}>
            {status}
        </span>
    );
}
