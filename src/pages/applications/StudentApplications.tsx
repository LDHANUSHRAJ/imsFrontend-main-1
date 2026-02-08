import { useState, useEffect } from 'react';
import {
    Calendar, CheckCircle2, Clock,
    ChevronRight, Building2, FileText,
    Upload, Bell
} from 'lucide-react';
import Badge from '../../components/ui/Badge';
import { InternshipService } from '../../services/internship.service';
import type { StudentApplication, Internship } from '../../types';

const StatusTimeline = ({ currentStatus, createdAt }: { currentStatus: string, createdAt: string }) => {
    const allStages = [
        { status: 'SUBMITTED', label: 'Application Submitted', desc: 'Your profile has been sent to the recruiter.' },
        { status: 'UNDER_REVIEW', label: 'Under Review', desc: 'The hiring team is evaluating your credentials.' },
        { status: 'SHORTLISTED', label: 'Shortlisted', desc: 'You have been moved to the interview round!' },
        { status: 'ACCEPTED', label: 'Offer Received', desc: 'Congratulations! Upload your offer letter to proceed.' },
        { status: 'ACTIVE', label: 'Internship Active', desc: 'Offer approved. Your internship is confirmed!' }
    ];

    const currentIdx = allStages.findIndex(s => s.status === currentStatus);
    const isRejected = currentStatus === 'REJECTED';
    const isArchived = currentStatus === 'ARCHIVED';

    return (
        <div className="mt-8 space-y-6 relative ml-4">
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-slate-100 ml-3.5 -z-10" />

            {allStages.map((stage, idx) => {
                const isPassed = idx < currentIdx || currentStatus === 'ACTIVE';
                const isCurrent = idx === currentIdx;

                return (
                    <div key={idx} className="flex gap-6 relative animate-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${idx * 0.1}s` }}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-4 border-white shadow-sm z-10
                            ${isPassed ? 'bg-emerald-500 text-white' : isCurrent ? 'bg-blue-600 text-white ring-4 ring-blue-50' : 'bg-slate-100 text-slate-300'}`}>
                            {isPassed ? <CheckCircle2 size={14} /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                        </div>
                        <div>
                            <p className={`text-xs font-black uppercase tracking-tight ${isCurrent ? 'text-blue-600' : isPassed ? 'text-slate-900' : 'text-slate-400'}`}>
                                {stage.label}
                            </p>
                            {(isCurrent || (isPassed && idx === currentIdx - 1)) && (
                                <p className="text-[10px] text-slate-400 font-bold mt-0.5 leading-tight max-w-xs">{stage.desc}</p>
                            )}
                            {idx === 0 && (
                                <p className="text-[9px] text-slate-300 font-black mt-1 uppercase">
                                    {new Date(createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                </p>
                            )}
                        </div>
                    </div>
                );
            })}

            {(isRejected || isArchived) && (
                <div className="flex gap-6 relative">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-4 border-white shadow-sm z-10 bg-red-500 text-white">
                        <Clock size={14} />
                    </div>
                    <div>
                        <p className="text-xs font-black uppercase tracking-tight text-red-600">{currentStatus}</p>
                        <p className="text-[10px] text-slate-400 font-bold mt-0.5">Contact placement office for details.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

const StudentApplications = () => {
    const [activeTab, setActiveTab] = useState<'All' | 'Active' | 'Offers'>('All');
    const [applications, setApplications] = useState<StudentApplication[]>([]);
    const [internships, setInternships] = useState<Record<string, Internship>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [apps, allInternships] = await Promise.all([
                    InternshipService.getStudentApplications(),
                    InternshipService.getApprovedInternships()
                ]);
                const internMap = allInternships.reduce((acc: Record<string, Internship>, curr: Internship) => ({ ...acc, [curr.id]: curr }), {});
                setInternships(internMap);
                setApplications(apps);
            } catch (error) {
                console.error('Failed to fetch applications:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);


    const filteredApps = applications.filter(app => {
        if (activeTab === 'All') return app.status !== 'ARCHIVED' && app.status !== 'REJECTED';
        if (activeTab === 'Active') {
            // Show all in-progress applications
            return ['SUBMITTED', 'UNDER_REVIEW', 'SHORTLISTED', 'ACCEPTED', 'ACTIVE'].includes(app.status);
        }
        if (activeTab === 'Offers') {
            // Show only applications that have received offers and need offer letter upload
            return app.status === 'ACCEPTED' && !app.offer_letter_url;
        }
        return true;
    });

    const getStatusVariant = (status: string): any => {
        switch (status) {
            case 'ACTIVE': return 'success';
            case 'OFFER_RECEIVED': return 'info';
            case 'SHORTLISTED': return 'navy';
            case 'UNDER_REVIEW': return 'warning';
            case 'REJECTED': return 'error';
            case 'ARCHIVED': return 'outline';
            default: return 'neutral';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-[#0F172A] tracking-tighter">Application Hub</h1>
                    <p className="text-slate-400 font-bold mt-1 uppercase text-xs tracking-[0.2em] opacity-60">Track your progress and manage offers</p>
                </div>
                <div className="flex items-center gap-3">
                </div>
            </div>

            {/* Notification Bar */}
            <div className="bg-[#0F172A] p-6 rounded-[2rem] shadow-2xl text-white relative overflow-hidden group">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-blue-600/20 text-blue-400 rounded-2xl flex items-center justify-center border border-blue-500/30 group-hover:scale-110 transition-transform">
                            <Bell size={24} className="animate-bounce" />
                        </div>
                        <div>
                            <p className="text-lg font-black italic tracking-tight">Need help with onboarding?</p>
                            <p className="text-blue-100/60 text-xs font-bold uppercase tracking-widest">Contact your assigned guide or the IC office.</p>
                        </div>
                    </div>
                </div>
                <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[80px]"></div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 bg-slate-100/50 p-1.5 rounded-2xl max-w-fit border border-slate-100">
                {['All', 'Active', 'Offers'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab
                            ? 'bg-white text-blue-600 shadow-md border border-slate-100'
                            : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Application List */}
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                {isLoading ? (
                    Array(3).fill(0).map((_, i) => (
                        <div key={i} className="h-64 bg-slate-100 rounded-[32px] animate-pulse" />
                    ))
                ) : filteredApps.length > 0 ? (
                    filteredApps.map((app) => {
                        const intern = internships[app.internship_id];
                        const isExpanded = selectedAppId === app.id;

                        return (
                            <div key={app.id} className={`bg-white rounded-[32px] border border-slate-100 shadow-sm transition-all relative overflow-hidden group
                                ${isExpanded ? 'ring-2 ring-blue-500 ring-offset-4 shadow-xl' : 'hover:border-blue-200'}`}>
                                <div className="p-8">
                                    <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                                        <div className="flex-1 flex gap-6">
                                            <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-blue-50 transition-colors">
                                                <Building2 size={32} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-2xl font-black text-[#0F172A] tracking-tighter italic uppercase">{intern?.title || 'Unknown Role'}</h3>
                                                    <Badge variant={getStatusVariant(app.status)}>
                                                        {app.status.replace('_', ' ')}
                                                    </Badge>
                                                </div>
                                                <div className="flex flex-wrap gap-4 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                                    <span className="flex items-center gap-1.5"><Building2 size={12} /> {intern?.company_name}</span>
                                                    <span className="flex items-center gap-1.5"><Calendar size={12} /> Applied {new Date(app.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
                                                    {app.resume_link && <span className="flex items-center gap-1.5 text-blue-600/60 lowercase italic tracking-normal"><FileText size={12} /> resume_attachment_v1.pdf</span>}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 shrink-0">
                                            {/* Show upload button for applications without offer letter */}
                                            {!app.offer_letter_url && (
                                                <div className="relative">
                                                    <input
                                                        type="file"
                                                        id={`upload-offer-${app.id}`}
                                                        className="hidden"
                                                        accept=".pdf,.doc,.docx,.jpg,.png"
                                                        onChange={async (e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                try {
                                                                    await InternshipService.uploadOfferLetter(app.id, file);
                                                                    alert("Offer letter uploaded successfully!");
                                                                    window.location.reload(); // Simple reload to refresh state
                                                                } catch (err) {
                                                                    console.error("Upload failed", err);
                                                                    alert("Failed to upload offer letter.");
                                                                }
                                                            }
                                                        }}
                                                    />
                                                    <label
                                                        htmlFor={`upload-offer-${app.id}`}
                                                        className="bg-emerald-500 text-white font-black text-xs uppercase tracking-widest px-6 py-3.5 rounded-xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all flex items-center gap-2 cursor-pointer"
                                                    >
                                                        <Upload size={16} /> Upload Offer
                                                    </label>
                                                </div>
                                            )}
                                            {/* Show link to view uploaded offer letter */}
                                            {app.offer_letter_url && (
                                                <a
                                                    href={app.offer_letter_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="bg-blue-50 text-blue-600 font-black text-xs uppercase tracking-widest px-6 py-3.5 rounded-xl hover:bg-blue-100 transition-all flex items-center gap-2"
                                                >
                                                    <FileText size={16} /> View Offer Letter
                                                </a>
                                            )}
                                            <button
                                                onClick={() => setSelectedAppId(isExpanded ? null : app.id)}
                                                className={`p-3.5 rounded-xl transition-all ${isExpanded ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}>
                                                {isExpanded ? <ChevronRight size={20} className="rotate-90" /> : <ChevronRight size={20} />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Expanded Timeline View */}
                                    {isExpanded && (
                                        <div className="mt-10 pt-10 border-t border-slate-50 grid md:grid-cols-2 gap-12 animate-in fade-in slide-in-from-top-4 duration-500">
                                            <div>
                                                <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6 border-l-4 border-blue-600 pl-3">Live Progress Tracker</h4>
                                                <StatusTimeline currentStatus={app.status} createdAt={app.created_at} />
                                            </div>
                                            <div className="bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100 flex flex-col justify-between">
                                                <div>
                                                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4">Application Insights</h4>
                                                    <p className="text-sm text-slate-500 leading-relaxed font-medium">Your profile matches <span className="text-blue-600 font-black">92%</span> of the required skills for this role. We have notified the recruiter about your strong alignment.</p>
                                                </div>
                                                <div className="mt-8 space-y-3">
                                                    <button className="w-full py-4 bg-white text-[#0F172A] font-black text-xs uppercase tracking-widest rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2">
                                                        <FileText size={16} /> View Submission Details
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="py-32 bg-white rounded-[40px] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
                            <Clock size={40} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-300 italic uppercase">Quiet in here...</h3>
                        <p className="text-slate-400 max-w-xs mt-2 font-bold opacity-60">Complete your profile or explore new offers to see them here.</p>
                        <button className="mt-8 text-blue-600 font-black uppercase text-xs hover:underline decoration-2 underline-offset-4 tracking-widest">Explore Opportunities</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentApplications;
