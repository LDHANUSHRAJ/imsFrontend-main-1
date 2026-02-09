import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

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

    const currentIdx = allStages.findIndex(s => s.status === currentStatus || (s.status === 'ACCEPTED' && currentStatus === 'OFFER_RECEIVED'));
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
    const [activeTab, setActiveTab] = useState<'All' | 'Active'>('All');
    const [applications, setApplications] = useState<StudentApplication[]>([]);
    const [internships, setInternships] = useState<Record<string, Internship>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const location = useLocation();

    useEffect(() => {
        if (location.state?.selectedAppId) {
            setSelectedAppId(location.state.selectedAppId);
        }
    }, [location.state]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Fetch applications first as primary data
                let apps: StudentApplication[] = [];
                try {
                    apps = await InternshipService.getStudentApplications();
                } catch (e) {
                    console.error("Failed to fetch applications", e);
                    throw new Error("Could not load your applications. Please try again later.");
                }

                setApplications(apps);

                // Try to fetch internship details to enrich the view, but don't block if it fails
                try {
                    const allInternships = await InternshipService.getApprovedInternships();
                    const internMap = allInternships.reduce((acc: Record<string, Internship>, curr: Internship) => ({ ...acc, [curr.id]: curr }), {});
                    setInternships(internMap);
                } catch (e) {
                    console.warn("Failed to fetch internship details for enrichment", e);
                    // We can still show applications using embedded data if available
                }

            } catch (error: any) {
                console.error('Failed to fetch data:', error);
                setError(error.message || "An error occurred while loading data.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);


    const filteredApps = applications.filter(app => {
        if (selectedAppId && app.id === selectedAppId) return true;
        if (activeTab === 'All') return app.status !== 'ARCHIVED' && app.status !== 'REJECTED';
        if (activeTab === 'Active') {
            // Show all in-progress applications
            return ['SUBMITTED', 'UNDER_REVIEW', 'SHORTLISTED', 'ACCEPTED', 'ACTIVE'].includes(app.status);
        }
        return true;
    });

    const getStatusVariant = (status: string): any => {
        switch (status) {
            case 'ACTIVE': return 'success';
            case 'ACCEPTED': return 'info';
            case 'OFFER_RECEIVED': return 'info';
            case 'SHORTLISTED': return 'navy';
            case 'UNDER_REVIEW': return 'warning';
            case 'REJECTED': return 'error';
            case 'ARCHIVED': return 'outline';
            default: return 'neutral';
        }
    };

    return (
        <div className="space-y-8 animate-fade-in-up md:p-6 font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-200 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-christBlue">My Applications</h1>
                    <p className="text-slate-500 mt-1 font-medium">Track the status of your internship applications.</p>
                </div>
                <div className="flex gap-2">
                    {['All', 'Active'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab
                                ? 'bg-christBlue text-white shadow-md'
                                : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                                }`}
                        >
                            {tab} Applications
                        </button>
                    ))}
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <p className="text-sm font-medium">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="ml-auto text-xs underline font-bold hover:text-red-800"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Application List */}
            <div className="grid grid-cols-1 gap-6">
                {isLoading ? (
                    <div className="flex justify-center p-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-christBlue"></div>
                    </div>
                ) : filteredApps.length > 0 ? (
                    filteredApps.map((app) => {
                        const intern = internships[app.internship_id];
                        const isExpanded = selectedAppId === app.id;
                        const offerLetterUrl = app.offer_letter_url;

                        return (
                            <div key={app.id} className={`bg-white rounded-xl border border-slate-200 shadow-sm transition-all overflow-hidden
                                ${isExpanded ? 'ring-2 ring-blue-500/20 shadow-md' : 'hover:shadow-md'}`}>
                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                                        <div className="flex-1 flex gap-4">
                                            <div className="w-14 h-14 bg-blue-50 rounded-lg flex items-center justify-center shrink-0 text-christBlue font-bold text-xl uppercase">
                                                {(app.internship?.corporate?.company_name || intern?.company_name || 'C').charAt(0)}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="text-lg font-bold text-slate-900">
                                                        {app.internship?.title || intern?.title || 'Unknown Role'}
                                                    </h3>
                                                    <Badge variant={getStatusVariant(app.status)}>
                                                        {app.status.replace('_', ' ')}
                                                    </Badge>
                                                </div>
                                                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-500 font-medium">
                                                    <span className="flex items-center gap-1.5">
                                                        <Building2 size={14} />
                                                        {app.internship?.company_name || app.internship?.corporate?.company_name || intern?.company_name || 'Unknown Company'}
                                                    </span>
                                                    <span className="flex items-center gap-1.5"><Calendar size={14} /> Applied {new Date(app.created_at).toLocaleDateString()}</span>
                                                    {app.resume_link && <span className="flex items-center gap-1.5 text-blue-600"><FileText size={14} /> Resume Sent</span>}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                                            {/* Offer Letter Upload Trigger */}
                                            {['ACCEPTED', 'OFFER_RECEIVED', 'ACTIVE'].includes(app.status) && !offerLetterUrl && (
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
                                                                    window.location.reload();
                                                                } catch (err) {
                                                                    console.error("Upload failed", err);
                                                                    alert("Failed to upload offer letter.");
                                                                }
                                                            }
                                                        }}
                                                    />
                                                    <label
                                                        htmlFor={`upload-offer-${app.id}`}
                                                        className="bg-emerald-600 text-white font-bold text-xs uppercase px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 cursor-pointer"
                                                    >
                                                        <Upload size={14} /> Upload Offer
                                                    </label>
                                                </div>
                                            )}

                                            {offerLetterUrl && (
                                                <a
                                                    href={offerLetterUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="bg-blue-50 text-blue-600 font-bold text-xs uppercase px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2"
                                                >
                                                    <FileText size={14} /> View Offer
                                                </a>
                                            )}

                                            <button
                                                onClick={() => setSelectedAppId(isExpanded ? null : app.id)}
                                                className={`p-2 rounded-lg transition-colors border ${isExpanded ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'}`}>
                                                <ChevronRight size={20} className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Timeline */}
                                    {isExpanded && (
                                        <div className="mt-8 pt-8 border-t border-slate-100 animate-in fade-in slide-in-from-top-2">
                                            <h4 className="text-sm font-bold text-slate-900 mb-6">Application Timeline</h4>
                                            <StatusTimeline currentStatus={app.status} createdAt={app.created_at} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="py-20 bg-white rounded-xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                            <Clock size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">No applications found</h3>
                        <p className="text-slate-500 mt-1">Start applying to internships to see them here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentApplications;
