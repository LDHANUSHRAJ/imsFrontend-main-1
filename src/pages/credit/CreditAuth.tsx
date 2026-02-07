import { useEffect, useState } from 'react';
import { ClosureService, type ClosureRecord } from '../../services/mock/ClosureService';
import {
    User, FileText, Download,
    GraduationCap, CheckCircle2,
    Eye, ArrowUpRight, ExternalLink,
    Search, Briefcase, Award
} from 'lucide-react';

const CreditAuth = () => {
    const [creditedStudents, setCreditedStudents] = useState<ClosureRecord[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<ClosureRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStudent, setSelectedStudent] = useState<ClosureRecord | null>(null);

    useEffect(() => {
        loadCreditedStudents();
    }, []);

    useEffect(() => {
        const filtered = creditedStudents.filter(s =>
            s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.studentRegNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.internshipTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.companyName.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredStudents(filtered);
    }, [searchQuery, creditedStudents]);

    const loadCreditedStudents = async () => {
        try {
            const data = await ClosureService.getAll();
            // Filter only students who have received credits
            const credited = data.filter(closure => closure.status === 'CLOSED' && closure.credits);
            setCreditedStudents(credited);
            setFilteredStudents(credited);
        } catch (error) {
            console.error('Error loading credited students:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        const headers = ["Student Name", "Reg No", "Internship", "Company", "Duration", "Credits", "Remarks"];
        const rows = filteredStudents.map(s => [
            s.studentName,
            s.studentRegNo,
            s.internshipTitle,
            s.companyName,
            s.duration,
            s.credits,
            s.evaluation?.remarks || ''
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `Credit_Authorization_Report_${new Date().toLocaleDateString()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-slate-500 animate-pulse">Retreiving credit authorizations...</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Header with Export and Report buttons */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-[#0F172A] tracking-tighter flex items-center gap-3">
                        Academic Credit Auth
                        <span className="bg-blue-100 text-blue-600 text-[10px] uppercase font-black px-3 py-1 rounded-full tracking-widest">Registrar Sync</span>
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">Verify and authorize academic credits for completed internships.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleExport}
                        className="h-12 px-6 bg-white border border-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center gap-2 shadow-sm"
                    >
                        <Download size={16} /> Export CSV
                    </button>
                    <button className="h-12 px-6 bg-[#0F172A] rounded-2xl font-black text-xs uppercase tracking-widest text-white hover:bg-blue-600 transition-all shadow-lg shadow-blue-900/10">
                        Official Report
                    </button>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                        <User size={28} />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-[#0F172A]">{creditedStudents.length}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Students</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
                    <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                        <GraduationCap size={28} />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-[#0F172A]">
                            {creditedStudents.reduce((acc, s) => acc + (s.credits || 0), 0)}
                        </p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg. Credits/Student</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
                    <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
                        <CheckCircle2 size={28} />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-[#0F172A]">{creditedStudents.length}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sync Status (IMS/ERP)</p>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input
                    type="text"
                    placeholder="Search by student name, register number or role..."
                    className="w-full h-16 bg-white border border-slate-200 rounded-[2rem] pl-16 pr-6 font-bold text-slate-600 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 transition-all shadow-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Student Details</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Internship Role</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Duration</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Auth Credits</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredStudents.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-16 text-center">
                                        <div className="max-w-xs mx-auto space-y-3">
                                            <div className="bg-slate-50 w-12 h-12 rounded-xl flex items-center justify-center mx-auto text-slate-300">
                                                <Search size={24} />
                                            </div>
                                            <p className="font-bold text-slate-400">No matching credit records found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredStudents.map((student) => (
                                    <tr key={student.id} className="hover:bg-slate-50/30 transition-all group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center font-black text-slate-400 text-xs shadow-inner">
                                                    {student.studentName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-black text-[#0F172A] italic">{student.studentName}</p>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{student.studentRegNo}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div>
                                                <p className="font-bold text-slate-600">{student.internshipTitle}</p>
                                                <p className="text-xs font-bold text-blue-600 mt-1">@ {student.companyName}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <span className="text-xs font-black text-slate-500 bg-slate-100/50 px-3 py-1 rounded-lg border border-slate-100">{student.duration}</span>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl border border-emerald-100/50 shadow-sm">
                                                <GraduationCap size={16} />
                                                <span className="font-black text-sm">{student.credits}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button
                                                onClick={() => setSelectedStudent(student)}
                                                className="p-3 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                                                <Eye size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detail Modal */}
            {selectedStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-10">
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="bg-emerald-500 p-2.5 rounded-xl text-white shadow-lg shadow-emerald-500/20">
                                        <CheckCircle2 size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-black text-[#0F172A] tracking-tighter">Auth Transcript</h2>
                                        <p className="text-blue-600 font-black uppercase text-[10px] tracking-widest mt-1">Ref CID-V{selectedStudent.id}</p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedStudent(null)} className="p-3 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-full transition-colors">
                                    <ArrowUpRight size={24} className="rotate-180" />
                                </button>
                            </div>

                            <div className="space-y-8">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Intern Name</p>
                                        <p className="text-slate-900 font-black italic">{selectedStudent.studentName}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Awarded Credits</p>
                                        <p className="text-emerald-600 font-black italic">{selectedStudent.credits} Academic Credits</p>
                                    </div>
                                </div>

                                <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Official Guide Remarks</p>
                                    <p className="text-slate-600 font-medium leading-relaxed italic">
                                        "{selectedStudent.evaluation?.remarks}"
                                    </p>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <button className="w-full py-4 bg-[#0F172A] text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-900/10 hover:bg-blue-600 transition-all flex items-center justify-center gap-3">
                                        <Download size={18} /> Download Evidence Packet
                                    </button>
                                    <button className="w-full py-4 bg-white text-slate-400 font-black text-[10px] uppercase tracking-widest rounded-2xl border border-slate-100 hover:text-slate-600 transition-all flex items-center justify-center gap-2">
                                        <ExternalLink size={14} /> Open Completion Certificate
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreditAuth;
