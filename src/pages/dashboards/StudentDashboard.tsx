import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FileText, CheckCircle, Clock, Briefcase,
    ChevronRight, ArrowUpRight,
    TrendingUp, Star, Building2, User,
    FileUp, ClipboardCheck, ListChecks,
    AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Badge from '../../components/ui/Badge';
import { InternshipService } from '../../services/internship.service';
import type { StudentApplication } from '../../types';

const StudentDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [applications, setApplications] = useState<StudentApplication[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const loadDashboardData = async () => {
            setIsLoading(true);
            try {
                const allApps = await InternshipService.getStudentApplications();
                setApplications(allApps || []);
            } catch (error) {
                console.error("Dashboard data load failed:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadDashboardData();

        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const activeInternship = applications.find(app => app.status === 'ACTIVE');
    const hasOffer = applications.find(app => app.status === 'OFFER_RECEIVED');
    const hasShortlist = applications.filter(app => app.status === 'SHORTLISTED');

    return (
        <div className="min-h-screen bg-[#FDFDFE] p-4 md:p-8 lg:p-12 font-sans selection:bg-[#0B2C5D]/10 selection:text-[#0B2C5D]">
            {/* TOP BAR / NAVIGATION CONTEXT */}
            <div className="max-w-7xl mx-auto mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-100 pb-8">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <span className="w-1.5 h-1.5 bg-[#0B2C5D] rounded-full animate-pulse"></span>
                        <h4 className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-slate-400">Student Portal Command</h4>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-light text-slate-900 tracking-tight">
                        Welcome, <span className="font-medium text-[#0B2C5D]">{user?.name?.split(' ')[0]}</span>
                    </h1>
                </div>

                <div className="flex flex-wrap items-center gap-6">
                    <div className="text-right">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Current Session</p>
                        <p className="text-sm font-semibold text-slate-800">
                            {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                        </p>
                    </div>
                    <div className="hidden sm:block h-10 w-px bg-slate-100"></div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-bold text-[#0B2C5D] uppercase tracking-tighter">{user?.role?.replace('_', ' ')}</p>
                            <p className="text-[10px] text-slate-400 font-medium">Christ University</p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-white shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center justify-center text-slate-400 transform hover:rotate-[8deg] transition-all cursor-pointer">
                            <User size={22} className="text-[#0B2C5D]" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* PRIMARY ACTIONS & STATUS (LEFT COLUMN) */}
                <div className="lg:col-span-8 space-y-12">
                    {/* STATUS HERO */}
                    <div className="relative overflow-hidden bg-white rounded-[2.5rem] border border-slate-200/50 p-8 md:p-12 shadow-2xl shadow-slate-200/30 transition-all hover:shadow-emerald-900/5 group">
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-12">
                            <div className="flex-1 space-y-8">
                                <div className="space-y-4">
                                    <div className="inline-flex items-center gap-2 bg-[#0B2C5D]/5 px-4 py-1.5 rounded-full">
                                        <div className={`w-2 h-2 rounded-full ${activeInternship ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400 animate-pulse'}`}></div>
                                        <span className="text-[11px] font-bold uppercase tracking-widest text-[#0B2C5D]">
                                            {activeInternship ? 'System Live / Interning' : 'Application Active'}
                                        </span>
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-light text-slate-900 leading-[1.15] tracking-tight">
                                        {activeInternship
                                            ? <span className="block">You are currently placed at <span className="font-semibold text-[#0B2C5D]">{activeInternship.internship?.corporate?.company_name}</span> as a Technical Intern.</span>
                                            : hasOffer
                                                ? "Critical: New offer received. Action required within 48 hours for validation."
                                                : <span className="block">Your profile is currently <span className="font-semibold text-[#0B2C5D]">Shortlisted</span> for {hasShortlist.length} positions. Keep track of your interviews.</span>}
                                    </h2>
                                </div>
                                <div className="flex flex-wrap gap-4 pt-4">
                                    <button
                                        onClick={() => navigate('/internships')}
                                        className="inline-flex items-center gap-3 bg-[#0B2C5D] text-white px-7 py-4 rounded-2xl text-sm font-bold shadow-lg shadow-[#0B2C5D]/20 transition-all hover:bg-[#0F3C7E] hover:scale-105 active:scale-100"
                                    >
                                        <Briefcase size={18} /> Opportunity Portal
                                    </button>
                                    <button
                                        onClick={() => navigate('/applications')}
                                        className="inline-flex items-center gap-3 bg-white text-[#0B2C5D] border-2 border-[#0B2C5D]/10 px-7 py-4 rounded-2xl text-sm font-bold transition-all hover:bg-slate-50 hover:border-[#0B2C5D]/20"
                                    >
                                        Active Tracking <ArrowUpRight size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="shrink-0 w-full md:w-40 lg:w-48 flex flex-col items-center justify-center p-8 bg-slate-50/50 backdrop-blur-sm rounded-[2rem] border border-white/50 shadow-inner">
                                <span className="text-[10px] font-extrabold text-[#0B2C5D]/40 uppercase tracking-[0.2em] mb-4">Milestone</span>
                                <div className="text-4xl font-light text-[#0B2C5D] mb-4 tracking-tighter">
                                    {activeInternship ? '10%' : '0%'}
                                </div>
                                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-[#0B2C5D] to-[#2563EB] rounded-full transition-all duration-1000 ease-in-out"
                                        style={{ width: activeInternship ? '10%' : '0%' }}
                                    ></div>
                                </div>
                                <p className="text-[9px] font-bold text-slate-400 mt-4 uppercase tracking-widest">Phase 1 of 5</p>
                            </div>
                        </div>
                        {/* Elegant background flair */}
                        <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000 pointer-events-none">
                            <Building2 size={300} strokeWidth={1} />
                        </div>
                    </div>

                    {/* RECENT APPLICATIONS (Modular List) */}
                    <div className="space-y-8">
                        <div className="flex items-center justify-between px-2">
                            <div className="space-y-1">
                                <h3 className="text-lg font-semibold text-slate-900 tracking-tight">Active Enrollments</h3>
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Your last 4 submissions</p>
                            </div>
                            <button onClick={() => navigate('/applications')} className="group flex items-center gap-2 text-xs font-bold text-[#0B2C5D] hover:opacity-70 transition-all">
                                Full Registry <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
                            {isLoading ? (
                                <div className="h-64 flex flex-col items-center justify-center gap-4 bg-white rounded-3xl border border-slate-100 italic text-slate-400">
                                    <div className="w-8 h-8 border-2 border-slate-200 border-t-[#0B2C5D] rounded-full animate-spin"></div>
                                    <span className="text-xs font-bold uppercase tracking-widest">Synchronizing...</span>
                                </div>
                            ) : applications.length === 0 ? (
                                <div className="bg-white rounded-[2rem] border border-dashed border-slate-200 py-20 text-center space-y-4">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                                        <FileText size={32} />
                                    </div>
                                    <p className="text-slate-400 text-sm font-medium italic">No active enrollments detected.</p>
                                </div>
                            ) : (
                                applications.slice(0, 4).map((app) => (
                                    <div
                                        key={app.id}
                                        onClick={() => navigate(`/applications/${app.id}`)}
                                        className="bg-white rounded-[1.75rem] border border-slate-200/40 p-6 flex items-center justify-between gap-6 transition-all hover:border-[#0B2C5D]/10 hover:shadow-xl hover:shadow-slate-200/20 cursor-pointer group hover:-translate-y-1"
                                    >
                                        <div className="flex items-center gap-6 flex-1 min-w-0">
                                            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#0B2C5D] group-hover:text-white transition-all duration-500 transform group-hover:rotate-[10deg]">
                                                <Building2 size={24} strokeWidth={1.5} />
                                            </div>
                                            <div className="truncate space-y-1">
                                                <h4 className="text-base font-bold text-slate-800 truncate group-hover:text-[#0B2C5D] transition-colors">{app.internship?.title || 'System Intern'}</h4>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">{app.internship?.corporate?.company_name || 'Verification Pending'}</span>
                                                    <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                                    <span className="text-[10px] text-slate-300 font-bold italic">{new Date(app.created_at).getFullYear()} Cycle</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-8 shrink-0">
                                            <div className="hidden sm:block text-right">
                                                <p className="text-[10px] font-extrabold text-slate-300 uppercase tracking-widest mb-1">Status</p>
                                                <Badge variant={
                                                    app.status === 'ACTIVE' ? 'success' :
                                                        app.status === 'SHORTLISTED' ? 'info' :
                                                            app.status === 'REJECTED' ? 'error' : 'warning'
                                                } className="lowercase font-bold rounded-full px-4 py-1 border-0 shadow-sm">
                                                    {app.status.replace('_', ' ')}
                                                </Badge>
                                            </div>
                                            <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-[#0B2C5D]/5 group-hover:text-[#0B2C5D] transition-all">
                                                <ChevronRight size={18} />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* SIDEBAR WIDGETS (RIGHT COLUMN) */}
                <div className="lg:col-span-4 space-y-12">
                    {/* QUICK ACTION TILES */}
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-slate-400 px-2 underline decoration-[#0B2C5D]/20 underline-offset-4">Core Utilities</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { icon: FileText, label: 'Applications', path: '/applications' },
                                { icon: ClipboardCheck, label: 'Weekly Logs', path: '/weekly-reports' },
                                { icon: ListChecks, label: 'Offer Status', path: '/applications' },
                                { icon: FileUp, label: 'Materials', path: '/materials' },
                            ].map((action, i) => (
                                <button
                                    key={i}
                                    onClick={() => navigate(action.path)}
                                    className="bg-white border border-slate-200/50 p-7 rounded-3xl flex flex-col items-center justify-center gap-4 transition-all hover:bg-slate-50 hover:border-[#0B2C5D]/20 hover:scale-[1.02] shadow-sm active:scale-95 group"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 group-hover:bg-[#0B2C5D]/5 flex items-center justify-center text-slate-400 group-hover:text-[#0B2C5D] transition-all">
                                        <action.icon size={22} strokeWidth={1.5} />
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{action.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* FACULTY GUIDE WIDGET */}
                    <div className="relative overflow-hidden bg-[#0B2C5D] rounded-[2.5rem] p-8 md:p-10 text-white shadow-2xl shadow-[#0B2C5D]/20 transition-all hover:-translate-y-1 group">
                        <div className="relative z-10 space-y-8">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h3 className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-blue-300/60">Faculty Mentor</h3>
                                    <p className="text-xs font-semibold text-blue-200">Consultation Hub</p>
                                </div>
                                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                                    <Star size={18} className="text-yellow-400 fill-yellow-400" />
                                </div>
                            </div>

                            {activeInternship ? (
                                <div className="space-y-8">
                                    <div className="flex items-center gap-5 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                        <div className="relative">
                                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-[#0B2C5D] flex items-center justify-center text-xl font-bold border-2 border-white/20">
                                                AK
                                            </div>
                                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#0B2C5D]"></div>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-lg leading-tight truncate">Prof. Amit Kumar</p>
                                            <p className="text-[10px] text-blue-300 font-bold uppercase tracking-wider truncate">Comp. Science / Guide</p>
                                        </div>
                                    </div>
                                    <button className="w-full bg-white text-[#0B2C5D] py-4 rounded-2xl text-xs font-extrabold uppercase tracking-widest transition-all hover:bg-blue-50 active:scale-[0.98] shadow-lg shadow-black/10">
                                        Open Consultation Window
                                    </button>
                                </div>
                            ) : (
                                <div className="py-4 space-y-4">
                                    <div className="w-14 h-14 rounded-[1.5rem] bg-white/5 border border-white/10 flex items-center justify-center text-blue-300 shadow-inner">
                                        <AlertCircle size={24} />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm font-bold text-blue-50 leading-snug">Verification in progress.</p>
                                        <p className="text-[11px] text-blue-300 font-medium italic opacity-80 leading-relaxed">Guide assignments are automated upon position confirmation.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* Dramatic decorative flair */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                    </div>

                    {/* ACTIVITY INSIGHTS */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-200/50 p-8 md:p-10 space-y-10 shadow-sm">
                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <h3 className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-slate-400">Application Performance</h3>
                                <div className="p-2 bg-emerald-50 rounded-xl">
                                    <TrendingUp size={16} className="text-emerald-500" />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">Total Active Submissions</span>
                                        <span className="text-3xl font-light text-[#0B2C5D] tracking-tighter">{applications.length}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-[#0B2C5D] rounded-full" style={{ width: `${Math.min(100, applications.length * 10)}%` }}></div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8 pt-4">
                                    <div className="space-y-2 border-l-2 border-[#0B2C5D]/10 pl-4">
                                        <p className="text-2xl font-light text-slate-800 tracking-tight">{hasShortlist.length}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Shortlists</p>
                                    </div>
                                    <div className="space-y-2 border-l-2 border-emerald-100 pl-4">
                                        <div className="flex items-center gap-1.5">
                                            <p className="text-2xl font-light text-slate-800 tracking-tight">{activeInternship ? 1 : 0}</p>
                                            {activeInternship && <CheckCircle size={14} className="text-emerald-500" />}
                                        </div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Offers</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-10 border-t border-slate-100 relative overflow-hidden">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 shadow-sm shadow-orange-100">
                                    <Clock size={20} />
                                </div>
                                <div>
                                    <h4 className="text-[11px] font-extrabold text-[#0B2C5D] uppercase tracking-[0.2em] mb-0.5">Global Deadline</h4>
                                    <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">Weekly Log 05</p>
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 font-medium leading-[1.6]">
                                Ensure all logs are verified by <span className="text-slate-900 font-extrabold">Friday, 17:00 IST</span>. Pending validations may affect credit points.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subfooter Flair */}
            <div className="max-w-7xl mx-auto mt-20 text-center">
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.4em]">IMS Global Dashboard &copy; 2024</p>
            </div>
        </div>
    );
};

export default StudentDashboard;
