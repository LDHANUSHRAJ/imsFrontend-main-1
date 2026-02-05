import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GuideService } from "../../services/guide.service";
import type { GuideAssignment } from "../../types";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import { ChevronRight, Search, Filter } from "lucide-react";

export default function AssignedStudents() {
    const navigate = useNavigate();
    const [students, setStudents] = useState<GuideAssignment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

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

    const filteredStudents = students.filter(student => {
        const matchesSearch = student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.studentRegNo.includes(searchTerm);
        const matchesStatus = statusFilter === "ALL" || student.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#0F2137]">Assigned Students</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage and track progress of your mentees.
                    </p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or reg no..."
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2137]/20"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <select
                            className="pl-10 pr-8 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2137]/20 appearance-none bg-white"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="ALL">All Status</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="OVERDUE_LOGS">Action Needed</option>
                            <option value="CLOSURE_SUBMITTED">Closure Pending</option>
                            <option value="COMPLETED">Completed</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-[#0F2540] text-white uppercase text-xs font-bold tracking-wider">
                        <tr>
                            <th className="px-6 py-4 rounded-tl-lg">Student Details</th>
                            <th className="px-6 py-4">Internship / Company</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 rounded-tr-lg text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                            <tr><td colSpan={4} className="p-12 text-center text-gray-400">Loading student records...</td></tr>
                        ) : filteredStudents.length === 0 ? (
                            <tr><td colSpan={4} className="p-12 text-center text-gray-400">No students found matching filters.</td></tr>
                        ) : (
                            filteredStudents.map((s) => (
                                <tr
                                    key={s.id}
                                    className="hover:bg-blue-50/30 cursor-pointer transition-colors group"
                                    onClick={() => navigate(`/guide/student/${s.id}`)}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 group-hover:bg-[#0F2137] group-hover:text-white transition-colors">
                                                {s.studentName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-[#0F2137] text-base">{s.studentName}</p>
                                                <p className="text-xs text-slate-500 font-mono">{s.studentRegNo}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <p className="font-medium text-slate-700">{s.internshipTitle}</p>
                                            <p className="text-xs text-slate-500 flex items-center gap-1">
                                                <span className="w-2 h-2 rounded-full bg-slate-300"></span> {s.companyName}
                                            </p>
                                        </div>
                                    </td>
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
                                        <Button size="sm" variant="ghost" className="text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50">
                                            View Logs <ChevronRight size={16} className="ml-1 inline" />
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
