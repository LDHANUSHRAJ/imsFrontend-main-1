import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";

export default function InternshipApprovals() {
    const [selected, setSelected] = useState(null);

    const internships = [
        {
            id: 1,
            company: "Infosys",
            role: "Software Intern",
            duration: "3 Months",
            stipend: "₹15,000",
            status: "PENDING",
        },
        {
            id: 2,
            company: "Deloitte",
            role: "Business Analyst Intern",
            duration: "6 Months",
            stipend: "₹20,000",
            status: "APPROVED",
        },
    ];

    return (
        <DashboardLayout>
            <h1 className="text-xl font-semibold mb-6">
                Internship Approval Queue
            </h1>

            <div className="bg-white rounded shadow overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 text-left">Company</th>
                            <th className="p-3 text-left">Role</th>
                            <th className="p-3">Duration</th>
                            <th className="p-3">Stipend</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {internships.map((i) => (
                            <tr key={i.id} className="border-t">
                                <td className="p-3">{i.company}</td>
                                <td className="p-3">{i.role}</td>
                                <td className="p-3 text-center">{i.duration}</td>
                                <td className="p-3 text-center">{i.stipend}</td>
                                <td className="p-3 text-center">
                                    <StatusBadge status={i.status} />
                                </td>
                                <td className="p-3 text-center">
                                    {i.status === "PENDING" && (
                                        <button
                                            onClick={() => setSelected(i)}
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
                <ApprovalModal
                    internship={selected}
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

function ApprovalModal({ internship, onClose }) {
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-lg rounded shadow p-6">
                <h2 className="text-lg font-semibold mb-4">
                    Review Internship Posting
                </h2>

                <div className="text-sm space-y-2 mb-4">
                    <p><b>Company:</b> {internship.company}</p>
                    <p><b>Role:</b> {internship.role}</p>
                    <p><b>Duration:</b> {internship.duration}</p>
                    <p><b>Stipend:</b> {internship.stipend}</p>
                </div>

                <textarea
                    placeholder="Feedback / Remarks (optional)"
                    className="w-full border rounded p-2 text-sm mb-4"
                    rows="3"
                />

                <div className="flex justify-end gap-3">
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
                        Approve & Publish
                    </button>
                </div>
            </div>
        </div>
    );
}
