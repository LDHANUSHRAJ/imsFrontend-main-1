import { useState, useEffect } from 'react';
import {
    FileText, Plus, X,
    Upload, CheckCircle, Download
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { InternshipService } from '../../services/internship.service';
import type { WeeklyReportResponse } from '../../types';

const MyInternshipPortal = () => {
    const [activeTab, setActiveTab] = useState<'Current' | 'Logs' | 'Closure'>('Current');
    const [showLogModal, setShowLogModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // State
    const [internship, setInternship] = useState<any>(null); // Could be Internship or ExternalInternship
    const [reports, setReports] = useState<WeeklyReportResponse[]>([]);

    // Form State
    const [reportForm, setReportForm] = useState({
        week_number: '',
        title: '',
        description: '',
        achievements: '',
        challenges: '',
        plans: ''
    });

    useEffect(() => {
        loadPortalData();
    }, []);

    const loadPortalData = async () => {
        setIsLoading(true);
        try {
            const status = await InternshipService.getPlacementStatus();
            if (status && status.internship) {
                setInternship(status.internship);
            }

            const myReports = await InternshipService.getMyReports();
            setReports(myReports);
        } catch (error) {
            console.error("Failed to load portal data", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReportSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await InternshipService.submitWeeklyReport({
                week_number: parseInt(reportForm.week_number),
                title: reportForm.title,
                description: reportForm.description,
                achievements: reportForm.achievements,
                challenges: reportForm.challenges,
                plans: reportForm.plans,
                internship_id: internship?.id // Backend might infer this from user context, but good to have
            });
            alert("Weekly report submitted successfully!");
            setShowLogModal(false);
            setReportForm({ week_number: '', title: '', description: '', achievements: '', challenges: '', plans: '' });
            loadPortalData();
        } catch (error) {
            console.error(error);
            alert("Failed to submit report.");
        }
    };

    if (isLoading) return <div className="p-8 text-center">Loading portal...</div>;

    if (!internship) return (
        <div className="p-8 text-center bg-white rounded-[32px] border border-slate-100 shadow-sm">
            <h2 className="text-2xl font-black text-slate-800">No Active Internship</h2>
            <p className="text-slate-500 mt-2">Once you have an active internship, you can track it here.</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#0F172A]">My Internship</h1>
                    <p className="text-slate-500 font-medium mt-1">Track your internship progress and submit logs</p>
                </div>
                {/* <button className="bg-[#0F172A] hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-xl transition-all flex items-center gap-2 shadow-sm active:scale-95">
                    <Download size={20} /> Download Complete Report
                </button> */}
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
                                <DetailItem label="COMPANY" value={internship.company_name || 'N/A'} emphasis />
                                <DetailItem label="ROLE" value={internship.title || internship.position || 'Intern'} emphasis />
                                {/* Add more details as available from backend response */}
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase">STATUS</p>
                                    <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-600 rounded text-xs font-black uppercase tracking-tighter mt-1">ACTIVE</span>
                                </div>
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

                        {reports.length === 0 ? (
                            <p className="text-slate-500 italic">No reports submitted yet.</p>
                        ) : (
                            reports.map((report) => (
                                <div key={report.id} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h3 className="text-xl font-bold text-[#0F172A]">Week {report.week_number}: {report.title}</h3>
                                            <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-black uppercase tracking-widest mt-1">Submitted: {new Date(report.submitted_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-700">
                                        <p className="font-bold mb-1">Description:</p>
                                        <p className="mb-2">{report.description}</p>
                                        <p className="font-bold mb-1">Achievements:</p>
                                        <p>{report.achievements || '-'}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'Closure' && (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <div className="bg-white rounded-[32px] p-10 border border-slate-100 shadow-sm">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-10">
                                <div className="space-y-2">
                                    <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                                        <CheckCircle size={12} /> Eligible for Graduation Credits
                                    </div>
                                    <h2 className="text-3xl font-black text-[#0F172A]">Internship Closure</h2>
                                    <p className="text-slate-500 font-medium">Complete your final requirements to receive the completion certificate.</p>
                                </div>
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center min-w-[180px]">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                                    <p className="text-xl font-black text-blue-600 uppercase tracking-tighter">In Progress</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-6">
                                    <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-600">
                                                <Upload size={20} />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Completion Certificate</h4>
                                                <p className="text-xs text-slate-400 font-bold">PDF or Image (Max 5MB)</p>
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="file"
                                                className="hidden"
                                                id="cert-upload"
                                                accept=".pdf,.jpg,.jpeg,.png"
                                            />
                                            <label
                                                htmlFor="cert-upload"
                                                className="w-full h-16 bg-white border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center gap-3 text-slate-400 font-bold text-xs uppercase cursor-pointer hover:border-blue-400 hover:text-blue-500 transition-all"
                                            >
                                                <Plus size={18} /> Select Final Certificate
                                            </label>
                                        </div>
                                    </div>

                                    <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-600">
                                                <FileText size={20} />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Final Reflection Report</h4>
                                                <p className="text-xs text-slate-400 font-bold">Summarize your learning</p>
                                            </div>
                                        </div>
                                        <textarea
                                            placeholder="What were your key takeaways from this journey?"
                                            className="w-full h-32 bg-white border border-slate-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none font-medium"
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-[#0F172A] p-8 rounded-[2rem] text-white space-y-6 shadow-xl shadow-blue-900/10">
                                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-blue-400">Closure Checklist</h4>
                                        <ul className="space-y-4">
                                            {[
                                                { label: 'Minimum 8 Weekly Logs Submitted', done: reports.length >= 8 },
                                                { label: 'Faculty Guide Final Evaluation', done: false },
                                                { label: 'Completion Certificate Uploaded', done: false },
                                                { label: 'Internship Feedback Form', done: true },
                                            ].map((item, idx) => (
                                                <li key={idx} className="flex items-center gap-3">
                                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${item.done ? 'bg-emerald-500' : 'bg-white/10'}`}>
                                                        {item.done ? <CheckCircle size={12} /> : <div className="w-1 h-1 bg-white/40 rounded-full" />}
                                                    </div>
                                                    <span className={`text-xs font-bold ${item.done ? 'text-white' : 'text-slate-400'}`}>{item.label}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl uppercase tracking-widest text-[10px] mt-4">
                                            Submit for Final Approval
                                        </Button>
                                    </div>

                                    <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 flex items-center gap-5">
                                        <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-400">
                                            <Download size={24} />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-slate-400 uppercase tracking-tight">IMS Certificate</h4>
                                            <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest italic">Locked until approval</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Add New Report Modal */}
            {showLogModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowLogModal(false)}></div>
                    <div className="bg-white rounded-[32px] w-full max-w-2xl overflow-hidden relative z-10 animate-in zoom-in-95 duration-300 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <form onSubmit={handleReportSubmit} className="p-10">
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-2xl font-black text-[#0F172A]">Submit Weekly Report</h2>
                                <button type="button" onClick={() => setShowLogModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="Week Number"
                                        type="number"
                                        value={reportForm.week_number}
                                        onChange={(e) => setReportForm({ ...reportForm, week_number: e.target.value })}
                                        required
                                    />
                                    <Input
                                        label="Title"
                                        value={reportForm.title}
                                        onChange={(e) => setReportForm({ ...reportForm, title: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[80px]"
                                        value={reportForm.description}
                                        onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Achievements</label>
                                    <textarea
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[60px]"
                                        value={reportForm.achievements}
                                        onChange={(e) => setReportForm({ ...reportForm, achievements: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Challenges</label>
                                    <textarea
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[60px]"
                                        value={reportForm.challenges}
                                        onChange={(e) => setReportForm({ ...reportForm, challenges: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Future Plans</label>
                                    <textarea
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[60px]"
                                        value={reportForm.plans}
                                        onChange={(e) => setReportForm({ ...reportForm, plans: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end gap-3">
                                <Button type="button" variant="outline" onClick={() => setShowLogModal(false)}>Cancel</Button>
                                <Button type="submit" className="bg-[#0F2137]">Submit Report</Button>
                            </div>
                        </form>
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
