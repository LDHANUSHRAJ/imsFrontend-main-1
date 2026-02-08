import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Building, Calendar, Mail, CheckCircle, AlertCircle, Clock, Award } from 'lucide-react';
import { GuideService } from '../../services/guide.service';
import type { StudentProfileExtended, WeeklyLog, GuideFeedback } from '../../types';
import StudentLogsList from './StudentLogsPage'; // Reusing the list component
import FeedbackForm from './FeedbackForm';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

export default function StudentDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [student, setStudent] = useState<StudentProfileExtended | null>(null);
    const [logs, setLogs] = useState<WeeklyLog[]>([]);
    const [activeTab, setActiveTab] = useState<'logs' | 'evaluation'>('logs');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (id) {
            loadData(id);
        }
    }, [id]);

    const loadData = async (studentId: string) => {
        setIsLoading(true);
        try {
            const [profile, logData] = await Promise.all([
                GuideService.getStudentProfile(studentId),
                GuideService.getStudentLogs(studentId)
            ]);
            setStudent(profile);
            setLogs(logData);
        } catch (error) {
            console.error("Failed to load student details", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogStatusUpdate = async (logId: string, status: 'APPROVED' | 'REJECTED', comment: string) => {
        if (!student) return;
        await GuideService.updateLogStatus(student.id, logId, status, comment);
        // Refresh logs locally
        setLogs(current => current.map(log =>
            log.id === logId ? { ...log, status, guideComments: comment } : log
        ));
    };

    const handleLogUpdate = async (logId: string, data: Partial<WeeklyLog>) => {
        if (!student) return;
        await GuideService.updateLog(student.id, logId, data);
        setLogs(current => current.map(log =>
            log.id === logId ? { ...log, ...data } : log
        ));
    };

    const handleLogDelete = async (logId: string) => {
        if (!student) return;
        if (!confirm("Are you sure you want to delete this log?")) return;
        await GuideService.deleteLog(student.id, logId);
        setLogs(current => current.filter(log => log.id !== logId));
    };

    const handleFeedbackSubmit = async (feedback: GuideFeedback) => {
        if (!student) return;
        await GuideService.submitFeedback(student.id, feedback);
        alert("Feedback submitted successfully.");
        // Could update status here
    };

    const handleInternshipApproval = async (approved: boolean) => {
        if (!student) return;
        const status = approved ? 'COMPLETED' : 'REJECTED';
        const reason = approved ? undefined : (prompt("Please provide a reason for rejection:") || undefined);
        if (!approved && !reason) return; // Cancelled

        await GuideService.updateInternshipStatus(student.id, status, reason);
        setStudent(prev => prev ? { ...prev, status } : null);
        alert(`Internship marked as ${status}`);
    };

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Loading student details...</div>;
    }

    if (!student) {
        return <div className="p-8 text-center text-red-500">Student not found.</div>;
    }

    const completedLogs = logs.filter(l => l.status === 'APPROVED').length;
    const progress = Math.min(100, Math.round((completedLogs / 14) * 100)); // Assuming 14 weeks approx

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header & Back */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-slate-500 hover:text-[#0F2137] transition-colors"
                >
                    <ArrowLeft size={20} /> Back to Dashboard
                </button>
                <div className="flex gap-2">
                    {student.status === 'CLOSURE_SUBMITTED' && (
                        <Badge variant="warning">Action Required: Final Review</Badge>
                    )}
                    <Badge variant={(student.status || '') === 'IN_PROGRESS' ? 'info' : 'success'}>{student.status || ''}</Badge>
                </div>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 bg-[#0F2540] text-[#D4AF37] rounded-full flex items-center justify-center text-2xl font-bold border-4 border-slate-100">
                            {student.studentName.charAt(0)}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-[#0F2137]">{student.studentName}</h1>
                            <div className="flex flex-wrap gap-4 text-sm text-slate-500 mt-1">
                                <span className="flex items-center gap-1"><User size={14} /> {student.studentRegNo}</span>
                                <span className="flex items-center gap-1"><Building size={14} /> {student.department}</span>
                                <span className="flex items-center gap-1"><Mail size={14} /> {student.email}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 min-w-[200px]">
                        <div className="flex items-center justify-between text-sm font-medium mb-1">
                            <span className="text-slate-600">Internship Progress</span>
                            <span className="text-[#0F2540]">{progress}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                        </div>
                        <div className="flex justify-between text-xs text-slate-400 mt-1">
                            <span>{completedLogs} Logs Approved</span>
                            <span>Target: 14 Weeks</span>
                        </div>
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Company</span>
                        <div className="flex items-center gap-2 font-semibold text-[#0F2137]">
                            <Building size={18} className="text-blue-500" /> {student.companyName}
                        </div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Role</span>
                        <div className="flex items-center gap-2 font-semibold text-[#0F2137]">
                            <Award size={18} className="text-amber-500" /> {student.internshipTitle}
                        </div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Duration</span>
                        <div className="flex items-center gap-2 font-semibold text-[#0F2137]">
                            <Calendar size={18} className="text-emerald-500" /> {student.startDate} - {student.endDate}
                        </div>
                    </div>
                </div>
            </div>

            {/* Workflow Tracker (Simple Stepper) */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 overflow-x-auto">
                <div className="flex items-center min-w-[600px] justify-between px-4">
                    {[
                        { label: 'Assigned', active: true, done: true },
                        { label: 'Start Internship', active: true, done: true },
                        { label: 'Weekly Logs', active: true, done: logs.length > 0 },
                        { label: 'Final Report', active: student.status === 'CLOSURE_SUBMITTED' || student.status === 'COMPLETED', done: student.status === 'COMPLETED' },
                        { label: 'Evaluation', active: student.status === 'COMPLETED', done: student.status === 'COMPLETED' }
                    ].map((step, idx, arr) => (
                        <div key={idx} className="flex items-center flex-1 last:flex-none">
                            <div className={`flex flex-col items-center gap-2 relative z-10`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors
                                   ${step.done ? 'bg-green-500 text-white' : step.active ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-400'}
                               `}>
                                    {step.done ? <CheckCircle size={16} /> : idx + 1}
                                </div>
                                <span className={`text-xs font-bold whitespace-nowrap ${step.active ? 'text-[#0F2137]' : 'text-slate-400'}`}>{step.label}</span>
                            </div>
                            {idx < arr.length - 1 && (
                                <div className={`h-1 flex-1 mx-2 rounded -mt-6
                                   ${step.done ? 'bg-green-500' : 'bg-slate-200'}
                               `}></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-slate-200">
                <button
                    onClick={() => setActiveTab('logs')}
                    className={`pb-3 px-2 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'logs' ? 'border-[#0F2540] text-[#0F2540]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    <Clock size={16} /> Weekly Logs
                </button>
                <button
                    onClick={() => setActiveTab('evaluation')}
                    className={`pb-3 px-2 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'evaluation' ? 'border-[#0F2540] text-[#0F2540]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    <Award size={16} /> Evaluation & Closure
                </button>
            </div>

            {/* Content Content */}
            <div className="min-h-[400px]">
                {activeTab === 'logs' ? (
                    <StudentLogsList
                        logs={logs}
                        onUpdateStatus={handleLogStatusUpdate}
                        onUpdateContent={handleLogUpdate}
                        onDeleteLog={handleLogDelete}
                    />
                ) : (
                    <div className="space-y-6">
                        {student.status !== 'CLOSURE_SUBMITTED' && student.status !== 'COMPLETED' ? (
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
                                <AlertCircle className="mx-auto h-12 w-12 text-amber-500 mb-2" />
                                <h3 className="text-lg font-bold text-amber-900">Evaluation Not Available Yet</h3>
                                <p className="text-amber-700 mt-1">
                                    The student must complete their internship and submit the Final Report before evaluation can begin.
                                    Current status: <strong>{student.status}</strong>
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-white p-6 rounded-xl border border-slate-200">
                                        <h3 className="font-bold text-[#0F2137] mb-4">Final Report</h3>
                                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 mb-4">
                                            <div className="flex items-center gap-3">
                                                <FileText className="text-red-500" size={24} />
                                                <div>
                                                    <p className="text-sm font-bold text-slate-700">Internship_Final_Report.pdf</p>
                                                    <p className="text-xs text-slate-400">2.4 MB • Submitted 2 days ago</p>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="sm">Download</Button>
                                        </div>
                                        <p className="text-sm text-slate-600 mb-4">
                                            Please review the final report thoroughly before providing your evaluation.
                                        </p>

                                        <div className="pt-4 border-t border-slate-100 flex gap-3">
                                            <Button
                                                className="bg-green-600 hover:bg-green-700 text-white flex-1"
                                                onClick={() => handleInternshipApproval(true)}
                                            >
                                                Approve Completion
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="text-red-600 border-red-200 hover:bg-red-50 flex-1"
                                                onClick={() => handleInternshipApproval(false)}
                                            >
                                                Reject & Return
                                            </Button>
                                        </div>
                                    </div>

                                    <FeedbackForm onSubmit={handleFeedbackSubmit} isReadOnly={student.status === 'COMPLETED'} />
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

// Helper icon component for missing imports if any
function FileText({ className, size }: { className?: string, size?: number }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <line x1="10" y1="9" x2="8" y2="9" />
        </svg>
    )
}
