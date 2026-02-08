import { useState, useEffect } from 'react';
import {
    Award, TrendingUp,
    Download, ShieldCheck, MapPin,
    Calendar, Star, FileText, QrCode,
    Clock
} from 'lucide-react';
import Badge from '../../components/ui/Badge';
import { InternshipService } from '../../services/internship.service';
import type { InternshipCompletion, Internship } from '../../types';

const InternshipCompletionStatus = () => {
    const [completionData, setCompletionData] = useState<InternshipCompletion | null>(null);
    const [internship, setInternship] = useState<Internship | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchCompletionData();
    }, []);

    const fetchCompletionData = async () => {
        setIsLoading(true);
        try {
            // Mock fetching data for the active internship
            const data = await InternshipService.getCompletionStatus('test-internship-id');
            const intern = await InternshipService.getById(data.internshipId);
            setCompletionData(data);
            setInternship(intern);
        } catch (error) {
            console.error('Failed to fetch completion data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <div className="h-96 bg-slate-50 rounded-[3rem] animate-pulse" />;

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-[#0F172A] tracking-tighter italic">Milestone Tracking</h1>
                    <p className="text-slate-400 font-bold mt-1 uppercase text-xs tracking-[0.2em] opacity-60">Final evaluation and certification portal</p>
                </div>
                {completionData?.status === 'COMPLETED' && (
                    <button className="bg-emerald-600 text-white font-black text-xs uppercase tracking-widest px-8 py-4 rounded-2xl shadow-xl shadow-emerald-500/20 hover:bg-emerald-700 transition-all active:scale-95 flex items-center gap-2">
                        <Download size={18} /> Download Certificate
                    </button>
                )}
            </div>

            {/* Achievement Board */}
            <div className="bg-[#0F172A] p-10 rounded-[3rem] shadow-2xl text-white relative overflow-hidden group">
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 rounded-full border border-blue-500/30 mb-6">
                            <ShieldCheck size={16} className="text-blue-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-blue-300">Verified Placement</span>
                        </div>
                        <h2 className="text-5xl font-black tracking-tighter mb-4 italic leading-none">
                            {internship?.title || 'Senior Software Engineer'}
                        </h2>
                        <div className="flex items-center gap-4 text-slate-400 font-bold uppercase text-xs tracking-widest">
                            <span className="flex items-center gap-1.5"><MapPin size={14} /> {internship?.company_name}</span>
                            <span className="flex items-center gap-1.5"><Calendar size={14} /> Summer 2025</span>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <div className="text-center p-8 bg-white/5 rounded-[2rem] border border-white/10 backdrop-blur-sm">
                            <p className="text-5xl font-black text-blue-500 mb-1">{completionData?.attendancePercentage}%</p>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Attendance Score</p>
                        </div>
                    </div>
                </div>
                <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-blue-600/10 to-transparent -z-0"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Progress Metrics */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-10">
                        <div>
                            <div className="flex justify-between items-end mb-4">
                                <h3 className="text-xl font-black text-[#0F172A] tracking-tight">Technical Proficiency</h3>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <Star key={s} size={16} fill={s <= (completionData?.guideRating || 0) ? '#2563EB' : 'none'} className={s <= (completionData?.guideRating || 0) ? 'text-blue-600' : 'text-slate-200'} />
                                    ))}
                                </div>
                            </div>
                            <div className="h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                                <div className="h-full bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.4)]" style={{ width: `${(completionData?.guideRating || 0) * 20}%` }}></div>
                            </div>
                            <p className="mt-4 text-slate-400 text-xs font-medium leading-relaxed">Evaluation based on guide remarks, project complexity, and adherence to professional standards during the internship tenure.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-50">
                            <div>
                                <p className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4">Reporting History</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                                        <TrendingUp size={24} />
                                    </div>
                                    <div>
                                        <p className="text-lg font-black text-[#0F172A]">{completionData?.totalLogsSubmitted}</p>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Verified Logs</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4">Current Status</p>
                                <Badge variant={completionData?.status === 'COMPLETED' ? 'success' : 'warning'} className="h-10 px-4 text-xs">
                                    {completionData?.status.replace('_', ' ')}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Final Tasks / Report */}
                    <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-white">
                                <FileText size={28} />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-[#0F172A] tracking-tight">Final Internship Report</h3>
                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Required for graduation credits</p>
                            </div>
                        </div>
                        <button className="px-6 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-blue-600 hover:bg-blue-50 transition-all">
                            Review Upload
                        </button>
                    </div>
                </div>

                {/* Right: Digital Certificate Preview */}
                <div className="space-y-8">
                    <div className="bg-white border-2 border-slate-100 rounded-[3rem] p-8 shadow-xl relative overflow-hidden flex flex-col items-center">
                        <div className="w-full aspect-[1/1.414] bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 mb-8 flex flex-col items-center justify-center p-8 text-center">
                            {completionData?.status === 'COMPLETED' ? (
                                <>
                                    <Award size={64} className="text-blue-600 mb-4" />
                                    <h4 className="text-lg font-black text-slate-900 leading-tight mb-2">Completion Certificate</h4>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-6">Credential ID: CU-IMS-2025-001</p>
                                    <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100 mb-6">
                                        <QrCode size={80} className="text-slate-900" />
                                    </div>
                                    <p className="text-[8px] text-slate-300 font-medium uppercase tracking-[0.2em]">Verified by Christ University</p>
                                </>
                            ) : (
                                <>
                                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-4">
                                        <Clock size={32} />
                                    </div>
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Locked</p>
                                    <p className="text-[10px] text-slate-300 font-bold mt-2">Complete all logs to unlock</p>
                                </>
                            )}
                        </div>
                        <button
                            disabled={completionData?.status !== 'COMPLETED'}
                            className="w-full py-4 bg-[#0F2137] text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-900/10 hover:bg-[#1E3A5F] transition-all disabled:grayscale disabled:opacity-50">
                            Download Digital Copy
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InternshipCompletionStatus;
