import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { FilterBar } from "../../components/filters/FilterBar";
import StatCard from "../../components/ui/StatCard";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import { GuideService } from "../../services/guide.service";
import type { GuideAssignment } from "../../types";
import { Bell, ChevronRight, Users, FileText, CheckCircle, Clock } from "lucide-react";

export default function GuideDashboard() {
    const navigate = useNavigate();
    const [students, setStudents] = useState<GuideAssignment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = async () => {
        setIsLoading(true);
        try {
            const data = await GuideService.getAll();
            setStudents(data);
        } catch (error) {
            console.error("Failed to load students", error);
        } finally {
            setIsLoading(false);
        }
    };

    const stats = {
        total: students.length,
        pendingLogs: students.filter(s => s.status === 'OVERDUE_LOGS' || s.status === 'IN_PROGRESS').length, // Mock logic
        closurePending: students.filter(s => s.status === 'CLOSURE_SUBMITTED').length,
        completed: students.filter(s => s.status === 'COMPLETED').length
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* HEADER */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-[#0F2137]">
                        Guide Dashboard
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Monitor assigned students, review logs, and evaluate internships
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Bell className="text-slate-400 hover:text-[#0F2137] cursor-pointer transition-colors" />
                        <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                    </div>
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-[#0F2137]">Spring 2024</p>
                        <p className="text-xs text-slate-500">Academic Year</p>
                    </div>
                </div>
            </div>

            {/* WORKFLOW TRACKER */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Internship Workflow</h3>
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative">
                    {/* Line connecting steps */}
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -z-10 hidden md:block"></div>

                    {[
                        { label: 'Student Assigned', icon: Users, color: 'blue' },
                        { label: 'Weekly Monitoring', icon: Clock, color: 'blue' },
                        { label: 'Feedback & Support', icon: FileText, color: 'amber' },
                        { label: 'Final Evaluation', icon: CheckCircle, color: 'green' }
                    ].map((step, idx) => (
                        <div key={idx} className="flex flex-col items-center bg-white px-4">
                            <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-2 shadow-sm
                                ${idx <= 1 ? `bg-${step.color}-50 text-${step.color}-600 border border-${step.color}-100` : 'bg-slate-50 text-slate-400 border border-slate-100'}
                            `}>
                                <step.icon size={20} />
                            </div>
                            <span className="text-sm font-bold text-[#0F2137]">{step.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard title="Assigned Students" value={stats.total} />
                <StatCard title="Pending Review" value={stats.pendingLogs} />
                <StatCard title="Closure Pending" value={stats.closurePending} />
                <StatCard title="Completed" value={stats.completed} />
            </div>

            {/* MAIN CONTENT GRID */}
            <div className="grid lg:grid-cols-3 gap-8">

                {/* LEFT: Student List */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-[#0F2137]">Assigned Students</h3>
                        <div className="flex gap-2">
                            <select className="bg-white border border-slate-300 text-xs rounded-lg px-2 py-1 focus:outline-none">
                                <option>All Status</option>
                                <option>In Progress</option>
                                <option>Closure Pending</option>
                            </select>
                        </div>
                    </div>

                    <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Student</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Company</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Status</th>
                                    <th className="px-6 py-4 text-right"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {isLoading ? (
                                    <tr><td colSpan={4} className="p-8 text-center text-gray-400">Loading...</td></tr>
                                ) : students.map((s) => (
                                    <tr
                                        key={s.id}
                                        className="hover:bg-blue-50/50 cursor-pointer transition-colors group"
                                        onClick={() => navigate(`/guide/student/${s.id}`)}
                                    >
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-bold text-[#0F2137] group-hover:text-blue-600 transition-colors">{s.studentName}</p>
                                                <p className="text-xs text-slate-400">{s.studentRegNo}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">{s.companyName}</td>
                                        <td className="px-6 py-4">
                                            <Badge
                                                variant={
                                                    s.status === "COMPLETED" ? "success" :
                                                        s.status === "CLOSURE_SUBMITTED" ? "warning" :
                                                            s.status === "OVERDUE_LOGS" ? "error" : "info"
                                                }
                                            >
                                                {s.status.replace('_', ' ')}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <ChevronRight className="inline-block text-slate-300 group-hover:text-blue-500" size={18} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* RIGHT: Notifications & Headlines */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl border shadow-sm">
                        <h3 className="font-bold text-[#0F2137] mb-4 flex items-center gap-2">
                            <Bell size={16} className="text-amber-500" /> Notifications
                        </h3>
                        <div className="space-y-4">
                            <div className="flex gap-3 items-start pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                                <div className="h-2 w-2 mt-2 rounded-full bg-blue-500 flex-shrink-0"></div>
                                <div>
                                    <p className="text-sm text-slate-700"><span className="font-bold">Rahul Mehta</span> submitted Internship Final Report.</p>
                                    <p className="text-xs text-slate-400 mt-1">10 mins ago</p>
                                </div>
                            </div>
                            <div className="flex gap-3 items-start pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                                <div className="h-2 w-2 mt-2 rounded-full bg-amber-500 flex-shrink-0"></div>
                                <div>
                                    <p className="text-sm text-slate-700"><span className="font-bold">Karthik N</span> has 2 overdue weekly logs.</p>
                                    <p className="text-xs text-slate-400 mt-1">2 hours ago</p>
                                </div>
                            </div>
                            <div className="flex gap-3 items-start">
                                <div className="h-2 w-2 mt-2 rounded-full bg-green-500 flex-shrink-0"></div>
                                <div>
                                    <p className="text-sm text-slate-700"><span className="font-bold">Ananya Rao</span> submitted Week 6 Log.</p>
                                    <p className="text-xs text-slate-400 mt-1">Yesterday</p>
                                </div>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" className="w-full mt-4 text-slate-500 font-normal">View All Notifications</Button>
                    </div>

                    <div className="bg-[#0F2540] p-6 rounded-xl shadow-lg text-white">
                        <h3 className="font-bold text-lg mb-2">Guide Resources</h3>
                        <p className="text-blue-200 text-sm mb-4">Download evaluation rubrics and guidelines for internship grading.</p>
                        <Button className="w-full bg-white text-[#0F2540] hover:bg-blue-50 border-0">Download Guidelines</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
