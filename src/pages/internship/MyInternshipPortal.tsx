import { useState } from 'react';
import {
    FileText, Eye, Star, AlertCircle,
    Download, Plus, CheckCircle2, X, Upload, Calendar
} from 'lucide-react';
import Badge from '../../components/ui/Badge';

const MyInternshipPortal = () => {
    const [activeTab, setActiveTab] = useState<'Current' | 'Logs' | 'Closure'>('Current');
    const [showLogModal, setShowLogModal] = useState(false);
    const [logType, setLogType] = useState<'Weekly Report' | 'Weekly Log'>('Weekly Report');

    const internshipDetails = {
        company: 'Inventeron Technologies',
        role: 'Full Stack Web Developer',
        mentor: 'Sarah Wilson',
        mentorEmail: 'sarah.w@inventeron.com',
        guide: 'Dr. Sarah Johnson',
        guideEmail: 'sarah.j@christ.edu',
        type: 'External',
        status: 'Active',
        startDate: '2024-01-15',
        endDate: '2024-04-15',
        duration: '3 Months',
        location: 'Bengaluru, Karnataka'
    };

    const logs = [
        {
            week: 1,
            dates: 'Jan 13 - Jan 17',
            report: 'week1_report.pdf',
            size: '245 KB',
            status: 'Reviewed',
            feedback: 'Good progress. Focus on error handling in the next sprint.',
            rating: 4.5
        },
        {
            week: 2,
            dates: 'Jan 20 - Jan 24',
            status: 'Pending',
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#0F172A]">My Internship</h1>
                    <p className="text-slate-500 font-medium mt-1">Track your internship progress and submit logs</p>
                </div>
                <button className="bg-[#0F172A] hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-xl transition-all flex items-center gap-2 shadow-sm active:scale-95">
                    <Download size={20} /> Download Complete Report
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-8 border-b border-slate-200">
                {['Current Internship', 'Logs', 'Closure'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab.split(' ')[0] as any)}
                        className={`pb-4 px-2 text-sm font-bold transition-all relative ${activeTab === tab.split(' ')[0]
                            ? 'text-blue-600'
                            : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        {tab}
                        {activeTab === tab.split(' ')[0] && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full shadow-[0_-2px_6px_rgba(37,99,235,0.4)]" />
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="mt-8">
                {activeTab === 'Current' && (
                    <div className="bg-white rounded-[32px] p-10 border border-slate-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50 group-hover:opacity-100 transition-opacity"></div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-8">
                                <FileText className="text-blue-600" size={28} />
                                <h2 className="text-2xl font-black text-[#0F172A]">Internship Details</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                                <DetailItem label="COMPANY" value={internshipDetails.company} emphasis />
                                <DetailItem label="ROLE" value={internshipDetails.role} emphasis />
                                <DetailItem label="MENTOR" value={internshipDetails.mentor} subValue={internshipDetails.mentorEmail} />
                                <DetailItem label="GUIDE" value={internshipDetails.guide} subValue={internshipDetails.guideEmail} />

                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase">TYPE</p>
                                    <span className="inline-block px-3 py-1 bg-purple-50 text-purple-600 rounded text-xs font-black uppercase tracking-tighter mt-1">{internshipDetails.type}</span>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase">STATUS</p>
                                    <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-600 rounded text-xs font-black uppercase tracking-tighter mt-1">{internshipDetails.status}</span>
                                </div>

                                <DetailItem label="START DATE" value={internshipDetails.startDate} bold />
                                <DetailItem label="EXPECTED END DATE" value={internshipDetails.endDate} bold />
                                <DetailItem label="DURATION" value={internshipDetails.duration} bold />
                                <DetailItem label="LOCATION" value={internshipDetails.location} bold />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'Logs' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-[#0F172A]">Weekly Progress Logs</h2>
                            <button
                                onClick={() => setShowLogModal(true)}
                                className="bg-[#0F172A] hover:bg-slate-800 text-white font-bold px-6 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-sm active:scale-95"
                            >
                                <Plus size={18} /> Add New Log
                            </button>
                        </div>

                        {logs.map((log) => (
                            <div key={log.week} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-xl font-bold text-[#0F172A]">Week {log.week}: {log.dates}</h3>
                                        <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-black uppercase tracking-widest mt-1">Weekly Report</span>
                                    </div>
                                    <Badge variant={log.status === 'Reviewed' ? 'success' : 'neutral'}>
                                        {log.status}
                                    </Badge>
                                </div>

                                {log.report && (
                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-white p-2 rounded-xl text-red-500 shadow-sm">
                                                <FileText size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">{log.report}</p>
                                                <p className="text-xs text-slate-400 font-medium">{log.size}</p>
                                            </div>
                                        </div>
                                        <button className="text-slate-400 hover:text-blue-600 transition-colors">
                                            <Eye size={18} />
                                        </button>
                                    </div>
                                )}

                                {log.feedback && (
                                    <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                            <Star size={48} className="text-blue-600" />
                                        </div>
                                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-3">Mentor Feedback</p>
                                        <p className="text-sm text-slate-700 font-bold leading-relaxed mb-4">{log.feedback}</p>
                                        <div className="flex items-center gap-1">
                                            {[1, 2, 3, 4, 5].map(s => (
                                                <Star key={s} size={14} className={s <= Math.floor(log.rating || 0) ? 'text-orange-400 fill-orange-400' : 'text-slate-300'} />
                                            ))}
                                            <span className="text-xs font-black text-slate-400 ml-2">{log.rating}/5</span>
                                        </div>
                                    </div>
                                )}

                                {log.status === 'Pending' && (
                                    <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-4 rounded-xl border border-amber-100">
                                        <AlertCircle size={18} />
                                        <p className="text-xs font-bold">Your submission is currently being reviewed by your guide.</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'Closure' && (
                    <div className="bg-white rounded-[32px] p-10 border border-slate-100 shadow-sm relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-8">
                                <CheckCircle2 className="text-emerald-500" size={28} />
                                <h2 className="text-2xl font-black text-[#0F172A]">Internship Closure</h2>
                            </div>

                            <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 mb-8">
                                <p className="text-sm font-bold text-slate-700">Guide Approval Status: <span className="text-orange-600">Pending</span></p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Date of Joining</label>
                                    <div className="relative">
                                        <input type="text" placeholder="dd-mm-yyyy" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" />
                                        <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Date of Completion</label>
                                    <div className="relative">
                                        <input type="text" placeholder="dd-mm-yyyy" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" />
                                        <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Expected Working Days</label>
                                    <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Actual Working Days</label>
                                    <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" />
                                </div>
                            </div>

                            <div className="mt-8 space-y-4">
                                <label className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Upload Final Report</label>
                                <div className="border-2 border-dashed border-slate-200 rounded-[32px] p-12 flex flex-col items-center justify-center bg-slate-50/50 group-hover:bg-white transition-colors">
                                    <Upload size={40} className="text-slate-300 mb-4" />
                                    <p className="text-sm font-bold text-slate-500 mb-6">Upload your final internship report</p>
                                    <button className="bg-[#0F2137] text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-900/10 hover:shadow-xl transition-all active:scale-95">
                                        Choose File
                                    </button>
                                </div>
                            </div>

                            <div className="mt-10 flex justify-end">
                                <button className="bg-[#0F2137] text-white px-10 py-4 rounded-xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-900/20 hover:scale-[1.02] transition-all active:scale-95">
                                    Submit for Guide Approval
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Add New Log Modal */}
            {showLogModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowLogModal(false)}></div>
                    <div className="bg-white rounded-[32px] w-full max-w-2xl overflow-hidden relative z-10 animate-in zoom-in-95 duration-300 shadow-2xl">
                        <div className="p-10">
                            <div className="flex justify-between items-start mb-2">
                                <h2 className="text-2xl font-black text-[#0F172A]">Add New Log</h2>
                                <button onClick={() => setShowLogModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                                    <X size={24} />
                                </button>
                            </div>
                            <p className="text-slate-500 font-medium mb-10">Upload your weekly report or log file</p>

                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Log Type</label>
                                    <div className="flex gap-8">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <div className="relative flex items-center justify-center">
                                                <input
                                                    type="radio"
                                                    name="logType"
                                                    checked={logType === 'Weekly Report'}
                                                    onChange={() => setLogType('Weekly Report')}
                                                    className="appearance-none w-5 h-5 border-2 border-slate-200 rounded-full checked:border-blue-600 transition-all"
                                                />
                                                {logType === 'Weekly Report' && <div className="absolute w-2.5 h-2.5 bg-blue-600 rounded-full"></div>}
                                            </div>
                                            <span className="text-sm font-bold text-slate-700">Weekly Report</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <div className="relative flex items-center justify-center">
                                                <input
                                                    type="radio"
                                                    name="logType"
                                                    checked={logType === 'Weekly Log'}
                                                    onChange={() => setLogType('Weekly Log')}
                                                    className="appearance-none w-5 h-5 border-2 border-slate-200 rounded-full checked:border-blue-600 transition-all"
                                                />
                                                {logType === 'Weekly Log' && <div className="absolute w-2.5 h-2.5 bg-blue-600 rounded-full"></div>}
                                            </div>
                                            <span className="text-sm font-bold text-slate-700">Weekly Log</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Upload File</label>
                                    <div className="border-2 border-dashed border-slate-200 rounded-[32px] p-12 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-white transition-colors cursor-pointer group">
                                        <div className="bg-white p-4 rounded-2xl shadow-sm text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                                            <Upload size={32} />
                                        </div>
                                        <p className="text-sm font-bold text-slate-800 mb-1">Drag and drop or click to upload</p>
                                        <p className="text-xs text-slate-400 font-medium mb-8">PDF, DOCX, Images (Max 10MB)</p>
                                        <button className="bg-[#0F2137] text-white px-8 py-3 rounded-xl font-bold text-sm shadow-xl shadow-blue-900/10 active:scale-95 transition-all">
                                            Choose File
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 flex items-center justify-end gap-6 border-t border-slate-100 pt-8">
                                <button onClick={() => setShowLogModal(false)} className="text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">
                                    Cancel
                                </button>
                                <button className="bg-slate-200 text-slate-500 px-10 py-4 rounded-xl font-black text-sm uppercase tracking-widest cursor-not-allowed">
                                    Submit Log
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const DetailItem = ({ label, value, subValue, bold = false, emphasis = false }: any) => (
    <div className="space-y-1">
        <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase">{label}</p>
        <div className="flex flex-col">
            <span className={`text-slate-900 ${emphasis ? 'text-xl font-black' : bold ? 'font-bold' : 'font-semibold'}`}>{value}</span>
            {subValue && <span className="text-xs text-slate-400 font-bold">{subValue}</span>}
        </div>
    </div>
);

export default MyInternshipPortal;
