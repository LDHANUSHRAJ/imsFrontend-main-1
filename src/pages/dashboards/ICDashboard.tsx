import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar, CheckCircle, Briefcase } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import PlacementStatsChart from '../../components/charts/PlacementStatsChart';
import ApplicationsTrendChart from '../../components/charts/ApplicationsTrendChart';
import { AdminService } from '../../services/admin.service';
import { InternshipService } from '../../services/internship.service';
import type { Internship } from '../../types';

const ICDashboard = () => {
    const [stats, setStats] = useState<any>({});
    const [pendingInternships, setPendingInternships] = useState<Internship[]>([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch stats, pending internships, AND chart analytics
                const [statsData, pendingData, analyticsData] = await Promise.all([
                    AdminService.getStats(),
                    InternshipService.getPendingInternships(),
                    AdminService.getDashboardAnalytics()
                ]);

                // Merge analytics into stats object or keep separate. 
                // For simplicity, I'll merge them into the stats state since I used stats.placementStats in the view
                setStats({
                    ...statsData,
                    placementStats: analyticsData.placementStats,
                    applicationTrends: analyticsData.applicationTrends
                });

                setPendingInternships(pendingData || []);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#0F2137]">INTERNSHIPS</h1>
                    <p className="text-slate-500 text-sm font-medium mt-1">Manage global internship sessions and student approvals.</p>
                </div>
                <div className="flex gap-3">
                    <Link to="/profile" className="flex items-center gap-2 bg-white border border-slate-200 text-[#0F2137] px-4 py-2 rounded-lg font-bold text-sm hover:bg-slate-50 transition-colors shadow-sm">
                        <Users className="h-4 w-4" />
                        My Profile
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Active Students" value={stats.activeStudents || '1,245'} icon={Users} color="navy" />
                <StatCard label="Placement Drives" value={stats.placementDrives || '24'} icon={Calendar} color="purple" />
                <StatCard label="Open Vacancies" value={stats.openVacancies || '12'} icon={Briefcase} color="amber" />
                <StatCard label="Pending Approvals" value={pendingInternships.length > 0 ? pendingInternships.length.toString() : '0'} icon={CheckCircle} color="green" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Real Data Charts */}
                <PlacementStatsChart data={stats.placementStats || []} />
                <ApplicationsTrendChart data={stats.applicationTrends || []} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <h3 className="font-bold text-[#0F2137] uppercase tracking-wider text-sm mb-6">Pending Internship Approvals</h3>
                    <div className="space-y-3">
                        {pendingInternships.length > 0 ? (
                            pendingInternships.slice(0, 5).map(internship => (
                                <div key={internship.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                    <div>
                                        <p className="font-bold text-sm text-[#0F2137]">{internship.title}</p>
                                        <p className="text-xs text-slate-500">{internship.department.name}</p>
                                    </div>
                                    <span className="text-xs font-bold text-amber-500 bg-amber-50 px-2 py-1 rounded">Pending</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-slate-500 text-center py-4">No pending requests</p>
                        )}
                    </div>
                </div>

                <div className="bg-[#0F2137] rounded-2xl p-6 text-white shadow-xl shadow-blue-900/20 relative overflow-hidden">
                    <Calendar className="absolute -right-4 -bottom-4 h-32 w-32 text-white/5 rotate-12" />
                    <h3 className="font-bold uppercase tracking-widest text-xs text-blue-400 mb-4">Critical Deadlines</h3>
                    <div className="space-y-6 relative z-10">
                        <div className="border-l-2 border-amber-400 pl-4 py-1">
                            <p className="text-sm font-bold">Student Registration Phase</p>
                            <p className="text-xs text-slate-400">Ends in <span className="text-amber-400">48 Hours</span></p>
                        </div>
                        <div className="border-l-2 border-blue-400 pl-4 py-1">
                            <p className="text-sm font-bold">Offer Letter Uploads</p>
                            <p className="text-xs text-slate-400">Deadline: 15th October 2026</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ICDashboard;
