import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
    Calendar, CheckCircle2, Clock,
    Plus, ChevronRight,
    PenTool, MessageSquare,
    Save, Send, X, Trash2,
    FileText, UploadCloud
} from 'lucide-react';
import Badge from '../../components/ui/Badge';
import { InternshipService } from '../../services/internship.service';
import { ReportService } from '../../services/report.service';
import type { WeeklyLog, WeeklyReportCreate, StudentApplication } from '../../types';

const WeeklyLogModule = () => {
    const [logs, setLogs] = useState<WeeklyLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddingLog, setIsAddingLog] = useState(false);
    const [selectedLog, setSelectedLog] = useState<WeeklyLog | null>(null);

    // Finish Internship State
    const [isFinishing, setIsFinishing] = useState(false);
    const [completionFile, setCompletionFile] = useState<File | null>(null);
    const [isSubmittingFinish, setIsSubmittingFinish] = useState(false);

    // New Log Form State
    const [newLog, setNewLog] = useState<{
        title: string;
        description: string;
        achievements: string;
        challenges: string;
        plans: string;
        week_number: number;
        hoursWorked: number; // For UI only, maybe append to description?
    }>({
        title: '',
        description: '',
        achievements: '',
        challenges: '',
        plans: '',
        week_number: 1,
        hoursWorked: 40
    });

    const [eligibility, setEligibility] = useState({ isEligible: false, message: '' });
    const [activeApplication, setActiveApplication] = useState<StudentApplication | null>(null);
    const { user } = useAuth();


    useEffect(() => {
        checkEligibilityAndFetchLogs();
    }, []);

    const checkEligibilityAndFetchLogs = async () => {
        setIsLoading(true);
        try {
            // 1. Check Eligibility
            const applications = await InternshipService.getStudentApplications();
            // Check for ACTIVE or COMPLETED (if they want to see past logs)
            const finalActiveApp = applications.find(app => ['ACTIVE', 'OFFER_ACCEPTED'].includes(app.status));

            if (!finalActiveApp) {
                setEligibility({
                    isEligible: false,
                    message: 'You can only start logging weekly journals once your internship is officially approved and active.'
                });
                setIsLoading(false);
                return;
            }

            setActiveApplication(finalActiveApp);

            // eligible if guide assigned? 
            // API doesn't strictly block reading reports if no guide, but maybe submission.
            // For now, let's allow viewing.

            setEligibility({ isEligible: true, message: '' });

            // 2. Fetch Logs via ReportService
            const reports = await ReportService.getMyReports();

            // Map WeeklyReport to WeeklyLog (UI Interface)
            const mappedLogs: WeeklyLog[] = reports.map(report => ({
                id: report.id,
                weekNumber: report.week_number || 0,
                startDate: report.submitted_at, // Use submitted_at as proxy for date
                endDate: report.submitted_at,
                workSummary: report.description,
                skillsLearned: report.achievements || '', // Map achievements to skills/technicals
                achievements: report.achievements || '',
                challengesFaced: report.challenges || '',
                nextWeekPlan: report.plans || '',
                hoursWorked: 0, // Not in API
                status: 'SUBMITTED', // Default status as API doesn't return status yet
                submissionDate: report.submitted_at,
                title: report.title
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any));

            // Set next week number
            const maxWeek = mappedLogs.reduce((max, log) => Math.max(max, log.weekNumber), 0);
            setNewLog(prev => ({ ...prev, week_number: maxWeek + 1 }));

            setLogs(mappedLogs);

        } catch (error) {
            console.error('Failed to init logs module:', error);
            setEligibility({ isEligible: false, message: 'Failed to verify eligibility. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveDraft = async () => {
        // Mock save draft - API is direct submit usually
        alert("Draft saving not supported by API yet. Please submit when ready.");
    };

    const handleSubmit = async () => {
        if (!newLog.title || !newLog.description) {
            alert("Title and Work Summary are required.");
            return;
        }

        try {
            const reportData: WeeklyReportCreate = {
                title: newLog.title,
                description: newLog.description, // Maybe append hours? `[${newLog.hoursWorked} Hours] ${newLog.description}`
                week_number: newLog.week_number,
                achievements: newLog.achievements,
                challenges: newLog.challenges,
                plans: newLog.plans,
                internship_id: activeApplication?.internship_id
            };

            await ReportService.submitReport(reportData);

            // Refresh
            await checkEligibilityAndFetchLogs();
            setIsAddingLog(false);

            // Reset form
            setNewLog({
                title: '',
                description: '',
                achievements: '',
                challenges: '',
                plans: '',
                week_number: logs.length + 2, // approximation
                hoursWorked: 40
            });

        } catch (error) {
            console.error('Submit failed:', error);
            alert("Failed to submit report. Please try again.");
        }
    };

    const handleFinishInternship = async () => {
        if (!completionFile || !activeApplication) return;

        setIsSubmittingFinish(true);
        try {
            await InternshipService.completeInternship(activeApplication.id, completionFile);
            alert("Internship completion requested successfully!");
            setIsFinishing(false);
            // Optionally refresh app status
        } catch (error) {
            console.error("Failed to finish internship:", error);
            alert("Failed to submit completion request.");
        } finally {
            setIsSubmittingFinish(false);
        }
    };

    const getStatusVariant = (status: string): any => {
        switch (status) {
            case 'APPROVED': return 'success';
            case 'SUBMITTED': return 'info';
            case 'REJECTED': return 'error';
            default: return 'neutral';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-[#0F172A] tracking-tighter italic">Weekly Journals</h1>
                    <p className="text-slate-400 font-bold mt-1 uppercase text-xs tracking-[0.2em] opacity-60">Log your progress and track performance</p>
                </div>
                <div className="flex gap-4">
                    {activeApplication && (
                        <button
                            onClick={() => setIsFinishing(true)}
                            className="bg-emerald-600 text-white font-black text-xs uppercase tracking-widest px-6 py-4 rounded-2xl shadow-xl shadow-emerald-900/10 hover:bg-emerald-700 transition-all active:scale-95 flex items-center gap-2">
                            <CheckCircle2 size={18} /> Finish Internship
                        </button>
                    )}
                    {eligibility.isEligible && (
                        <button
                            onClick={() => setIsAddingLog(true)}
                            className="bg-[#0F172A] text-white font-black text-xs uppercase tracking-widest px-8 py-4 rounded-2xl shadow-xl shadow-blue-900/10 hover:bg-slate-800 transition-all active:scale-95 flex items-center gap-2">
                            <Plus size={18} /> New Weekly Entry
                        </button>
                    )}
                </div>
            </div>

            {/* Eligibility Blockers */}
            {!isLoading && !eligibility.isEligible && (
                <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-xl flex items-start gap-4 animate-in slide-in-from-top-2">
                    <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                        <CheckCircle2 size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-amber-800">Access Restricted</h3>
                        <p className="text-amber-700 font-medium mt-1">{eligibility.message}</p>
                    </div>
                </div>
            )}

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                        <Calendar size={28} />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-[#0F172A]">{logs.length}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Weeks Logged</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
                    <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                        <CheckCircle2 size={28} />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-[#0F172A]">{logs.filter(l => l.status === 'APPROVED').length}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Approved Logs</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
                    <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
                        <Clock size={28} />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-[#0F172A]">{logs.filter(l => l.status === 'SUBMITTED').length}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending Review</p>
                    </div>
                </div>
            </div>

            {/* Logs List */}
            <div className="space-y-4">
                {isLoading ? (
                    Array(3).fill(0).map((_, i) => (
                        <div key={i} className="h-32 bg-slate-100 rounded-[2rem] animate-pulse" />
                    ))
                ) : logs.length > 0 ? (
                    logs.map((log) => (
                        <div key={log.id}
                            onClick={() => setSelectedLog(log)}
                            className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all cursor-pointer group flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 rounded-[1.5rem] flex flex-col items-center justify-center transition-colors">
                                    <span className="text-[10px] font-black uppercase tracking-tighter">Week</span>
                                    <span className="text-xl font-black leading-none">{log.weekNumber}</span>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-lg font-black text-[#0F172A] tracking-tight truncate max-w-[200px] md:max-w-md">
                                        {/* @ts-ignore - title exists on mapped log */}
                                        {log.title || 'Untitled Report'}
                                    </h3>
                                    <p className="text-sm text-slate-500 truncate max-w-md">{log.workSummary}</p>
                                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        <span className="flex items-center gap-1.5"><Calendar size={12} /> {new Date(log.submissionDate || '').toLocaleDateString('en-GB')}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 shrink-0">
                                <Badge variant={getStatusVariant(log.status)}>
                                    {log.status}
                                </Badge>
                                <div className="p-3 bg-slate-50 text-slate-300 rounded-xl group-hover:text-blue-600 group-hover:bg-blue-50 transition-all">
                                    <ChevronRight size={20} />
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
                            <PenTool size={40} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-300 italic uppercase">Journal is empty</h3>
                        <p className="text-slate-400 max-w-xs mt-2 font-bold opacity-60">Start your first weekly entry to document your internship journey.</p>
                        {eligibility.isEligible && (
                            <button onClick={() => setIsAddingLog(true)} className="mt-8 text-blue-600 font-black uppercase text-xs hover:underline decoration-2 underline-offset-4 tracking-widest">Create Entry Now</button>
                        )}
                    </div>
                )}
            </div>

            {/* Add Log Modal */}
            {isAddingLog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
                        <div className="p-10 flex-1 overflow-y-auto custom-scrollbar">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h2 className="text-3xl font-black text-[#0F172A] tracking-tighter">Weekly Journal</h2>
                                    <p className="text-blue-600 font-black uppercase text-[10px] tracking-widest mt-1">Week {newLog.week_number} • Submission Period</p>
                                </div>
                                <button onClick={() => setIsAddingLog(false)} className="p-3 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-full transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Report Title</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Week 1 - Project Setup & Onboarding"
                                        className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 transition-all"
                                        value={newLog.title}
                                        onChange={(e) => setNewLog({ ...newLog, title: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Hours Logged</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 transition-all"
                                                value={newLog.hoursWorked}
                                                onChange={(e) => setNewLog({ ...newLog, hoursWorked: parseInt(e.target.value) })}
                                            />
                                            <Clock className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Week Number</label>
                                        <input
                                            type="number"
                                            className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 transition-all"
                                            value={newLog.week_number}
                                            onChange={(e) => setNewLog({ ...newLog, week_number: parseInt(e.target.value) })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Work Accomplished (Description)</label>
                                    <textarea
                                        rows={4}
                                        placeholder="Detailed summary of tasks, modules built, or meetings attended..."
                                        className="w-full bg-slate-50 border border-slate-100 rounded-3xl p-6 font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 transition-all resize-none"
                                        value={newLog.description}
                                        onChange={(e) => setNewLog({ ...newLog, description: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Key Achievements</label>
                                    <textarea
                                        rows={2}
                                        placeholder="What did you achieve this week?"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-3xl p-6 font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 transition-all resize-none"
                                        value={newLog.achievements}
                                        onChange={(e) => setNewLog({ ...newLog, achievements: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Challenges Faced</label>
                                    <textarea
                                        rows={2}
                                        placeholder="Any technical or systemic issues you faced..."
                                        className="w-full bg-slate-50 border border-slate-100 rounded-3xl p-6 font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 transition-all resize-none"
                                        value={newLog.challenges}
                                        onChange={(e) => setNewLog({ ...newLog, challenges: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Plans for Next Week</label>
                                    <textarea
                                        rows={2}
                                        placeholder="What are you planning to do next?"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-3xl p-6 font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 transition-all resize-none"
                                        value={newLog.plans}
                                        onChange={(e) => setNewLog({ ...newLog, plans: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-10 pt-0 bg-white border-t border-slate-50 flex gap-4">
                            <button
                                onClick={handleSaveDraft}
                                className="flex-grow py-5 bg-slate-100 text-slate-600 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-all active:scale-95 flex items-center justify-center gap-2">
                                <Save size={18} /> Save Draft
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="flex-grow py-5 bg-[#0F2137] text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-900/10 hover:bg-emerald-600 transition-all active:scale-95 flex items-center justify-center gap-2">
                                <Send size={18} /> Submit for Review
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Finish Internship Modal */}
            {isFinishing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-10">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-black text-[#0F172A] tracking-tighter">Finish Internship</h2>
                                <button onClick={() => setIsFinishing(false)} className="p-3 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-full transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <p className="text-slate-600 font-medium">
                                    To mark your internship as completed, please upload your <strong>Completion Letter</strong> or Certificate provided by the company.
                                </p>

                                <div className="border-2 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center bg-slate-50 hover:bg-white hover:border-blue-400 transition-all cursor-pointer relative">
                                    <input
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={(e) => setCompletionFile(e.target.files?.[0] || null)}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                                        <UploadCloud size={32} />
                                    </div>
                                    <p className="text-slate-900 font-bold text-sm">
                                        {completionFile ? completionFile.name : "Click to Upload File"}
                                    </p>
                                    <p className="text-slate-400 text-xs mt-1 uppercase tracking-wider font-bold">PDF, JPG, PNG (Max 5MB)</p>
                                </div>

                                <button
                                    onClick={handleFinishInternship}
                                    disabled={!completionFile || isSubmittingFinish}
                                    className="w-full py-5 bg-[#0F2137] text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-900/10 hover:bg-emerald-600 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                    {isSubmittingFinish ? 'Submitting...' : 'Submit Completion'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Log Detail Modal */}
            {selectedLog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-10">
                            <div className="flex justify-between items-start mb-10">
                                <div className="flex gap-6">
                                    <div className="w-20 h-20 bg-blue-600 text-white rounded-[2rem] flex flex-col items-center justify-center shadow-xl shadow-blue-500/20">
                                        <span className="text-[10px] font-black uppercase tracking-tighter opacity-60">Week</span>
                                        <span className="text-3xl font-black leading-none">{selectedLog.weekNumber}</span>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-[#0F172A] tracking-tighter">{/* @ts-ignore */ selectedLog.title || 'Weekly Report'}</h2>
                                        <Badge variant={getStatusVariant(selectedLog.status)} className="mt-1">
                                            {selectedLog.status}
                                        </Badge>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedLog(null)} className="p-3 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-full transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-8 max-h-[50vh] overflow-y-auto pr-4 custom-scrollbar">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Achievements</p>
                                        <p className="text-slate-900 font-bold bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">{selectedLog.achievements || '-'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Plans</p>
                                        <p className="text-slate-900 font-bold bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">{selectedLog.nextWeekPlan || '-'}</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Work Summary</p>
                                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                        <p className="text-slate-600 font-medium leading-relaxed">{selectedLog.workSummary}</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Challenges</p>
                                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                        <p className="text-slate-600 font-medium leading-relaxed">{selectedLog.challengesFaced || '-'}</p>
                                    </div>
                                </div>

                                {selectedLog.guideComments && (
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
                                            <MessageSquare size={14} /> Guide Feedback
                                        </p>
                                        <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100">
                                            <p className="text-blue-900 font-bold italic">"{selectedLog.guideComments}"</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WeeklyLogModule;
