import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";

export default function InternshipSessions() {
    const [showForm, setShowForm] = useState(false);

    const sessions = [
        {
            id: 1,
            program: "BCA",
            batch: "2022–2025",
            year: "2024–25",
            start: "01-Jun-2024",
            end: "30-Sep-2024",
            status: "ACTIVE",
        },
        {
            id: 2,
            program: "MBA",
            batch: "2021–2023",
            year: "2023–24",
            start: "01-Jan-2024",
            end: "30-Apr-2024",
            status: "CLOSED",
        },
    ];

    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-semibold">Internship Sessions</h1>

                <button
                    onClick={() => setShowForm(true)}
                    className="bg-christBlue text-white px-4 py-2 rounded text-sm"
                >
                    + Open New Session
                </button>
            </div>

            {/* SESSION TABLE */}
            <div className="bg-white rounded shadow overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100 text-left">
                        <tr>
                            <th className="p-3">Program</th>
                            <th className="p-3">Batch</th>
                            <th className="p-3">Academic Year</th>
                            <th className="p-3">Duration</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sessions.map((s) => (
                            <tr key={s.id} className="border-t">
                                <td className="p-3">{s.program}</td>
                                <td className="p-3">{s.batch}</td>
                                <td className="p-3">{s.year}</td>
                                <td className="p-3">
                                    {s.start} → {s.end}
                                </td>
                                <td className="p-3">
                                    <StatusBadge status={s.status} />
                                </td>
                                <td className="p-3 space-x-2">
                                    <button className="text-blue-600 text-xs">Edit</button>
                                    {s.status === "ACTIVE" && (
                                        <button className="text-red-600 text-xs">
                                            Close
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* CREATE SESSION MODAL */}
            {showForm && <CreateSessionModal onClose={() => setShowForm(false)} />}
        </DashboardLayout>
    );
}

/* ---------------- COMPONENTS ---------------- */

function StatusBadge({ status }) {
    const styles = {
        ACTIVE: "bg-green-100 text-green-700",
        CLOSED: "bg-gray-200 text-gray-700",
    };

    return (
        <span
            className={`px-2 py-1 rounded text-xs font-medium ${styles[status]}`}
        >
            {status}
        </span>
    );
}

function CreateSessionModal({ onClose }) {
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-lg rounded shadow p-6">
                <h2 className="text-lg font-semibold mb-4">
                    Open Internship Session
                </h2>

                <form className="grid grid-cols-2 gap-4 text-sm">
                    <Input label="Program" placeholder="BCA / BBA / MBA" />
                    <Input label="Batch" placeholder="2022–2025" />
                    <Input label="Academic Year" placeholder="2024–25" />
                    <Input type="date" label="Start Date" />
                    <Input type="date" label="End Date" />

                    <div className="col-span-2 flex justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-christBlue text-white rounded"
                        >
                            Create Session
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function Input({ label, type = "text", ...props }) {
    return (
        <div>
            <label className="block mb-1 text-gray-600">{label}</label>
            <input
                type={type}
                {...props}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-christBlue"
            />
        </div>
    );
}
