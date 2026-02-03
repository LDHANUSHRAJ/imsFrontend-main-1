import { useState } from "react";
import { FilterBar } from "../../components/filters/FilterBar";
import { StatCard } from "../../components/dashboard/StatCard";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import EvaluationModal from "./EvaluationModal";

const mockStudents = [
    {
        id: 1,
        name: "Ananya Rao",
        program: "MCA",
        company: "Infosys",
        status: "In Progress",
    },
    {
        id: 2,
        name: "Rahul Mehta",
        program: "MBA",
        company: "Deloitte",
        status: "Closure Submitted",
    },
    {
        id: 3,
        name: "Karthik N",
        program: "MCA",
        company: "Wipro",
        status: "Overdue Log Submission",
    },
];

export default function GuideDashboard() {
    const [openEval, setOpenEval] = useState(false);

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-semibold text-[#0F2137]">
                    Guide Dashboard
                </h1>
                <p className="text-sm text-gray-500">
                    Monitor assigned students and evaluate internships
                </p>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard title="Assigned Students" value={3} />
                <StatCard title="Logs Pending Review" value={1} />
                <StatCard title="Closure Pending" value={1} />
                <StatCard title="Overdue Logs" value={1} isWarning />
            </div>

            {/* FILTERS */}
            <FilterBar>
                <select className="w-full bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 shadow-sm">
                    <option>Status</option>
                    <option>In Progress</option>
                    <option>Closure Submitted</option>
                    <option>Overdue Log Submission</option>
                    <option>Closed</option>
                </select>

                <select className="w-full bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 shadow-sm">
                    <option>Program</option>
                    <option>MCA</option>
                    <option>MBA</option>
                </select>
            </FilterBar>

            {/* TABLE */}
            <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left">Student</th>
                            <th className="px-6 py-3 text-left">Program</th>
                            <th className="px-6 py-3 text-left">Company</th>
                            <th className="px-6 py-3 text-left">Status</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {mockStudents.map((s) => (
                            <tr key={s.id} className="border-t hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium">{s.name}</td>
                                <td className="px-6 py-4">{s.program}</td>
                                <td className="px-6 py-4">{s.company}</td>
                                <td className="px-6 py-4">
                                    <Badge
                                        variant={
                                            s.status === "Closed"
                                                ? "success"
                                                : s.status === "Closure Submitted"
                                                    ? "warning"
                                                    : s.status === "Overdue Log Submission"
                                                        ? "error"
                                                        : "neutral"
                                        }
                                    >
                                        {s.status}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <Button variant="ghost">View Logs</Button>
                                    {s.status === "Closure Submitted" && (
                                        <Button onClick={() => setOpenEval(true)}>
                                            Evaluate
                                        </Button>
                                    )}
                                    {s.status === "Overdue Log Submission" && (
                                        <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                                            Send Reminder
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Additional Content Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <h3 className="font-semibold text-[#0F2137] mb-4">Recent Student Activity</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                                <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                                    AR
                                </div>
                                <div>
                                    <p className="text-sm text-slate-800"><span className="font-medium">Ananya Rao</span> uploaded Week {i} Log</p>
                                    <p className="text-xs text-slate-500">2 hours ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <h3 className="font-semibold text-[#0F2137] mb-4">Upcoming Deadlines</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-red-50 text-red-700 rounded-lg">
                            <span className="text-sm font-medium">Mid-Term Evaluation</span>
                            <span className="text-xs font-bold bg-white px-2 py-1 rounded border border-red-100">Feb 15</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-amber-50 text-amber-700 rounded-lg">
                            <span className="text-sm font-medium">Final Report Submission</span>
                            <span className="text-xs font-bold bg-white px-2 py-1 rounded border border-amber-100">Mar 20</span>
                        </div>
                    </div>
                </div>
            </div>

            {openEval && (
                <EvaluationModal onClose={() => setOpenEval(false)} />
            )}
        </div>
    );
}
