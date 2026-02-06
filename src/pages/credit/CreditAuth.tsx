import { useEffect, useState } from 'react';
import { ClosureService, type ClosureRecord } from '../../services/mock/ClosureService';
import { Award, Briefcase, User, Calendar, CheckCircle } from 'lucide-react';
import Badge from '../../components/ui/Badge';

const CreditAuth = () => {
    const [creditedStudents, setCreditedStudents] = useState<ClosureRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCreditedStudents();
    }, []);

    const loadCreditedStudents = async () => {
        try {
            const data = await ClosureService.getAll();
            // Filter only students who have received credits
            const credited = data.filter(closure => closure.status === 'CLOSED' && closure.credits);
            setCreditedStudents(credited);
        } catch (error) {
            console.error('Error loading credited students:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center p-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0F2137]"></div>
        </div>
    );

    return (
        <div className="animate-in fade-in duration-500">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-[#0F2137]">Credit Authorization</h1>
                <p className="text-slate-500 text-sm font-medium mt-1">
                    View all students who have been awarded academic credits for their internships.
                </p>
            </div>

            {creditedStudents.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
                    <Award className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-slate-600 font-bold">No Credits Awarded Yet</h3>
                    <p className="text-slate-400 text-sm">Students who receive credits will appear here.</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Student</th>
                                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Internship</th>
                                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Company</th>
                                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Duration</th>
                                    <th className="text-center px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Credits</th>
                                    <th className="text-center px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {creditedStudents.map((student) => (
                                    <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-bold text-sm text-[#0F2137]">{student.studentName}</p>
                                                <p className="text-xs text-slate-500 font-medium">{student.studentRegNo}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Briefcase size={14} className="text-blue-600" />
                                                <span className="text-sm font-medium text-slate-700">{student.internshipTitle}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <User size={14} className="text-slate-400" />
                                                <span className="text-sm text-slate-600">{student.companyName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} className="text-slate-400" />
                                                <span className="text-sm text-slate-600">{student.duration}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full">
                                                <Award size={14} />
                                                <span className="font-bold text-sm">{student.credits}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Badge variant="success">
                                                <CheckCircle size={12} className="mr-1" />
                                                CREDITED
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Summary Footer */}
                    <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex justify-between items-center">
                        <p className="text-sm font-medium text-slate-600">
                            Total Students: <span className="font-bold text-[#0F2137]">{creditedStudents.length}</span>
                        </p>
                        <p className="text-sm font-medium text-slate-600">
                            Total Credits Awarded: <span className="font-bold text-emerald-600">
                                {creditedStudents.reduce((sum, s) => sum + (s.credits || 0), 0)}
                            </span>
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreditAuth;
