import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";

export default function StudentApplications() {
    const [selected, setSelected] = useState(null);

    const applications = [
        {
            id: 1,
            student: "Rahul Sharma",
            regNo: "CHRIST2021BCA045",
            company: "Infosys",
            role: "Software Intern",
            type: "Applied via Portal",
            status: "PENDING",
        },
        {
            id: 2,
            student: "Ananya Verma",
            regNo: "CHRIST2021MBA018",
            company: "Deloitte",
            role: "Business Analyst Intern",
            type: "External Offer",
            status: "APPROVED",
        },
    ];

    return (
        <DashboardLayout>
            <h1 className="text-xl font-semibold mb-6">
                Student Internship Applications
            </h1>

            <div className="bg-white rounded shadow overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 text-left">Student</th>
                            <th className="p-3">Reg No</th>
                            <th className="p-3">Company</th>
                            <th className="p-3">Role</th>
                            <th className="p-3">Type</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map((a) => (
                            <tr key={a.id} className="border-t">
                                <td className="p-3">{a.student}</td>
                                <td className="p-3 text-center">{a.regNo}</td>
                                <td className="p-3 text-center">{a.company}</td>
                                <td className="p-3 text-center">{a.role}</td>
                                <td className="p-3 text-center">{a.type}</td>
                                <td className="p-3 text-center">
                                    <StatusBadge status={a.status} />
                                </td>
                                <td className="p-3 text-center">
                                    {a.status === "PENDING" && (
                                        <button
                                            onClick={() => setSelected(a)}
                                            className="text-blue-600 text-xs"
                                        >
                                            Review
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selected && (
                <ReviewModal
                    application={selected}
                    onClose={() => setSelected(null)}
                />
            )}
        </DashboardLayout>
    );
}

/* ---------------- COMPONENTS ---------------- */

function StatusBadge({ status }) {
    const styles = {
        PENDING: "bg-yellow-100 text-yellow-700",
        APPROVED: "bg-green-100 text-green-700",
        REJECTED: "bg-red-100 text-red-700",
    };

    return (
        <span
            className={`px-2 py-1 rounded text-xs font-medium ${styles[status]}`}
        >
            {status}
        </span>
    );
}

function ReviewModal({ application, onClose }) {
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-xl rounded shadow p-6">
                <h2 className="text-lg font-semibold mb-4">
                    Review Application
                </h2>

                <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                    <p><b>Student:</b> {application.student}</p>
                    <p><b>Reg No:</b> {application.regNo}</p>
                    <p><b>Company:</b> {application.company}</p>
                    <p><b>Role:</b> {application.role}</p>
                    <p><b>Application Type:</b> {application.type}</p>
                </div>

                <div className="mb-4">
                    <label className="text-sm font-medium">Remarks</label>
                    <textarea
                        rows="3"
                        className="w-full border rounded p-2 text-sm"
                        placeholder="Approval / Rejection remarks"
                    />
                </div>

                <div className="flex justify-between items-center">
                    <button className="text-sm text-blue-600">
                        Generate LOR (PDF)
                    </button>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border rounded"
                        >
                            Cancel
                        </button>

                        <button className="px-4 py-2 bg-red-600 text-white rounded">
                            Reject
                        </button>

                        <button className="px-4 py-2 bg-green-600 text-white rounded">
                            Approve
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
