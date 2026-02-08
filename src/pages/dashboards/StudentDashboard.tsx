import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FileText, CheckCircle, Clock, Briefcase,
    ChevronRight, ArrowUpRight,
    TrendingUp, Star, Building2, User,
    FileUp, ClipboardCheck, LayoutGrid, ListChecks,
    CheckCircle2, AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { InternshipService } from '../../services/internship.service';
import type { StudentApplication } from '../../types';

const StudentDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [applications, setApplications] = useState<StudentApplication[]>([]);
    const [internships, setInternships] = useState<Record<string, any>>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadDashboardData = async () => {
            setIsLoading(true);
            try {
                console.log("=== STUDENT DASHBOARD: Loading data ===");

                // Fetch student applications and approved internships
                const [allApps, allInternships] = await Promise.all([
                    InternshipService.getStudentApplications(),
                    InternshipService.getApprovedInternships()
                ]);

                console.log("Applications loaded:", allApps);
                console.log("Internships loaded:", allInternships);

                // Create a map of internship_id to internship details
                const internMap = allInternships.reduce((acc: Record<string, any>, curr: any) => ({
                    ...acc,
                    [curr.id]: curr
                }), {});

                setApplications(allApps || []);
                setInternships(internMap);

                console.log("=== STUDENT DASHBOARD: Data loaded successfully ===");
            } catch (error) {
                console.error("=== STUDENT DASHBOARD: Failed to load ===", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadDashboardData();
    }, []);

    // Core State Determination
    const activeInternship = applications.find(app => app.status === 'ACTIVE');
    const hasOffer = applications.find(app => app.status === 'OFFER_RECEIVED');
    const hasShortlist = applications.filter(app => app.status === 'SHORTLISTED');

    // Calculate completion based on logs if active, otherwise 0
    // For now, we approximate based on status for the dashboard view
    const completionPercentage = activeInternship ? 10 : 0; // TODO: Fetch real progress from backend

    return (
        <div className="min-h-screen bg-slate-50 p-6 space-y-8">
            {/* PLACEMENT CONFIRMATION BANNER */}
            {activeInternship && (
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 p-6 rounded-3xl shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white">
                            <CheckCircle2 size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-emerald-900 uppercase tracking-tight">
                                ✓ Placement Confirmed
                            </h3>
                            <p className="text-sm text-emerald-700 font-bold">
                                {activeInternship.internship?.title || 'Active Internship'} at {activeInternship.internship?.corporate?.company_name || 'Company'}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* OVERVIEW SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12 pointer-events-none">
                        <Building2 size={200} />
                    </div>

                    <div className="relative">
                        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-3xl font-black shadow-xl">
                            {user?.name?.substring(0, 1)}
                        </div>
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-4xl font-black text-[#0F2137] tracking-tighter mb-2 italic uppercase">
                            Welcome Back, {user?.name?.split(' ')[0]}
                        </h1>
                        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">
                            {activeInternship ? 'Internship Active' : hasOffer ? 'Offer Received' : hasShortlist.length > 0 ? `${hasShortlist.length} Shortlisted` : 'Exploring Opportunities'}
                        </p>

                        <div className="w-full md:w-64 bg-slate-50 rounded-2xl p-5 border border-slate-100 mt-4">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-xs font-black text-slate-400 uppercase">Completion</span>
                                <span className="text-lg font-black text-blue-600">{completionPercentage}%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-600 rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(37,99,235,0.4)]"
                                    style={{ width: `${completionPercentage}%` }}
                                />
                            </div>
                            <p className="text-[10px] text-slate-400 mt-2 font-bold italic">4 of 10 Weekly Logs Submitted</p>
                        </div>
                    </div>

                    <div className="bg-[#0F172A] p-6 rounded-3xl text-white shadow-2xl relative overflow-hidden group border border-slate-800">
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                            <User size={80} />
                        </div>
                        <h4 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-6">Assigned Guide</h4>
                        {activeInternship ? (
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-xl font-bold border border-slate-700">
                                        AK
                                    </div>
                                    <div>
                                        <p className="font-black text-sm">Prof. Amit Kumar</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase">Computer Science</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" className="w-full justify-between bg-slate-800/50 hover:bg-slate-800 text-xs border-slate-700 h-10 px-4">
                                    Message Guide <ChevronRight size={14} />
                                </Button>
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-xs text-slate-500 font-bold italic">Not assigned yet</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* QUICK ACTIONS - Updated alignment */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-4">
                    {[
                        { label: 'Apply Now', icon: Briefcase, color: 'blue', path: '/internships' },
                        { label: 'Offer Letter', icon: FileUp, color: 'emerald', path: '/applications' },
                        { label: 'Weekly Log', icon: ClipboardCheck, color: 'purple', path: '/weekly-reports' },
                        { label: 'Applications', icon: LayoutGrid, color: 'amber', path: '/applications' },
                        { label: 'Status', icon: ListChecks, color: 'indigo', path: '/applications' }
                    ].map((action, i) => (
                        <button
                            key={i}
                            onClick={() => navigate(action.path)}
                            className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-lg hover:-translate-y-1 transition-all group text-center flex flex-col items-center justify-center"
                        >
                            <div className={`w-12 h-12 rounded-xl mb-3 flex items-center justify-center bg-${action.color}-50 text-${action.color}-600 group-hover:bg-${action.color}-600 group-hover:text-white transition-colors`}>
                                <action.icon size={20} />
                            </div>
                            <span className="text-xs font-black text-[#0F2137] uppercase tracking-tight">{action.label}</span>
                        </button>
                    ))}
                </div>

                {/* MAIN CONTENT GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* LEFT: Applications & Offers */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-[#0F2137]">Active Enrollments</h3>
                            <Button variant="ghost" size="sm" onClick={() => navigate('/applications')}>View All <ChevronRight size={16} /></Button>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50/50 border-b border-slate-100 text-slate-400 font-black uppercase tracking-widest text-[10px]">
                                    <tr>
                                        <th className="px-8 py-5">Internship Detail</th>
                                        <th className="px-6 py-5">Applied Date</th>
                                        <th className="px-6 py-5 text-center">Status</th>
                                        <th className="px-8 py-5 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {isLoading ? (
                                        <tr><td colSpan={4} className="text-center py-20"><ClipboardCheck className="animate-spin text-slate-100 inline" size={48} /></td></tr>
                                    ) : applications.length === 0 ? (
                                        <tr><td colSpan={4} className="text-center py-20 text-slate-400 font-bold italic italic">No active applications currently.</td></tr>
                                    ) : (
                                        applications.slice(0, 5).map((app) => (
                                            <tr key={app.id} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                            <Building2 size={24} />
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-[#0F2137]">{app.internship?.title || 'Unknown Position'}</p>
                                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{app.internship?.corporate?.company_name || 'Unknown Company'}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-slate-500 font-bold text-xs">
                                                    {new Date(app.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </td>
                                                <td className="px-6 py-5 text-center">
                                                    <Badge variant={
                                                        app.status === 'ACTIVE' ? 'success' :
                                                            app.status === 'SHORTLISTED' ? 'info' :
                                                                app.status === 'REJECTED' ? 'error' :
                                                                    app.status === 'ARCHIVED' ? 'outline' : 'warning'
                                                    } className="font-black px-3 py-1 rounded-full text-[10px] uppercase">
                                                        {app.status.replace('_', ' ')}
                                                    </Badge>
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    <button
                                                        onClick={() => navigate(`/applications/${app.id}`)}
                                                        className="p-3 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all"
                                                    >
                                                        <ArrowUpRight size={22} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* RIGHT: Stats & Notifications */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                            <h3 className="font-black text-[#0F2137] mb-6 flex items-center gap-2 italic text-lg">
                                <TrendingUp size={20} className="text-blue-600" /> Stats Overview
                            </h3>
                            <div className="space-y-3">
                                <div className="p-4 bg-slate-50 rounded-2xl flex justify-between items-center group hover:bg-blue-50 transition-colors">
                                    <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Applications</span>
                                    <span className="text-2xl font-black text-[#0F2137] group-hover:text-blue-600">{applications.length}</span>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl flex justify-between items-center group hover:bg-purple-50 transition-colors">
                                    <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Shortlisted</span>
                                    <span className="text-xl font-black text-[#0F2137] group-hover:text-purple-600">{hasShortlist.length}</span>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl flex justify-between items-center">
                                    <span className="text-xs font-black text-slate-400 uppercase">Credits Earned</span>
                                    <Badge variant="outline" className="text-xs font-black border-slate-200">0.0 / 4.0</Badge>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
