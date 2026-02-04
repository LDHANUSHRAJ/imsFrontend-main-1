
import { useState, useEffect } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { Users, Building2, Briefcase, Calendar, CheckCircle } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import PlacementStatsChart from '../../components/charts/PlacementStatsChart';
import ApplicationsTrendChart from '../../components/charts/ApplicationsTrendChart';
import DashboardFilters from '../../components/ui/DashboardFilters';
import { AdminService } from '../../services/admin.service';
import { InternshipService } from '../../services/internship.service';
import { Internship } from '../../types';

const ICDashboard = () => {
    const [stats, setStats] = useState<any>({});
    const [pendingInternships, setPendingInternships] = useState<Internship[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [year, setYear] = useState('2024-2025');
    const [batch, setBatch] = useState('All Batches');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch stats and pending internships
                const [statsData, pendingData] = await Promise.all([
                    AdminService.getStats(),
                    InternshipService.getPendingInternships()
                ]);
                setStats(statsData || {});
                setPendingInternships(pendingData || []);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#0F2137]">Internship Coordinator Dashboard</h1>
                    <p className="text-slate-500 text-sm font-medium mt-1">Manage corporate recruiter accounts and global internship sessions.</p>
                </div>
            </div>

            <DashboardFilters
                years={[{ label: '2024-2025', value: '2024-2025' }, { label: '2023-2024', value: '2023-2024' }]}
                batches={[{ label: 'All Batches', value: 'All Batches' }, { label: 'MCA', value: 'MCA' }, { label: 'MBA', value: 'MBA' }]}
                selectedYear={year}
                selectedBatch={batch}
                onYearChange={setYear}
                onBatchChange={setBatch}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Active Students" value={stats.activeStudents || '--'} icon={Users} color="navy" />
                <StatCard label="Corporate Partners" value={stats.corporatePartners || '--'} icon={Building2} color="purple" />
                <StatCard label="Open Vacancies" value={stats.openVacancies || '--'} icon={Briefcase} color="amber" />
                <StatCard label="Pending Approvals" value={pendingInternships.length.toString()} icon={CheckCircle} color="green" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Charts populated with empty/real data placeholders for now */}
                <PlacementStatsChart data={[]} />
                <ApplicationsTrendChart data={[]} />
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
