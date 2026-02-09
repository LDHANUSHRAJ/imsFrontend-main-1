import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FileText, Clock, Briefcase,
    ChevronRight, ArrowUpRight,
    TrendingUp, Star, Building2,
    FileUp, ClipboardCheck, ListChecks,
    AlertCircle, CheckCircle, Calendar
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

    useEffect(() => {
        // Check if user is authenticated
        if (!user) {
            console.log('No user found, redirecting to login');
            navigate('/login/student');
            return;
        }

        const loadDashboardData = async () => {
            setIsLoading(true);
            try {
                const allApps = await InternshipService.getStudentApplications();
                setApplications(allApps || []);
            } catch (error: any) {
                console.error("Dashboard data load failed:", error);

                // Handle 401 Unauthorized - redirect to login
                if (error?.response?.status === 401) {
                    alert('Your session has expired. Please log in again.');
                    localStorage.removeItem('imsUser');
                    navigate('/login/student');
                    return;
                }

                // For other errors, just log and show empty state
                setApplications([]);
            } finally {
                setIsLoading(false);
            }
        };
        loadDashboardData();
    }, [user, navigate]);

    const activeInternship = applications.find(app => app.status === 'ACTIVE');
    const pendingApps = applications.filter(app => app.status === 'SUBMITTED' || app.status === 'PENDING');
    const shortlistedApps = applications.filter(app => app.status === 'SHORTLISTED');

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case 'ACTIVE': return 'success';
            case 'SHORTLISTED': return 'warning';
            case 'SUBMITTED': return 'info';
            case 'REJECTED': return 'error';
            default: return 'neutral';
        }
    };

    // Helper for Stats
    const StatCard = ({ title, value, icon: Icon, color, bg }: any) => (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-slate-500 text-sm font-medium">{title}</p>
                    <h3 className="text-3xl font-bold text-slate-800 mt-2">{value}</h3>
                </div>
                <div className={`p-3 rounded-lg ${bg}`}>
                    <Icon className={color} size={24} />
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in-up md:p-6 font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-200 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-christBlue">My Dashboard</h1>
                    <p className="text-slate-500 mt-1 font-medium">Track your internship journey</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium bg-blue-50 text-christBlue px-4 py-2 rounded-full border border-blue-100">
                        {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Applications"
                    value={applications.length}
                    icon={FileText}
                    color="text-blue-600"
                    bg="bg-blue-50"
                />
                <StatCard
                    title="Pending"
                    value={pendingApps.length}
                    icon={Clock}
                    color="text-amber-600"
                    bg="bg-amber-50"
                />
                <StatCard
                    title="Shortlisted"
                    value={shortlistedApps.length}
                    icon={Star}
                    color="text-purple-600"
                    bg="bg-purple-50"
                />
                <StatCard
                    title="Active"
                    value={activeInternship ? 1 : 0}
                    icon={CheckCircle}
                    color="text-emerald-600"
                    bg="bg-emerald-50"
                />
            </div>

            {/* Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main: Recent Applications */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Active Internship Card */}
                    {activeInternship && (
                        <div className="bg-gradient-to-br from-christBlue to-blue-700 p-6 rounded-xl shadow-lg text-white">
                            <div className="flex items-center gap-2 mb-4">
                                <Briefcase size={20} />
                                <h3 className="text-lg font-bold">Current Internship</h3>
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-2xl font-bold">{activeInternship.internship?.title}</h4>
                                <p className="text-blue-100 font-medium flex items-center gap-2">
                                    <Building2 size={16} />
                                    {activeInternship.internship?.company_name}
                                </p>
                            </div>
                            <button
                                onClick={() => navigate('/my-internship')}
                                className="mt-6 bg-white text-christBlue px-6 py-2.5 rounded-lg font-bold hover:bg-blue-50 transition-colors flex items-center gap-2"
                            >
                                View Details <ArrowUpRight size={16} />
                            </button>
                        </div>
                    )}

                    {/* Recent Applications List */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-800">Recent Applications</h3>
                            <button
                                onClick={() => navigate('/applications')}
                                className="text-sm font-bold text-christBlue hover:underline flex items-center gap-1"
                            >
                                View All <ChevronRight size={16} />
                            </button>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {isLoading ? (
                                <div className="p-12 text-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-christBlue mx-auto"></div>
                                </div>
                            ) : applications.length === 0 ? (
                                <div className="p-12 text-center">
                                    <FileText size={48} className="mx-auto text-slate-300 mb-4" />
                                    <h4 className="text-lg font-bold text-slate-800 mb-2">No Applications Yet</h4>
                                    <p className="text-slate-500 mb-6">Start applying to internships to see them here</p>
                                    <button
                                        onClick={() => navigate('/browse-offers')}
                                        className="bg-christBlue text-white px-6 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition-colors"
                                    >
                                        Browse Internships
                                    </button>
                                </div>
                            ) : (
                                applications.slice(0, 5).map((app) => (
                                    <div key={app.id} className="p-4 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => navigate('/applications')}>
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-slate-800 truncate">{app.internship?.title || 'Internship'}</h4>
                                                <p className="text-sm text-slate-500 truncate">{app.internship?.company_name || 'Company'}</p>
                                            </div>
                                            <Badge variant={getStatusBadgeVariant(app.status)}>
                                                {app.status}
                                            </Badge>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar: Quick Actions */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            {[
                                { icon: Briefcase, label: 'Browse Offers', path: '/browse-offers', color: 'text-blue-600', bg: 'bg-blue-50' },
                                { icon: FileText, label: 'My Applications', path: '/applications', color: 'text-purple-600', bg: 'bg-purple-50' },
                                { icon: ClipboardCheck, label: 'Weekly Reports', path: '/my-internship', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                            ].map((action, i) => (
                                <button
                                    key={i}
                                    onClick={() => navigate(action.path)}
                                    className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-christBlue hover:bg-blue-50 transition-all group"
                                >
                                    <div className={`p-2 rounded-lg ${action.bg}`}>
                                        <action.icon size={18} className={action.color} />
                                    </div>
                                    <span className="text-sm font-bold text-slate-700 group-hover:text-christBlue">{action.label}</span>
                                    <ChevronRight size={16} className="ml-auto text-slate-400 group-hover:text-christBlue" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Performance Insights */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Performance</h3>
                            <TrendingUp size={16} className="text-emerald-500" />
                        </div>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-xs font-medium text-slate-500">Application Rate</span>
                                    <span className="text-xl font-bold text-christBlue">{applications.length}</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-christBlue rounded-full" style={{ width: `${Math.min(100, applications.length * 10)}%` }}></div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                                <div>
                                    <p className="text-2xl font-bold text-slate-800">{shortlistedApps.length}</p>
                                    <p className="text-xs font-medium text-slate-500">Shortlisted</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-slate-800">{activeInternship ? 1 : 0}</p>
                                    <p className="text-xs font-medium text-slate-500">Active</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const resultIcon = (status: string) => {
    switch (status) {
        case 'ACTIVE': return CheckCircle;
        case 'PENDING': return Clock;
        default: return AlertCircle;
    }
};

export default StudentDashboard;
