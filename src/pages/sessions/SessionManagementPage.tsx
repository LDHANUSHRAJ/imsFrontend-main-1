import { useState } from "react";
import { Plus, X } from "lucide-react";
import { FilterBar } from "@/components/filters/FilterBar";
import { StatCard } from "@/components/dashboard/StatCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

const mockSessions = [
    {
        id: 1,
        program: "MCA",
        batch: "2024-2026",
        academicYear: "2024-25",
        startDate: "2024-06-01",
        endDate: "2025-03-31",
        status: "Active",
    },
    {
        id: 2,
        program: "MBA",
        batch: "2023-2025",
        academicYear: "2023-24",
        startDate: "2023-06-01",
        endDate: "2024-03-31",
        status: "Closed",
    },
];

export default function SessionManagementPage() {
    const [openModal, setOpenModal] = useState(false);

    return (
        <div className="space-y-6">
            {/* ================= HEADER ================= */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-[#0F2137]">
                        Internship Sessions
                    </h1>
                    <p className="text-sm text-gray-500">
                        Manage academic internship cycles
                    </p>
                </div>

                <Button onClick={() => setOpenModal(true)}>
                    <Plus size={16} className="mr-2" />
                    Create Session
                </Button>
            </div>

            {/* ================= STATS ================= */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard title="Total Sessions" value={6} />
                <StatCard title="Active Sessions" value={2} />
                <StatCard title="Upcoming Sessions" value={1} />
                <StatCard title="Closed Sessions" value={3} />
            </div>

            {/* ================= FILTERS ================= */}
            <FilterBar>
                <select className="input">
                    <option>Program</option>
                    <option>MCA</option>
                    <option>MBA</option>
                </select>

                <select className="input">
                    <option>Academic Year</option>
                    <option>2024-25</option>
                    <option>2023-24</option>
                </select>

                <select className="input">
                    <option>Status</option>
                    <option>Active</option>
                    <option>Closed</option>
                </select>
            </FilterBar>

            {/* ================= TABLE ================= */}
            <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600">
                        <tr>
                            <th className="px-6 py-3 text-left">Program</th>
                            <th className="px-6 py-3 text-left">Batch</th>
                            <th className="px-6 py-3 text-left">Academic Year</th>
                            <th className="px-6 py-3 text-left">Duration</th>
                            <th className="px-6 py-3 text-left">Status</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {mockSessions.map((session) => (
                            <tr
                                key={session.id}
                                className="border-t hover:bg-gray-50"
                            >
                                <td className="px-6 py-4">{session.program}</td>
                                <td className="px-6 py-4">{session.batch}</td>
                                <td className="px-6 py-4">{session.academicYear}</td>
                                <td className="px-6 py-4">
                                    {session.startDate} → {session.endDate}
                                </td>
                                <td className="px-6 py-4">
                                    <Badge
                                        variant={
                                            session.status === "Active"
                                                ? "success"
                                                : "neutral"
                                        }
                                    >
                                        {session.status}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <Button variant="ghost">Edit</Button>
                                    {session.status === "Active" && (
                                        <Button variant="destructive">
                                            Close
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ================= MODAL ================= */}
            {openModal && (
                <Modal onClose={() => setOpenModal(false)}>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">
                            Create Internship Session
                        </h2>
                        <button onClick={() => setOpenModal(false)}>
                            <X size={18} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <select className="input">
                            <option>Select Program</option>
                            <option>MCA</option>
                            <option>MBA</option>
                        </select>

                        <input className="input" placeholder="Batch (e.g. 2024-2026)" />

                        <input className="input" placeholder="Academic Year (2024-25)" />

                        <div className="grid grid-cols-2 gap-4">
                            <input type="date" className="input" />
                            <input type="date" className="input" />
                        </div>

                        <Button className="w-full">Create Session</Button>
                    </div>
                </Modal>
            )}
        </div>
    );
}
