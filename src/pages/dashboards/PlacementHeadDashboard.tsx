import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { InternshipService } from '../../services/internship.service';
import { RecruiterService } from '../../services/recruiter.service';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import {
    Briefcase, CheckCircle, Clock, TrendingUp, Building2,
    ArrowRight, Activity, Shield
} from 'lucide-react';
import { PlacementHeadStats } from '../../types';

const PlacementHeadDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { addNotification } = useNotifications();
    const [stats, setStats] = useState<PlacementHeadStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [pendingRecruiters, setPendingRecruiters] = useState<any[]>([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Parallel fetch for speed
                const [statsData, pendingData] = await Promise.all([
                    InternshipService.getPlacementHeadStats(),
                    RecruiterService.getGlobalPendingRecruiters() // Already returns correct array
                ]);

                console.log("PlacementHeadDashboard Stats:", statsData);
                console.log("PlacementHeadDashboard Pending Recruiters:", pendingData);

                setStats(statsData);
                // Ensure we handle array or wrapped response
                const pData = Array.isArray(pendingData) ? pendingData : (pendingData as any)?.data || [];
                setPendingRecruiters(pData.slice(0, 5)); // Show top 5 pending
            } catch (error) {
                console.error("Dashboard fetch error:", error);
                // Silent fail for dashboard to not block UI, but log it
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-christBlue"></div>
            </div>
        );
    }

    const StatCard = ({ title, value, icon: Icon, color, bg }: any) => (
        <div className={`bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all`}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-wide">{title}</p>
                    <h3 className="text-3xl font-black text-slate-800 mt-2">{value}</h3>
                </div>
                <div className={`p-3 rounded-lg ${bg}`}>
                    <Icon className={color} size={24} />
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in-up md:p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-200 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-christBlue">Placement Head Portal</h1>
                    <p className="text-slate-500 mt-1 font-medium">Institutional oversight and approval dashboard.</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm font-bold bg-blue-50 text-christBlue px-4 py-2 rounded-full border border-blue-100">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Placed"
                    value={stats?.total_placed || 0}
                    icon={CheckCircle}
                    color="text-emerald-600"
                    bg="bg-emerald-50"
                />
                <StatCard
                    title="Active Internships"
                    value={stats?.internships_by_status?.APPROVED || 0}
                    icon={Briefcase}
                    color="text-blue-600"
                    bg="bg-blue-50"
                />
                <StatCard
                    title="Corporate Partners"
                    value={stats?.corporate_count || 0}
                    icon={Building2}
                    color="text-purple-600"
                    bg="bg-purple-50"
                />
                <StatCard
                    title="Pending Reviews"
                    // Sum of Pending Internships (from stats) + Pending Recruiters (local state)
                    value={(stats?.pending_reviews || 0) + pendingRecruiters.length}
                    icon={Clock}
                    color="text-amber-600"
                    bg="bg-amber-50"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Pending Approvals Section */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <Shield className="text-christGold" size={20} />
                            Pending Recruiter Approvals
                        </h2>
                        <button
                            onClick={() => navigate('/company-approvals')}
                            className="text-sm font-bold text-christBlue hover:underline flex items-center gap-1"
                        >
                            View All <ArrowRight size={14} />
                        </button>
                    </div>

                    <div className="divide-y divide-slate-50">
                        {pendingRecruiters.length === 0 ? (
                            <div className="p-12 text-center text-slate-500">
                                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="text-slate-300" size={32} />
                                </div>
                                <p className="font-medium">All recruiters processed. No pending actions.</p>
                            </div>
                        ) : (
                            pendingRecruiters.map((recruiter: any) => (
                                <div key={recruiter.user_id || recruiter.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center text-christBlue font-bold text-xl shadow-sm">
                                            {(recruiter.company_name || recruiter.companyName || recruiter.name || 'C').charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-lg">{recruiter.company_name || recruiter.companyName || recruiter.name}</h4>
                                            <p className="text-xs text-slate-500 font-medium">{recruiter.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-right mr-4 hidden sm:block">
                                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${(recruiter.ai_trust_score || 0) > 80 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                Trust Score: {recruiter.ai_trust_score || 'N/A'}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => navigate('/company-approvals')}
                                            className="px-4 py-2 text-xs font-bold text-white bg-christBlue rounded-lg hover:bg-blue-900 transition-colors shadow-sm"
                                        >
                                            Review
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Quick Actions / Insights Side Panel */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-[#0F2137] to-[#0B2C5D] rounded-xl p-6 text-white shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Activity size={120} />
                        </div>
                        <h3 className="text-lg font-bold mb-4 relative z-10 border-b border-white/10 pb-2">System Health</h3>
                        <div className="space-y-4 relative z-10">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-blue-200">Total Users</span>
                                <span className="font-bold text-lg">{stats?.total_users || 0}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-blue-200">Active Departments</span>
                                <span className="font-bold text-lg">{Object.keys(stats?.internships_by_dept || {}).length}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-blue-200">System Status</span>
                                <span className="font-bold text-emerald-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Operational</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <TrendingUp size={18} className="text-emerald-600" />
                            Top Hiring Departments
                        </h3>
                        <div className="space-y-4">
                            {Object.entries(stats?.internships_by_dept || {})
                                .sort(([, a]: any, [, b]: any) => b - a)
                                .slice(0, 5)
                                .map(([dept, count]: any, idx) => (
                                    <div key={idx} className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-slate-600 truncate max-w-[70%]">{dept}</span>
                                        <span className="text-xs font-bold text-christBlue bg-blue-50 px-3 py-1 rounded-full">{count} Placed</span>
                                    </div>
                                ))}
                            {Object.keys(stats?.internships_by_dept || {}).length === 0 && (
                                <p className="text-sm text-slate-400 italic text-center py-4">No data available yet</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlacementHeadDashboard;
