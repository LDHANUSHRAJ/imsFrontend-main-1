import { useState, useEffect } from 'react';
import {
    Calendar, CheckCircle2, Clock,
    Plus, ChevronRight,
    PenTool, MessageSquare,
    Save, Send, X, Trash2
} from 'lucide-react';
import Badge from '../../components/ui/Badge';
import { InternshipService } from '../../services/internship.service';
import type { WeeklyLog } from '../../types';

const WeeklyLogModule = () => {
    const [logs, setLogs] = useState<WeeklyLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddingLog, setIsAddingLog] = useState(false);
    const [selectedLog, setSelectedLog] = useState<WeeklyLog | null>(null);
    const [newLog, setNewLog] = useState<Partial<WeeklyLog>>({
        workSummary: '',
        skillsLearned: '',
        challengesFaced: '',
        hoursWorked: 40,
        weekNumber: 1
    });

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        setIsLoading(true);
        try {
            // In a real app, this would be filtered by the active internship session ID
            const data = await InternshipService.getWeeklyLogs('current-session-id');
            setLogs(data);
        } catch (error) {
            console.error('Failed to fetch logs:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveDraft = async () => {
        try {
            // Mock logic
            const log: WeeklyLog = {
                id: Math.random().toString(36).substr(2, 9),
                status: 'DRAFT',
                submissionDate: new Date().toISOString(),
                startDate: new Date().toISOString(),
                endDate: new Date().toISOString(),
                ...(newLog as any)
            };
            setLogs([log, ...logs]);
            setIsAddingLog(false);
            setNewLog({ workSummary: '', skillsLearned: '', challengesFaced: '', hoursWorked: 40, weekNumber: logs.length + 1 });
        } catch (error) {
            console.error('Save failed:', error);
        }
    };

    const handleSubmit = async () => {
        try {
            // Mock logic
            const log: WeeklyLog = {
                id: Math.random().toString(36).substr(2, 9),
                status: 'SUBMITTED',
                submissionDate: new Date().toISOString(),
                startDate: new Date().toISOString(),
                endDate: new Date().toISOString(),
                ...(newLog as any)
            };
            setLogs([log, ...logs]);
            setIsAddingLog(false);
            setNewLog({ workSummary: '', skillsLearned: '', challengesFaced: '', hoursWorked: 40, weekNumber: logs.length + 1 });
        } catch (error) {
            console.error('Submit failed:', error);
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
                <button
                    onClick={() => setIsAddingLog(true)}
                    className="bg-[#0F172A] text-white font-black text-xs uppercase tracking-widest px-8 py-4 rounded-2xl shadow-xl shadow-blue-900/10 hover:bg-slate-800 transition-all active:scale-95 flex items-center gap-2">
                    <Plus size={18} /> New Weekly Entry
                </button>
            </div>

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
                                        {log.workSummary.substring(0, 60)}...
                                    </h3>
                                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        <span className="flex items-center gap-1.5"><Clock size={12} /> {log.hoursWorked} Hours</span>
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
                        <button onClick={() => setIsAddingLog(true)} className="mt-8 text-blue-600 font-black uppercase text-xs hover:underline decoration-2 underline-offset-4 tracking-widest">Create Entry Now</button>
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
                                    <p className="text-blue-600 font-black uppercase text-[10px] tracking-widest mt-1">Week {logs.length + 1} • Submission Period</p>
                                </div>
                                <button onClick={() => setIsAddingLog(false)} className="p-3 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-full transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-8">
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
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Primary Skill</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. React, UX Research"
                                            className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 transition-all"
                                            value={newLog.skillsLearned}
                                            onChange={(e) => setNewLog({ ...newLog, skillsLearned: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Work Accomplished</label>
                                    <textarea
                                        rows={4}
                                        placeholder="Detailed summary of tasks, modules built, or meetings attended..."
                                        className="w-full bg-slate-50 border border-slate-100 rounded-3xl p-6 font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 transition-all resize-none"
                                        value={newLog.workSummary}
                                        onChange={(e) => setNewLog({ ...newLog, workSummary: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Blockers / Challenges</label>
                                    <textarea
                                        rows={2}
                                        placeholder="Any technical or systemic issues you faced..."
                                        className="w-full bg-slate-50 border border-slate-100 rounded-3xl p-6 font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 transition-all resize-none"
                                        value={newLog.challengesFaced}
                                        onChange={(e) => setNewLog({ ...newLog, challengesFaced: e.target.value })}
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
                                        <h2 className="text-2xl font-black text-[#0F172A] tracking-tighter">Review Entry</h2>
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
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Technicals</p>
                                        <p className="text-slate-900 font-bold bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">{selectedLog.skillsLearned}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Effort</p>
                                        <p className="text-slate-900 font-bold bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">{selectedLog.hoursWorked} Hours</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Work Summary</p>
                                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                        <p className="text-slate-600 font-medium leading-relaxed">{selectedLog.workSummary}</p>
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

                            {selectedLog.status === 'DRAFT' && (
                                <div className="mt-10 pt-8 border-t border-slate-50 flex gap-4">
                                    <button className="flex-grow py-5 bg-[#0F2137] text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-900/10 hover:bg-[#1E3A5F] transition-all flex items-center justify-center gap-2">
                                        <Send size={18} /> Submit Version
                                    </button>
                                    <button className="p-5 bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition-all">
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WeeklyLogModule;
